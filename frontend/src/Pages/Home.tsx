import { useWeb3React } from "@web3-react/core"
import React from "react"
import { useEffect } from "react"
import { Balance } from "../Util/balance"
import { injected } from "../Util/injected"

import UploadImage from "../Components/UploadImage"
import { Background } from "../Components/Background"

import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined"
import SyncAltOutlinedIcon from "@material-ui/icons/SyncAltOutlined"
import Grid from "@material-ui/core/Grid"

export default function Home() {
	const web3 = useWeb3React()
	const { active, account, library, connector, activate, deactivate } = web3

	async function connect() {
		try {
			await activate(injected)
		} catch (ex) {
			console.error(ex)
		}
	}
	return (
		<div>
			<Background />
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					flexDirection: "column",
					color: "black",
					paddingLeft: "15%",
					paddingRight: "15%",
					paddingTop: "10%",
				}}
			>
				<img src={"/logo.png"} alt="logo" style={{ width: "20%", maxWidth: "500px" }} />
				<h1 style={{
						textAlign: "center",
						fontSize: "80px",
						fontWeight: "normal",
						fontFamily: "Avenir Next",
						paddingLeft: "5%",
						paddingRight: "5%",
					}}>
						Block<span style={{
							color:"F2580C"
						}}>Turk</span>
				</h1>
				<h1
					style={{
						textAlign: "center",
						fontSize: "68px",
						fontWeight: "bold",
						fontFamily: "Avenir Next",
						paddingLeft: "5%",
						paddingRight: "5%",
					}}
				>
					The cheapest solution to labeling your training data. Backed by the Blockchain.
				</h1>
				<p style={{ textAlign: "center", fontSize: "40px", fontWeight: "normal", fontFamily: "Avenir Next" }}>
					Our tool uses blockchain technology to securely and accurately label your data.
				</p>
				<p style={{ textAlign: "center", fontSize: "35px", fontWeight: "normal", fontFamily: "Avenir Next" }}>
					Some benefits of using our tool include:
					{/* div with vertical spacing */}
					<div style={{ height: "30px" }} />
					<Grid container justify="center" spacing={3}>
						<Grid item xs={4}>
							<LockOutlinedIcon fontSize="large" />
							<p style={{ fontSize: "14px" }}>Enhanced security</p>
						</Grid>
						<Grid item xs={4}>
							<CheckCircleOutlineOutlinedIcon fontSize="large" />
							<p style={{ fontSize: "14px" }}>Improved Accuracy</p>
						</Grid>
						<Grid item xs={4}>
							<SyncAltOutlinedIcon fontSize="large" />
							<p style={{ fontSize: "14px" }}>Increased Efficiency</p>
						</Grid>
					</Grid>
					{/* <div className="list-disc pl-8" style={{fontSize: "15px"}}>
						<div>Enhanced security</div>
						<div>Improved accuracy</div>
						<div>Increased efficiency</div>
					</div> */}
				</p>
				{!active ? (
					<button
						onClick={connect}
						style={{
							background: "linear-gradient(to right, #d53369, #daae51)",
							border: "none",
							color: "white",
							padding: "15px 32px",
							textAlign: "center",
							textDecoration: "none",
							display: "inline-block",
							fontSize: "16px",
							margin: "4px 2px",
							cursor: "pointer",
							borderRadius: "10px",
						}}
					>
						Try our tool for free
					</button>
				) : (
					<div>
						<button
							onClick={() => (window.location.href = "/dashboard")}
							style={{
								background: "linear-gradient(to right, #d53369, #daae51)",
								border: "none",
								color: "white",
								padding: "15px 32px",
								textAlign: "center",
								textDecoration: "none",
								display: "inline-block",
								fontSize: "16px",
								margin: "4px 2px",
								cursor: "pointer",
								borderRadius: "10px",
							}}
						>
							Go to Dashboard
						</button>
					</div>
				)}
				<div style={{ height: "30px" }} />
				<p style={{ fontFamily: "Avenir Next", fontSize: "16px", fontWeight: "normal", marginTop: "2px" }}>
					Join our satisfied customers and improve the accuracy and security of your data labeling process.
				</p>
				<div style={{ height: "50px" }} />{" "}
			</div>
		</div>
	)
}
