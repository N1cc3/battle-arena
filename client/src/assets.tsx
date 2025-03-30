import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const gltf = {
	forest: '/forest/forest.gltf',
}

const gltfLoader = new GLTFLoader()
export const getGLTF = (name: keyof typeof gltf) =>
	new Promise<GLTF>((resolve, reject) => {
		gltfLoader.load(
			gltf[name],
			(gltf) => resolve(gltf),
			() => {},
			reject
		)
	})
