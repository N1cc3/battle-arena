import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { getGLTF } from './assets'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
camera.position.set(0, 20, 50)
controls.autoRotate = true
controls.update()

const light = new THREE.AmbientLight(0xffffff, 1)
scene.add(light)

const clock = new THREE.Clock()

getGLTF('forest').then((gltf) => {
	scene.add(gltf.scene)
})

const animate = () => {
	const delta = clock.getDelta()
	controls.update(delta)
	renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)
