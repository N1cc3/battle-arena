import * as THREE from 'three'
import { Model, models } from './assets'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Character, itemSlots } from './Character'

const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setAnimationLoop(() => {
	const delta = clock.getDelta()
	controls.update(delta)
	animatedChars.forEach((model) => model.update(delta))
	renderer.render(scene, camera)
})
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
})

const clock = new THREE.Clock()
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight)
camera.position.set(0, 5, 10)
const controls = new OrbitControls(camera, renderer.domElement)
controls.autoRotate = true

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(10, 10, 10)
light.castShadow = true
scene.add(ambientLight)
scene.add(light)

const terrain = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 10), new THREE.MeshStandardMaterial({ color: 0x008800 }))
terrain.position.set(0, -0.5, 0)
terrain.receiveShadow = true
scene.add(terrain)

const skybox = new Model('skybox')
skybox.scale.set(20, 20, 20)
scene.add(skybox)

const animatedChars: Character[] = []

const char1 = new Character()
char1.position.set(-2, 0, 0)
scene.add(char1)
animatedChars.push(char1)
char1.equip('BlueSet', 'Arms')
char1.equip('BlueSet', 'Boots')
char1.equip('BlueSet', 'Chest')
char1.equip('BlueSet', 'Head')
char1.equip('BlueSet', 'Pants')
char1.play('Great Sword Idle')

const char2 = new Character()
char2.position.set(2, 0, 0)
scene.add(char2)
animatedChars.push(char2)
char2.equip('GreenSet', 'Arms')
char2.equip('GreenSet', 'Boots')
char2.equip('GreenSet', 'Chest')
char2.equip('GreenSet', 'Head')
char2.equip('GreenSet', 'Pants')
char2.play('Great Sword Idle')

const { animations } = models.character_005
setInterval(() => {
	char1.play(animations[Math.floor(Math.random() * animations.length)].name)
	char1.equip(Math.random() < 0.5 ? 'BlueSet' : 'GreenSet', itemSlots[Math.floor(Math.random() * itemSlots.length)])
}, Math.random() * 4000 + 2000)
setInterval(() => {
	char2.play(animations[Math.floor(Math.random() * animations.length)].name)
	char2.equip(Math.random() < 0.5 ? 'BlueSet' : 'GreenSet', itemSlots[Math.floor(Math.random() * itemSlots.length)])
}, Math.random() * 4000 + 2000)
