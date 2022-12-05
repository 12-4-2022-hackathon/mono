import { create } from "ipfs-http-client"
import { Buffer } from "buffer"

const IPFS_CONFIG = {
	host: "127.0.0.1",
	// host: "api-eu1.tatum.io/v3/ipfs",
	port: 5001,
	protocol: "http",
}

// IPFS_CONFIG using

export const addFile = async (file: any) => {
	const ipfs = create(IPFS_CONFIG)

	const fileAdded = await ipfs.add(file)
	return fileAdded.path
}

export const getFile = async (hash: string) => {
	// get file from ipfs
	const ipfs = create(IPFS_CONFIG)

	let asyncitr = ipfs.cat(hash)
	for await (const itr of asyncitr) {
		return Buffer.from(itr).toString("base64")
	}
	throw "sdjiflsdjklfljdsl"
	// new Promise((resolve, reject) => {
	// 	ipfs.get(filePath, (err: any, files: any) => {
	// 		if (err) reject(err)
	// 		files.forEach((file) => {
	// 			// convert base 64 to image
	// 			const image = new Image()
	// 			image.src = "data:image/png;base64," + file.content.toString("base64")
	// 			resolve(image)
	// 		})
	// 	})
	// })
}
