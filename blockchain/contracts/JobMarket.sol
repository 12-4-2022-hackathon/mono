// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./SubmissionValidation.sol";

contract JobMarket is Ownable, ReentrancyGuard, AccessControl {

    uint private _validatorCount;
    address private _owner;
    
    constructor(uint validatorCount) {
        _validatorCount = validatorCount;
        _owner = msg.sender;
        _setupRole(DEFAULT_ADMIN_ROLE, _owner);
    }

    struct Job {
        uint id;
        uint256 bounty;
        uint submitTime;
        string description;
        address owner;
        bool jobVerified;
        string ipfsHash;
        address[] approvedWorkers;
        uint submissionCount;
        mapping(address => SubmissionValidation.Metadata) submissions;
    }

    Job[] public jobs;

    event JobCreation(uint indexed id, address indexed owner, uint256 indexed bounty);
    event JobResultSubmission(uint indexed jobId, address indexed worker, uint indexed submitTime);
    event JobCompletedConfirmation(uint indexed id);

    function submitJob(string memory description, string memory ipfsHash) public payable nonReentrant {
        // verify bounty
        uint256 bounty = msg.value;
        require(bounty > 0, "Bounty must be greater than 0");
        uint jobId = jobs.length;

        // create job
        Job storage newJob = jobs.push();
        newJob.id = jobId;
        newJob.bounty = bounty;
        newJob.submitTime = block.timestamp;
        newJob.description = description;
        newJob.owner = msg.sender;
        newJob.jobVerified = false;
        newJob.ipfsHash = ipfsHash;
        newJob.submissionCount = 0;

        // transfer and emit
        emit JobCreation(jobId, msg.sender, bounty);
    }

    function submitJobResult(uint jobId, uint x1, uint y1, uint x2, uint y2) public nonReentrant {
        // check submission status
        require(jobId >= 0 && jobId < jobs.length, "Invalid jobId");
        require(jobs[jobId].approvedWorkers.length < _validatorCount, "Max workers reached");
        require(!jobs[jobId].submissions[msg.sender].submitted, "Caller already has submission");
        
        // push and emit
        jobs[jobId].approvedWorkers.push(msg.sender);
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
                (bool success, ) = successfulWorkers[i].call{ value: workerDividend }("");
                require(success, "Transfer failed");
            }
            jobs[jobId].jobVerified = true;
            emit JobCompletedConfirmation(jobId);
        }
    }

    function listJobSubmissions(uint jobId) public view returns (SubmissionValidation.Metadata[] memory results) {
        require(jobId >= 0 && jobId < jobs.length);
        results = new SubmissionValidation.Metadata[](jobs[jobId].submissionCount);
        for (uint i = 0; i < jobs[jobId].submissionCount; i++) {
            results[i] = jobs[jobId].submissions[
                jobs[jobId].approvedWorkers[i]
            ];
        }
    }

    function listNumJobs() public view returns (uint) {
        return jobs.length;
    }
}