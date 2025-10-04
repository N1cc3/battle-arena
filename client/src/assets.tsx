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

export type AnyModel = Model<keyof typeof models>
export type AnimationsOf<M extends keyof typeof models> = (typeof models)[M]['animations'][number]

export class Model<M extends keyof typeof models> extends THREE.Object3D {
	mixer: THREE.AnimationMixer
	model: GLTFModel<M, AnimationsOf<M>>

	constructor(modelName: M) {
		super()
		this.model = models[modelName] as GLTFModel<M, AnimationsOf<M>>
		this.model.gltf.scene.traverse((obj) => (obj.castShadow = true))
		this.add(SkeletonUtils.clone(this.model.gltf.scene))
		this.mixer = new THREE.AnimationMixer(this)
	}

	play(anim: AnimationsOf<M>) {
		const clip = THREE.AnimationClip.findByName(this.model.gltf.animations, anim)
		if (!clip) throw new Error(`Animation ${anim} not found on model ${this.model}`)
		return this.mixer.clipAction(clip, this).play()
	}

	anim(anim: AnimationsOf<M>) {
		const clip = THREE.AnimationClip.findByName(this.model.gltf.animations, anim)
		if (!clip) throw new Error(`Animation ${anim} not found on model ${this.model}`)
		return clip
	}
}

export const models = {
	skybox: new GLTFModel('skybox', ['asd']),
	character_005: new GLTFModel('character_005', [
		'Great Sword Idle',
		'Great Sword Impact',
		'Great Sword Run Forward',
		'Great Sword Slash',
		'Great Sword Walk Backwards',
		'Great Sword Death',
	]),
	equipment_005: new GLTFModel('equipment_005', [
		'Great Sword Idle',
		'Great Sword Impact',
		'Great Sword Run Forward',
		'Great Sword Slash',
		'Great Sword Walk Backwards',
		'Great Sword Death',
	]),
} as const

await Promise.all(Object.values(models).map((m) => m.load()))

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
