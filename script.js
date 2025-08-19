const canvas = document.getElementById('solarCanvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 150);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.2);
scene.add(pointLight);

// Sun
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

function createPlanet(size, distance, color, speed) {
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);

  const pivot = new THREE.Object3D();
  pivot.add(mesh);
  mesh.position.x = distance;
  scene.add(pivot);

  return { mesh, pivot, speed };
}

const planets = [
  createPlanet(2, 15, 0xffa500, 0.02), // Mercury
  createPlanet(3, 25, 0xff4500, 0.015), // Venus
  createPlanet(3.5, 35, 0x1e90ff, 0.01), // Earth
  createPlanet(3, 45, 0xff0000, 0.008), // Mars
];

function animate() {
  requestAnimationFrame(animate);
  planets.forEach(p => {
    p.pivot.rotation.y += p.speed;
  });
  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
