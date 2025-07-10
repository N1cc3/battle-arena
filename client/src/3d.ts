import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GameMsgOut } from '../../src/game'
import { ws } from './App'
import { Model, models } from './assets'

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

await Promise.all(Object.values(models).map((m) => m.load()))

const terrain = new THREE.Object3D()
scene.add(terrain)
const terrain1 = new Model(models.mountain)
terrain.add(terrain1)
const terrain2 = new Model(models.mountain)
terrain2.scale.set(-1, 1, 1)
terrain.add(terrain2)
const terrain3 = new Model(models.mountain)
terrain3.scale.set(-1, 1, -1)
terrain.add(terrain3)
const terrain4 = new Model(models.mountain)
terrain4.scale.set(1, 1, -1)
terrain.add(terrain4)
terrain.position.set(0, -40, 0)

const skybox = new Model(models.skybox)
skybox.scale.set(20, 20, 20)
scene.add(skybox)

renderer.setAnimationLoop(() => {
	const delta = clock.getDelta()
	controls.update(delta)
	characterModels.forEach((model) => model.mixer.update(delta))
	renderer.render(scene, camera)
})

const characterModels: Model<string, string>[] = []

ws.addEventListener('message', (raw) => {
	const msg = JSON.parse(raw.data) as GameMsgOut

	if (msg.type === 'game_state') {
		msg.state.characters.forEach((c) => {
			let model = characterModels.find((cm) => cm.name === c.name)
			if (!model) {
				model = new Model(models.character_001)
				model.name = c.name
				characterModels.push(model)
				scene.add(model)
				model.position.set(characterModels.length - 1, 0, 0) // Position them in a line
			}
			model.play(
				c.animation as
					| 'Great Sword Death'
					| 'Great Sword Idle'
					| 'Great Sword Impact'
					| 'Great Sword Run'
					| 'Great Sword Slash'
					| 'Great Sword Walk Back'
			)
		})
	}
})
