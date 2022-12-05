import React, { useState } from "react"

import { useWeb3React } from "@web3-react/core"
import { injected } from "../Util/injected"
import styled from "styled-components"
import { Background } from "../Components/Background"
const FormContainer = styled.div`
	text-align: center;
	font-family: "Avenir Next";
	color: black;
`

const Form = styled.form`
	display: inline-block;
	margin: 0 auto;
	padding: 20px;
	border: 2px solid black;
	border-radius: 10px;
`

const Label = styled.label`
	display: block;
	margin-bottom: 10px;
	font-size: 18px;
`

const Input = styled.input`
	width: 200px;
	padding: 12px 20px;
	margin: 8px 0;
	box-sizing: border-box;
	border: 2px solid black;
	border-radius: 4px;
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

export function CreateJob() {
	const { active, activate, account } = useWeb3React()

	// create form with the following information:
	// text fill: Job bounty in eth
	// text fill: Total workers per image
	// using UploadImage component: image files involved

	const [bounty, setBounty] = useState(0)
	const [workers, setWorkers] = useState(0)
	const [images, setImages] = useState(null)

	return (
		<div>
			<Background />
			<div style={{ height: "30px" }} />
			<FormContainer>
				<h1>Create Job</h1>
				<div>Wallet {account}</div>
				<div style={{ height: "10px" }} />

				<Form>
					<Label>
						Bounty{"  "}
						<Input type="text" onChange={(e) => setBounty(parseInt(e.target.value))} name="bounty" />
						<span> Wei</span>
					</Label>

					<Label>
						Workers{"  "}
						<Input type="text" onChange={(e) => setWorkers(parseInt(e.target.value))} name="workers" />
					</Label>

                    <Label>
                        Images{"  "}
                        <Input type="file" onChange={(e) => setImages(e.target.files)} name="images" id="files" multiple={true}/>
                    </Label>

					<Button type="submit">Submit</Button>
				</Form>
			</FormContainer>
		</div>
	)
}
