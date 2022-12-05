// import { CONTRACT_INFO } from "./constants"

// import JobMarket.json from public folder

export const JOBMARKET_DEPLOYMENT = require('../abi.json');

export const getContract = async (library: any) => {
	const { address, abi } = JOBMARKET_DEPLOYMENT
	const contract = new library.eth.Contract(abi, address)
	return contract
}

export const getGasEstimate = async () => {
	// in actual production, this would be an api call that fetches an estimate of gas price
	return 1000000
}

// bounty might need to be BigNumber instead of number
export const createJob = async (web3: any, bounty: number, description: string, filePath: string) => {
	const contract = await getContract(web3.library)
    console.log(contract)
	try {
		const res = await contract.methods.submitJob(description, filePath).send({
			from: web3.account,
			gas: await getGasEstimate(),
			value: bounty,
		})
		return res
	} catch (e) {
		throw e
	}
}

export const listJobs = async (web3: any) => {
	const contract = await getContract(web3.library)
    try {
        const res = await contract.methods.listJobs().call({
            from: web3.account,
            gas: await getGasEstimate(),
        })
        return res
    } catch (e) {
        throw e
    }
}

// get an unfinished job and return the job object

export const getJob = async(web3: any) => {
    const contract = await getContract(web3.library)

    try {
        console.log(contract)
        const res = await contract.methods.listNumJobs().call({
            from: web3.account,
            gas: await getGasEstimate(),
        })
        console.log(res)
        const jobRes = await contract.methods.listJob(res-1).call({
            from: web3.account,
            gas: await getGasEstimate(),
        })
        return jobRes
    } catch (e) {
        throw e
    }
}

export const listNumJobs = async (web3: any) => {
	const contract = await getContract(web3.library)
	try {
        const res = await contract.methods.listNumJobs().call({
            from: web3.account,
            gas: await getGasEstimate(),
        })
        return res
    }
    catch (e) {
        throw e
    }
	
}

export const submitJobResult = async (web3: any, jobId: number, x1: number, x2: number, y1: number, y2: number) => {
    const contract = await getContract(web3.library)

    try {
        const res = await contract.methods.submitJobResult(jobId,x1,y1,x2,y2).send({
            from: web3.account,
            gas: await getGasEstimate(),
        })
        return res
    }
    catch (e) {
        throw e
    }
}