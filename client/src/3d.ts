import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GameMsgOut } from '../../src/game'
import { ws } from './App'
import { dumpObject, Model, models } from './assets'

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
// controls.autoRotate = true
controls.update()

window.addEventListener('mousemove', (e) => {
	const x = (e.clientX / window.innerWidth) * 2 - 1
	const y = -(e.clientY / window.innerHeight) * 2 + 1
	controls.target.set(-x * 10, 0, y * 10)
	controls.update()
})

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

const animatedModels: Model<string, string>[] = []

console.log(dumpObject(models.equipment_005.gltf.scene))

const armature = models.equipment_005.gltf.scene.children.filter((c) => c.name === 'Armature')[0]
const getEquipment = (set: 'BlueSet' | 'GreenSet', piece: 'Arms' | 'Boots' | 'Chest' | 'Head' | 'Pants') =>
	armature.children.filter((c) => c.name === `${set}_${piece}`)[0]

getEquipment('BlueSet', 'Arms').visible = false
// getEquipment('BlueSet', 'Boots').visible = false
getEquipment('BlueSet', 'Chest').visible = false
getEquipment('BlueSet', 'Head').visible = false
getEquipment('BlueSet', 'Pants').visible = false
getEquipment('GreenSet', 'Arms').visible = false
getEquipment('GreenSet', 'Boots').visible = false
getEquipment('GreenSet', 'Chest').visible = false
// getEquipment('GreenSet', 'Head').visible = false
getEquipment('GreenSet', 'Pants').visible = false

const char = new Model(models.character_005)
const equip = new Model(models.equipment_005)
char.add(equip)
animatedModels.push(equip)

char.scale.set(5, 5, 5)
animatedModels.push(char)
scene.add(char)
char.play('Great Sword Idle')
equip.play('Great Sword Idle')

renderer.setAnimationLoop(() => {
	const delta = clock.getDelta()
	controls.update(delta)
	animatedModels.forEach((model) => model.mixer.update(delta))
	renderer.render(scene, camera)
})

ws.addEventListener('message', (raw) => {
	const msg = JSON.parse(raw.data) as GameMsgOut

	if (msg.type === 'game_state') {
		msg.state.characters.forEach((c) => {
			let model = animatedModels.find((cm) => cm.name === c.name)
			if (!model) {
				model = new Model(models.character_001)
				model.name = c.name
				animatedModels.push(model)
				scene.add(model)
				model.position.set(animatedModels.length - 1, 0, 0) // Position them in a line
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
