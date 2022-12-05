// import { useEffect, useState } from "react"
// import { useWeb3React } from "@web3-react/core"
// import { Web3Provider } from "@ethersproject/providers"
// import { BigNumber } from "@ethersproject/bignumber"
// import useSWR from "swr"

// export function Balance() {
// 	const { account, library } = useWeb3React<Web3Provider>()
// 	const [balance, setBalance] = useState<BigNumber | null>(null)

// 	const getBalance = async (walletAddress: string): Promise<BigNumber | null> => {
// 		if (!library) return null
// 		const balance = await library.getBalance(walletAddress)
// 		return balance
// 	}

// 	useEffect(() => {
// 		if (!account) return
// 		getBalance(account).then((balance) => setBalance(balance))
// 	}, [])

// 	if (balance === null) {
// 		return <div>Loading...</div>
// 	} else {
// 		return <div>Balance: {balance.toString()} wei </div>
// 	}
// }

import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import Web3 from "web3" // import the Web3 library
import React from "react"

export function Balance() {
	const { account, library } = useWeb3React<Web3Provider>()
	const [balance, setBalance] = useState<string | null>(null)
	// create an instance of the Web3 library

	const getBalance = async (walletAddress: string): Promise<string | null> => {
		if (!library) return null
		const web3 = new Web3(library)
		if (!web3) return null
		const balance = await web3.eth.getBalance(walletAddress)
		return balance
	}

	useEffect(() => {
		console.log("account", account)

		if (!account) return
		getBalance(account).then((balance) => setBalance(balance))
	}, [])

	if (balance === null) {
		return <div>Loading...</div>
	} else {
		return <div>Balance: {balance.toString()} wei </div>
	}
}
