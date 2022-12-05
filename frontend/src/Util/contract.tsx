// import { CONTRACT_INFO } from "./constants"

// import JobMarket.json from public folder

export const getContract = async (web3: any) => {
    const contract_info = await (await fetch("./JobMarket.json")).json()
    const {address, abi} = contract_info
    const contract = new web3.eth.Contract(
        abi, address
    )
    return contract
}

export const createJob = async (web3: any, bounty: number, ) => {

}