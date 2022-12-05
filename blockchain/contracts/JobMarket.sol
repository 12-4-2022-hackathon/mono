// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./SubmissionValidation.sol";

contract JobMarket is Ownable, ReentrancyGuard, AccessControl {

    uint private _validatorCount;
    address private _owner;
    uint private _balance;

    constructor(uint validatorCount) {
        _validatorCount = validatorCount;
        _owner = msg.sender;
        _balance = 0;
        _setupRole(DEFAULT_ADMIN_ROLE, _owner);
    }

    struct Job {
        uint id;
        uint256 bounty;
        uint submitTime;
        string description;
        address owner;
        bool jobVerified;
        bytes32 workerRole;
        string filePath;
        address[] approvedWorkers;
        uint submissionCount;
        mapping(address => SubmissionValidation.Metadata) submissions;
    }

    Job[] public jobs;
    mapping(address => mapping(uint => bytes32)) public roleMapping;
    mapping(uint => address[]) public workerRequests;

    event JobCreation(uint indexed id, address indexed owner, uint256 indexed bounty);
    event JobResultSubmission(uint indexed jobId, address indexed worker, uint indexed submitTime);
    event JobCompletedConfirmation(uint indexed id);

    function submitJob(string memory description, string memory filePath) public payable nonReentrant {
        // verify bounty
        uint256 bounty = msg.value;
        require(bounty > 0, "Bounty must be greater than 0");
        uint jobId = jobs.length;

        // create worker identifier roles
        bytes32 worker = keccak256(abi.encodePacked(block.timestamp, msg.sender));
        
        // create job
        Job storage newJob = jobs.push();
        newJob.id = jobId;
        newJob.bounty = bounty;
        newJob.submitTime = block.timestamp;
        newJob.description = description;
        newJob.owner = msg.sender;
        newJob.jobVerified = false;
        newJob.workerRole = worker;
        newJob.filePath = filePath;
        newJob.submissionCount = 0;

        // transfer and emit
        emit JobCreation(jobId, msg.sender, bounty);
    }

    function submitWorkerRequest(uint jobId) public nonReentrant returns (uint) {
        require(msg.sender != jobs[jobId].owner, "Worker request failed");
        workerRequests[jobId].push(msg.sender);
        return workerRequests[jobId].length - 1;
    }

    function approveWorkerRequest(uint jobId, uint queueId) public nonReentrant {
        // check role, index, and validator count
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender));
        require(queueId >= 0 && queueId < workerRequests[jobId].length);
        require(jobs[jobId].approvedWorkers.length < _validatorCount);
        
        // assign roles
        address requestNeedingApproval = workerRequests[jobId][queueId];
        jobs[jobId].approvedWorkers.push(requestNeedingApproval);
        grantRole(jobs[jobId].workerRole, requestNeedingApproval);
    }

    function submitJobResult(uint jobId, uint x1, uint y1, uint x2, uint y2) public nonReentrant {
        // check role and submission status
        require(hasRole(jobs[jobId].workerRole, msg.sender), "Caller is not a worker");
        require(!jobs[jobId].submissions[msg.sender].submitted, "Caller already has submission");

        // push and emit
        jobs[jobId].submissions[msg.sender] = SubmissionValidation.Metadata({
            worker: msg.sender,
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            submitted: true,
            verified: false
        });
        jobs[jobId].submissionCount += 1;
        emit JobResultSubmission(jobId, msg.sender, block.timestamp);

        // trigger settlement
        if (jobs[jobId].submissionCount == _validatorCount) {
            
            // find the validated workers
            uint approvedLength = jobs[jobId].approvedWorkers.length;
            SubmissionValidation.Metadata[] memory submissionList = new SubmissionValidation.Metadata[](approvedLength);
            for (uint i = 0; i < approvedLength; i++) {
                address approvedWorker = jobs[jobId].approvedWorkers[i];
                submissionList[i] = jobs[jobId].submissions[approvedWorker];
            }
            address[] memory successfulWorkers = SubmissionValidation.performSettlement(submissionList);

            // split 90% of bounty to the workers
            uint256 splitBounty = (jobs[jobId].bounty * 9) / 10;
            uint256 workerDividend = splitBounty / successfulWorkers.length;
            for (uint i = 0; i < successfulWorkers.length; ++i) {
                (bool success, ) = successfulWorkers[i].call{value : workerDividend}("");
                require(success, "Transfer failed");
            }
            jobs[jobId].jobVerified = true;
            emit JobCompletedConfirmation(jobId);
        }
    }

    struct JobReturn {
        uint id;
        uint256 bounty;
        uint submitTime;
        string description;
        address owner;
        bool jobVerified;
        bytes32 workerRole;
        string filePath;
        address[] approvedWorkers;
        uint submissionCount;
        SubmissionValidation.Metadata[] submissions;
    }

    function listJobs() public view returns (JobReturn[] memory results) {
        results = new JobReturn[](jobs.length);
        for (uint i = 0; i < jobs.length; i++) {
            SubmissionValidation.Metadata[] memory submissionArray = 
                new SubmissionValidation.Metadata[](jobs[i].submissionCount);
            for (uint j = 0; j < jobs[i].submissionCount; j++) {
                submissionArray[j] = jobs[i].submissions[
                    jobs[i].approvedWorkers[j]
                ];
            }
            results[i] = JobReturn({
                id: jobs[i].id,
                bounty: jobs[i].bounty,
                submitTime: jobs[i].submitTime,
                description: jobs[i].description,
                owner: jobs[i].owner, 
                jobVerified: jobs[i].jobVerified,
                workerRole: jobs[i].workerRole,
                filePath: jobs[i].filePath,
                approvedWorkers: jobs[i].approvedWorkers,
                submissionCount: jobs[i].submissionCount,
                submissions: submissionArray
            });
        }
    }

    function listNumJobs() public view returns (uint) {
        return jobs.length;
    }
    
    function listWorkerRequests() public view returns (address[][] memory results) {
        results = new address[][](jobs.length);
        for (uint i = 0; i < jobs.length; i++) {
            address[] memory tmp = new address[](workerRequests[i].length);
            for (uint j = 0; j < workerRequests[i].length; j++) {
                tmp[j] = workerRequests[i][j];
            }
            results[i] = tmp;
        }
    }
}