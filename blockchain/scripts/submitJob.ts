import { ethers } from "hardhat";
import fs from "fs";

const deployment = JSON.parse(fs.readFileSync('deployment.json', 'utf8'));
const CONTRACT_ADDRESS = deployment.address;
const LIB_ADDRESS = deployment.submission_address;

async function main() {
    const signers = await ethers.getSigners();
    const signer = signers[1];

    const factory = await ethers.getContractFactory("JobMarket", {
        libraries: {
            SubmissionValidation: LIB_ADDRESS,
        }
    });
    const contract = factory.attach(CONTRACT_ADDRESS);

    // submit job
    console.log("Creator address:", signer.address);
    console.log("Creator starting balance:", (await signer.getBalance()).toString());
    const txn = await contract.connect(signer).submitJob(
        "label the momma cow in the photo below", 
        "/test/path/on/ipfs", 
        {
            value: ethers.utils.parseEther("100"),
        }
    )
    const receipt = await txn.wait();
    console.log(receipt)
    console.log("Creator end balance:", (await signer.getBalance()).toString());
    const event = receipt.events?.filter((e) => e.event === "JobCreation")[0];
    console.log(event)
    const taskId = event!.args!.id;
    console.log("Job ID:", taskId.toString());
    const job = await contract.jobs(taskId);
    console.log(job)

    // submitWorkerRequest
    const signer2 = signers[2];
    console.log("Worker address:", signer2.address);
    console.log("Worker starting balance:", (await signer2.getBalance()).toString());
    const txn2 = await contract.connect(signer2).submitJobResult(taskId, 0, 1, 3, 4)
    const receipt2 = await txn2.wait();
    console.log("Worker end balance:", (await signer2.getBalance()).toString());
    const event2 = receipt2.events?.filter((e) => e.event === "JobResultSubmission")[0];
    console.log(event2)

    // listJobSubmissions
    console.log(await contract.listJobSubmissions(taskId))

    // submitWorkerRequest
    const signer3 = signers[3];
    console.log("Worker address:", signer3.address);
    console.log("Worker starting balance:", (await signer3.getBalance()).toString());
    const txn3 = await contract.connect(signer3).submitJobResult(taskId, 0, 1, 3, 5)
    const receipt3 = await txn3.wait();
    console.log("Worker end balance:", (await signer3.getBalance()).toString());
    const event3 = receipt3.events?.filter((e) => e.event === "JobCompletedConfirmation")[0];
    console.log(event3)

    // listJobSubmissions
    console.log(await contract.listJobSubmissions(taskId))
    console.log(await contract.jobs(taskId))
    console.log(await contract.listJob(0))

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});