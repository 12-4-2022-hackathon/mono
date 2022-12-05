import { useWeb3React } from "@web3-react/core"
import React from "react"
import { Background } from "../Components/Background"
import UploadImage from "../Components/UploadImage"
import { Balance } from "../Util/balance"
import styled from "styled-components"

const PageContainer = styled.div`
	text-align: center;
	font-family: "Avenir Next";
	color: black;
`

const Heading = styled.h1`
	margin-top: 20px;
	font-size: 54px;
`

const Button = styled.button`
	background: linear-gradient(to right, #d53369, #daae51);
	border: none;
	color: white;
	padding: 15px 32px;
	text-align: center;
	text-decoration: none;
	display: inline-block;
	font-size: 16px;
	margin: 4px 2px;
	cursor: pointer;
	border-radius: 10px;
`

export function Dashboard() {
	const { active, account, deactivate } = useWeb3React()

	async function disconnect() {
		try {
			deactivate()
		} catch (ex) {
			console.error(ex)
		}
	}
	if (!active) {
		return <div>Loading...</div>
	}
	return (
		<div>
			<Background />
			<PageContainer>
				<div style={{ height: "50px" }} />
				<Heading>Dashboard</Heading>
				<div>Connected to Wallet {account}</div>
				<Balance />
				{/* <UploadImage /> */}
				<Button onClick={() => (window.location.href = "/createjob")}>Create Job</Button>
				<Button onClick={() => (window.location.href = "/labelimages")}>Label Images</Button>
				<Button onClick={disconnect}>Sign out</Button>
			</PageContainer>
		</div>
	)
}
