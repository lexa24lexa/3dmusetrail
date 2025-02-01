import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,  
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const hexagonHeight = 3.75;
const cameraHeight = hexagonHeight + 2;

camera.position.set(0, cameraHeight, 0.1);
camera.lookAt(new THREE.Vector3(0, 0, 0.2));

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#three-canvas"), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xFFFFFF, 1);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const loader = new GLTFLoader();
let model;

loader.load('/models/3dgallery.glb', (gltf) => {
    model = gltf.scene;
    scene.add(model);

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());

    model.position.sub(center);
});

let insideHexagon = false;
let rotationSpeed = 0;
let rotating = false;

document.getElementById('toggleView').addEventListener('click', () => {
    insideHexagon = !insideHexagon;
    if (insideHexagon) {
        moveCameraToInside();
        document.getElementById('controls').style.display = 'block';
        document.getElementById('toggleView').textContent = '-';
    } else {
        moveCameraToTop();
        document.getElementById('controls').style.display = 'none';
        document.getElementById('toggleView').textContent = '+';
    }
});

document.getElementById('controls').style.display = 'none';

document.getElementById('rotateLeft').addEventListener('mousedown', () => startRotation(-1));
document.getElementById('rotateLeft').addEventListener('mouseup', stopRotation);
document.getElementById('rotateLeft').addEventListener('mouseleave', stopRotation);

document.getElementById('rotateRight').addEventListener('mousedown', () => startRotation(1));
document.getElementById('rotateRight').addEventListener('mouseup', stopRotation);
document.getElementById('rotateRight').addEventListener('mouseleave', stopRotation);

function moveCameraToInside() {
    if (!model) return;
    const targetPosition = new THREE.Vector3(0, 1, 2);
    animateCamera(targetPosition);
}

function moveCameraToTop() {
    const targetPosition = new THREE.Vector3(0, cameraHeight, 0.1);
    animateCamera(targetPosition);
    
    setTimeout(() => {
        camera.lookAt(0, 0, 0);
    }, 500);
}

function animateCamera(targetPosition) {
    const duration = 1000;
    const startPosition = camera.position.clone();
    const startTime = performance.now();

    function animate() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        camera.position.lerpVectors(startPosition, targetPosition, progress);
        camera.lookAt(0, 0, 0);
        if (progress < 1) requestAnimationFrame(animate);
    }
    animate();
}

function startRotation(direction) {
    rotationSpeed = 0.02 * direction;
    rotating = true;
}

function stopRotation() {
    rotationSpeed = 0;
    rotating = false;
}

function animate() {
    requestAnimationFrame(animate);
    if (rotating && model) {
        model.rotation.y += rotationSpeed;
    }
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
