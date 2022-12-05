import React, { useEffect, useRef, useState } from "react"
import { Background } from "../Components/Background"
import { Canvas, createCanvas } from "node-canvas"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"

const PageContainer = styled.div`
	text-align: center;
	font-family: "Avenir Next";
	color: black;
	padding-top: 20px;

	// max-width: 1000px;
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

export function LabelImages() {
	const canvasRef = useRef<any>(null)
	const [startPos, setStartPos] = useState({ x: 0, y: 0 })
	const [endPos, setEndPos] = useState({ x: 0, y: 0 })
	const [imgurl, setImgurl] = useState<string | null>(null)
	const [fileId, setFileId] = useState<string | null>(null)
	const [img, setImg] = useState<HTMLImageElement | null>(null)

	const { account } = useWeb3React()

	useEffect(() => {
		setImgurl("https://i.imgur.com/mtbl1cr.jpeg")
		setFileId("mtbl1cr")
	}, [])

	useEffect(() => {
		const img = new Image()
		if (!imgurl) return
		img.src = imgurl
		img.onload = async () => {
			setImg(img)
			await new Promise((resolve, _reject) => setTimeout(resolve, 500))
			if (!canvasRef.current) return
			const context = canvasRef.current.getContext("2d")
			// draw image
			if (img) {
				context.drawImage(img, 0, 0)
			}
		}
	}, [imgurl])

	useEffect(() => {})

	const drawRectangle = (x: number, y: number) => {
		if (!canvasRef.current) return
		const context = canvasRef.current.getContext("2d")

		// draw image
		if (img) {
			context.drawImage(img, 0, 0)
		}

		context.beginPath()
		context.lineWidth = 2

		// make the stroke a solid line
		context.setLineDash([])
		context.strokeStyle = "red"

		// make the fill slightly tinted
		context.fillStyle = "rgba(255, 0, 0, 0.2)"
		let rect = canvasRef.current.getBoundingClientRect()

		let tempPos = { x: x - rect.left, y: y - rect.top }

		let sPos = { x: Math.min(startPos.x, tempPos.x), y: Math.min(startPos.y, tempPos.y) }
		let ePos = { x: Math.max(startPos.x, tempPos.x), y: Math.max(startPos.y, tempPos.y) }

		setStartPos(sPos)
		setEndPos(ePos)

		context.rect(startPos.x, startPos.y, x - startPos.x - rect.left, y - startPos.y - rect.top)
		context.stroke()
		context.fill()
	}

	const onSubmit = () => {
		let rect = canvasRef.current.getBoundingClientRect()
		if (img == null) return
		//send to backend
		const data = {
			file_id: fileId,
			worker_address: account,
			x1: Math.floor((startPos.x / rect.width) * img.width),
			y1: Math.floor((startPos.y / rect.height) * img.height),
			x2: Math.floor((endPos.x / rect.width) * img.width),
			y2: Math.floor((endPos.y / rect.height) * img.height),
		}
		console.log(data)
		void data
	}

	if (!img) return <div>loading</div>

	return (
		<div>
			<Background />
			<PageContainer>
				<h1>Label Images</h1>
				<canvas
					ref={canvasRef}
					onMouseDown={(e) => {
						let rect = canvasRef.current.getBoundingClientRect()
						setStartPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
					}}
					onMouseUp={(e) => drawRectangle(e.clientX, e.clientY)}
					width={Math.min(img.width, 1000)}
					height={Math.min(img.height, 1000)}
					style={{ cursor: "crosshair" }}
				/>
				<br />
				{startPos.x == 0 && startPos.y == 0 && endPos.x == 0 && endPos.y == 0 ? "No selection made yet. Click and drag to select a region." :
				`(${Math.floor(startPos.x)},${Math.floor(startPos.y)}) × (${Math.floor(endPos.x)},${Math.floor(endPos.y)})`}
				<br />
				<Button onClick={onSubmit}>Submit</Button>
			</PageContainer>
		</div>
	)

	// const [imageURL, setImageURL] = useState<string | null>(null)
	// const [topLeft, setTopLeft] = useState({ x: 0, y: 0 })
	// const [bottomRight, setBottomRight] = useState({ x: 0, y: 0 })
	// const canvasRef = useRef<any>(null)

	// const [mouseIsDown, setMouseIsDown] = useState(false)

	// // TODO: fetches an image from the backend server
	// useEffect(() => {
	// 	setImageURL("https://i.imgur.com/mtbl1cr.jpeg")
	// }, [])

	// useEffect(() => {
	// 	if (!mouseIsDown) return

	// 	const canvas = canvasRef.current
	// 	const ctx = canvas.getContext("2d")
	// 	// draw image
	// 	const img = new Image()
	// 	if (!imageURL) return
	// 	img.src = imageURL
	// 	img.onload = () => {
	// 		ctx.drawImage(img, 0, 0)
	// 	}
	// 	ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
	// 	ctx.fillRect(topLeft.x, topLeft.y, bottomRight.x, bottomRight.y)
	// }, [mouseIsDown])

	// if (imageURL === null) {
	// 	return <></>
	// }

	// const image = new Image()
	// image.src = imageURL

	// const canvas = canvasRef.current
	// if (!canvas) return <></>
	// const ctx = canvas.getContext("2d")
	// ctx.drawImage(image, 0, 0)

	// const handleMouseDown = (event) => {
	// 	// Update top left corner of box
	// 	setTopLeft({ x: event.clientX, y: event.clientY })
	// 	setMouseIsDown(true)
	// }

	// const handleMouseUp = (event) => {
	// 	// Update bottom right corner of box
	// 	setBottomRight({ x: event.clientX, y: event.clientY })
	// 	console.log("bottomRight", bottomRight)
	// 	setMouseIsDown(false)
	// }

	// return (
	// 	<div>
	// 		<Background />
	// 		<h1>Label Images</h1>
	// 		<canvas
	// 			ref={canvasRef}
	// 			width={image.width}
	// 			height={image.height}
	// 			onMouseDown={handleMouseDown}
	// 			onMouseUp={handleMouseUp}
	// 		/>
	// 	</div>
	// )
}
