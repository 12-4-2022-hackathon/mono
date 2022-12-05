import { Router } from "./Pages/Router"
import { Web3ReactProvider } from "@web3-react/core"
import Web3 from "web3"
import React from "react"

import "./index.css"
import { MetamaskProvider } from "./Components/MetamaskProvider"

function App() {
	return (
		<Web3ReactProvider getLibrary={(provider) => new Web3(provider)}>
			<MetamaskProvider>
				<Router />
			</MetamaskProvider>
		</Web3ReactProvider>
	)
}

export default App
