import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const gltfLoader = new GLTFLoader()

class GLTFModel<M extends string, A extends string> {
	gltf!: GLTF
	mixer!: THREE.AnimationMixer
	constructor(private _name: M, private _animations: A[]) {}
	get name() {
		return this._name
	}
	get animations() {
		return this._animations
	}
	async load() {
		this.gltf = await gltfLoader.loadAsync(`assets/${this.name}/scene.gltf`)
		this.mixer = new THREE.AnimationMixer(this.gltf.scene)
	}
	play(anim: A) {
		const clip = THREE.AnimationClip.findByName(this.gltf.animations, anim)
		if (!clip) throw new Error(`Animation ${anim} not found on model ${this.name}`)
		return this.mixer.clipAction(clip).play()
	}
}

export const models = {
	forest: new GLTFModel('forest', []),
	thor: new GLTFModel('thor', [
		'Like_Personality',
		'Idle_C',
		'Like_Idle',
		'Emote_10398002020',
		'Emote_10395002030',
		'Emote_10390012010',
		'103961_ThunderRelease_Loop',
		'Run_Fwd_C',
		'Walk_Fwd_C',
		'Sleep',
	]),
} as const

export const getGLTF = (model: keyof typeof models) => gltfLoader.loadAsync(`assets/${model}/scene.gltf`)

export const dumpObject = (obj: OBJ, lines: string[] = [], isLast = true, prefix = '') => {
	const localPrefix = isLast ? '└─' : '├─'
	lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`)
	const newPrefix = prefix + (isLast ? '  ' : '│ ')
	const lastNdx = obj.children.length - 1
	obj.children.forEach((child, ndx) => {
		const isLast = ndx === lastNdx
		dumpObject(child, lines, isLast, newPrefix)
	})
	return lines
}

type OBJ = { name?: string; type?: string; children: OBJ[] }
