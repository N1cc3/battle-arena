import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'

const gltfLoader = new GLTFLoader()

class GLTFModel<M extends string, A extends string> {
	gltf!: GLTF
	constructor(private _name: M, private _animations: { name: A; loop?: true; stopWhenFinished?: true }[]) {}
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

export type AnimationsOf<M extends keyof typeof models> = (typeof models)[M]['animations'][number]['name']

export class Model<M extends keyof typeof models> extends THREE.Object3D {
	mixer: THREE.AnimationMixer
	model: GLTFModel<M, AnimationsOf<M>>
	private action?: THREE.AnimationAction

	constructor(modelName: M) {
		super()
		this.model = models[modelName] as GLTFModel<M, AnimationsOf<M>>
		this.model.gltf.scene.traverse((obj) => (obj.castShadow = true))
		this.add(SkeletonUtils.clone(this.model.gltf.scene))
		this.mixer = new THREE.AnimationMixer(this)

		const defaultAnim = this.model.animations[0]
		if (!defaultAnim) return
		this.mixer.addEventListener('finished', (e) => {
			const { name } = e.action.getClip()
			const anim = this.model.animations.find((a) => a.name === name)
			if (anim && !anim.loop && !anim.stopWhenFinished) this.play(defaultAnim.name)
		})
	}

	play(name: AnimationsOf<M>, fadeSpeed = 1) {
		const anim = this.model.animations.find((a) => a.name === name)
		const clip = THREE.AnimationClip.findByName(this.model.gltf.animations, name)
		if (!clip || !anim) throw new Error(`Animation ${name} not found on model ${this.model}`)
		const newAction = this.mixer.clipAction(clip)
		if (this.action === newAction) return
		this.action = this.action ? this.action.crossFadeTo(newAction.reset(), fadeSpeed) : newAction
		this.action.setLoop(anim.loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity)
		this.action.clampWhenFinished = true
		this.action.play()
	}
}

export const models = {
	skybox: new GLTFModel('skybox', []),
	character_005: new GLTFModel('character_005', [
		{ name: 'Great Sword Idle', loop: true },
		{ name: 'Great Sword Run Forward', loop: true },
		{ name: 'Great Sword Walk Backwards', loop: true },
		{ name: 'Great Sword Impact' },
		{ name: 'Great Sword Slash' },
		{ name: 'Great Sword Death', stopWhenFinished: true },
	]),
	equipment_005: new GLTFModel('equipment_005', [
		{ name: 'Great Sword Idle', loop: true },
		{ name: 'Great Sword Run Forward', loop: true },
		{ name: 'Great Sword Walk Backwards', loop: true },
		{ name: 'Great Sword Impact' },
		{ name: 'Great Sword Slash' },
		{ name: 'Great Sword Death', stopWhenFinished: true },
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
