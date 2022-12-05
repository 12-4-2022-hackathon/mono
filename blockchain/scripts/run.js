let a = artifacts.require("../contracts/JobMarket.sol");
let b = artifacts.require("../contracts/SubmissionValidation.sol");

module.exports = function(deployer) {
    deployer.deploy(b)
    deployer.deploy(a)
}