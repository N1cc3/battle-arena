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
camera.rotation.set(0, Math.PI, 0) // Look down at the scene
// controls.autoRotate = true
controls.update()

window.addEventListener('mousemove', (e) => {
	if (!e.ctrlKey) return
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

const characterModels: Model<string, string>[] = []

const char = new Model(models.character_001)

char.scale.set(5, 5, 5)
characterModels.push(char)
scene.add(char)
char.play('Great Sword Idle')
console.log(dumpObject(char))

// const greenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

// const hat = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2).translate(0, 0.5, 0), greenMaterial)
// scene.getObjectByName('mixamorigHead')?.add(hat)

// const weapon = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.05).translate(0.2, 0.05, 0), greenMaterial)
// scene.getObjectByName('mixamorigRightHand')?.add(weapon)

// const equipment1 = new Model(models.equipment_001)
// scene.getObjectByName('mixamorigRightHand')?.add(equipment1)
const equipment2 = new Model(models.equipment_002)
console.log(dumpObject(equipment2))
// char.add(equipment2)
// const anim = THREE.AnimationClip.findByName(char.animations, 'Great Sword Idle')
// if (anim) equipment2.mixer.clipAction(anim, equipment2).play()
// scene.getObjectByName('mixamorigRightHand')?.add(equipment2)

const gloves = models.equipment_002.gltf.scene.children.find((c) => c.name === 'SM_Gloves_002')
if (gloves) char.add(gloves)

const armor = models.equipment_002.gltf.scene.children.find((c) => c.name === 'SM_Armour_002')
armor?.position.set(0, -0.5, -0.1)
armor?.rotation.set(0.25, 0, 0)
if (armor) scene.getObjectByName('mixamorigHips')?.add(armor)

const sword = models.equipment_002.gltf.scene.children.find((c) => c.name === 'SM_Sword_002')
sword?.rotation.set(1, Math.PI / 2, 1)
if (sword) scene.getObjectByName('mixamorigRightHand')?.add(sword)

renderer.setAnimationLoop(() => {
	const delta = clock.getDelta()
	controls.update(delta)
	characterModels.forEach((model) => model.mixer.update(delta))
	renderer.render(scene, camera)
})

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
