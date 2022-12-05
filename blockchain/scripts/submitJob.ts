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
            value: ethers.utils.parseEther("10"),
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
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});