import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { models } from './assets'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
})

const controls = new OrbitControls(camera, renderer.domElement)
camera.position.set(0, 5, 10)
controls.autoRotate = true
controls.update()

const light = new THREE.AmbientLight(0xffffff, 1)
scene.add(light)

const clock = new THREE.Clock()

const animate = () => {
	const delta = clock.getDelta()
	controls.update(delta)
	models.thor.mixer.update(delta)
	models.character_001.mixer.update(delta)
	renderer.render(scene, camera)
}

Promise.all([
	models.forest.load().then(() => {
		scene.add(models.forest.gltf.scene)
		models.forest.gltf.scene.position.set(0, -5, 0)
	}),
	models.thor.load().then(() => {
		// scene.add(models.thor.gltf.scene)
		// models.thor.play('Run_Fwd_C')
	}),
	models.character_001.load().then(() => {
		scene.add(models.character_001.gltf.scene)
		models.character_001.play('Great Sword Idle')
	}),
	models.equipment_002.load().then(() => {
		scene.add(models.equipment_002.gltf.scene)
		models.equipment_002.gltf.scene.position.set(1, 1, 1)
	}),
]).then(() => renderer.setAnimationLoop(animate))
