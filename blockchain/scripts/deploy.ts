import { ethers } from "hardhat";
import fs from 'fs';

const JOBMARKET_ARTIFACT_PATH = "./artifacts/contracts/JobMarket.Sol/JobMarket.json";
const SUBMISSIONVALIDATION_ARTIFACT_PATH = "./artifacts/contracts/SubmissionValidation.Sol/SubmissionValidation.json";

const MARKET_ABI = JSON.parse(
  fs.readFileSync(JOBMARKET_ARTIFACT_PATH, "utf8")
)["abi"];
const SUBMISSION_ABI = JSON.parse(
  fs.readFileSync(SUBMISSIONVALIDATION_ARTIFACT_PATH, "utf8")
)["abi"];
const ABI_DEPLOYMENT_INFO = '../frontend/src/abi.json';
const deployment = JSON.parse(fs.readFileSync(ABI_DEPLOYMENT_INFO, 'utf8'));

async function main() {
  const Library = await ethers.getContractFactory("SubmissionValidation");
  const library = await Library.deploy()
  await library.deployed();

  const VALIDATOR_COUNT = 2;
  const JobMarket = await ethers.getContractFactory("JobMarket", {
    // libraries: {
    //   SubmissionValidation: library.address,
    // },
  });
  const jobMarket = await JobMarket.deploy(VALIDATOR_COUNT)
  await jobMarket.deployed();

  const address = jobMarket.address;
  const libAddress = library.address;
  console.log("Library deployed at:" , libAddress)
  console.log("JobMarket deployed at: ", address)

  deployment.address = address;
  deployment.submission_address = libAddress;
  deployment.abi = MARKET_ABI;
  deployment.submissions_abi = SUBMISSION_ABI;
  
  fs.writeFileSync(
    'deployment.json', JSON.stringify({ address: address, submission_address: libAddress }, null, 2)
  );
  const deploymentString = JSON.stringify(deployment, null, 2);
  
  fs.writeFileSync(ABI_DEPLOYMENT_INFO, deploymentString);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
