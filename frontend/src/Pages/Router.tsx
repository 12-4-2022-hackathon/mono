import React from "react"
import { Routes, Route } from "react-router-dom"
import { CreateJob } from "./CreateJob"
import { Dashboard } from "./Dashboard"
import Home from "./Home"
import { LabelImages } from "./LabelImages"

export function Router() {
	return (
		<div>
			<Routes>
				<Route path="/" element={Home()} />
				<Route path="/dashboard" element={Dashboard()} />
				<Route path="/createjob" element={CreateJob()} />
				<Route path="/labelimages" element={LabelImages()} />
			</Routes>
			{/* <div style={{display: "flex", flexDirection: "row"}}> */}
			<div style={{ height: "30px" }} />
			{/* footer div */}
			{/* <div style={{ fontSize: "10px" }}>Copyright </div>
			</div> */}
		</div>
	)
}
