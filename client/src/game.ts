import * as THREE from 'three'
import { AnyModel, Model, models } from './assets'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Character } from './char'

const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setAnimationLoop(() => {
	const delta = clock.getDelta()
	controls.update(delta)
	char.mixer.update(delta)
	equip.mixer.update(delta)
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

const armature = models.equipment_005.gltf.scene.children.filter((c) => c.name === 'Armature')[0]
const getEquipment = (set: 'BlueSet' | 'GreenSet', piece: 'Arms' | 'Boots' | 'Chest' | 'Head' | 'Pants') =>
	armature.children.filter((c) => c.name === `${set}_${piece}`)[0]

getEquipment('BlueSet', 'Arms').visible = false
// getEquipment('BlueSet', 'Boots').visible = false
// getEquipment('BlueSet', 'Chest').visible = false
getEquipment('BlueSet', 'Head').visible = false
getEquipment('BlueSet', 'Pants').visible = false
// getEquipment('GreenSet', 'Arms').visible = false
getEquipment('GreenSet', 'Boots').visible = false
getEquipment('GreenSet', 'Chest').visible = false
// getEquipment('GreenSet', 'Head').visible = false
// getEquipment('GreenSet', 'Pants').visible = false

const char = new Model('character_005')
const equip = new Model('equipment_005')
char.add(equip)
scene.add(char)

const idle = char.mixer.clipAction(char.anim('Great Sword Idle'))
const idleE = equip.mixer.clipAction(equip.anim('Great Sword Idle'))
const run = char.mixer.clipAction(char.anim('Great Sword Run Forward'))
const runE = equip.mixer.clipAction(equip.anim('Great Sword Run Forward'))

let action = idle.play()
let actionE = idleE.play()
setInterval(() => {
	if (action === idle) {
		actionE = actionE.crossFadeTo(runE.reset(), 1).play()
		return (action = action.crossFadeTo(run.reset(), 1).play())
	}
	if (action === run) {
		actionE = actionE.crossFadeTo(idleE.reset(), 1).play()
		return (action = action.crossFadeTo(idle.reset(), 1).play())
	}
}, 4000)

if (process.env.NODE_ENV === 'development') {
	const helper = new THREE.CameraHelper(light.shadow.camera)
	scene.add(helper)
}
