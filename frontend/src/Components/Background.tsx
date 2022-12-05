import React from "react"

export const Background = (children: any) => {
	return (
		<div>
			<div
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					height: "100vh",
					width: "100vw",
					zIndex: -2,
					overflow: "hidden",
					background: "linear-gradient(90deg, #d53369 0%, #daae51 100%)",
				}}
			/>
			<div
				style={{
					position: "fixed",
					height: "100vh",
					width: "100vw",
					transform: "skewY(-15deg) translateX(-1%)",
					overflow: "hidden",
					zIndex: -1,
					backgroundColor: "white",
				}}
			></div>
		</div>
	)
}
