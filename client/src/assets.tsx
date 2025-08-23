import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'

const gltfLoader = new GLTFLoader()

class GLTFModel<M extends string, A extends string> {
	gltf!: GLTF
	constructor(private _name: M, private _animations: A[]) {}
	get name() {
		return this._name
	}
	get animations() {
		return this._animations
	}
	async load() {
		this.gltf = await gltfLoader.loadAsync(`/${this.name}/scene.gltf`)
	}
}

export class Model<M extends string, A extends string> extends THREE.Object3D {
	mixer: THREE.AnimationMixer

	constructor(private model: GLTFModel<M, A>) {
		super()
		this.add(SkeletonUtils.clone(model.gltf.scene))
		this.mixer = new THREE.AnimationMixer(this)
	}

	play(anim: A) {
		const clip = THREE.AnimationClip.findByName(this.model.gltf.animations, anim)
		if (!clip) throw new Error(`Animation ${anim} not found on model ${this.model}`)
		return this.mixer.clipAction(clip, this).play()
	}
}

export const models = {
	forest: new GLTFModel('forest', []),
	mountain: new GLTFModel('mountain', []),
	skybox: new GLTFModel('skybox', []),
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
	character_001: new GLTFModel('character_001', [
		'Great Sword Death',
		'Great Sword Idle',
		'Great Sword Impact',
		'Great Sword Run',
		'Great Sword Slash',
		'Great Sword Walk Back',
	]),
	character_002: new GLTFModel('character_002', [
		'Great Sword Death',
		'Great Sword Idle',
		'Great Sword Impact',
		'Great Sword Run',
		'Great Sword Slash',
		'Great Sword Walk Back',
	]),
	character_003: new GLTFModel('character_003', [
		'Great Sword Death',
		'Great Sword Idle',
		'Great Sword Impact',
		'Great Sword Run',
		'Great Sword Slash',
		'Great Sword Walk Back',
	]),
} as const

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
