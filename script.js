const canvas = document.getElementById('solarCanvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 60, 200);

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

// Star field background
const starGeometry = new THREE.BufferGeometry();
const starCount = 5000;
const starVertices = [];
for (let i = 0; i < starCount; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 2000;
  starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Planets
const mercury = createPlanet(2, 15, 0xffa500, 0.02);
const venus = createPlanet(3, 25, 0xff4500, 0.015);
const earth = createPlanet(3.5, 35, 0x1e90ff, 0.01);
const mars = createPlanet(3, 45, 0xff0000, 0.008);
const jupiter = createPlanet(7, 60, 0xffd27f, 0.006);
const saturn = createPlanet(6, 75, 0xffc94d, 0.005);
const uranus = createPlanet(5, 90, 0x7fffd4, 0.004);
const neptune = createPlanet(5, 105, 0x4169e1, 0.003);

// Saturn ring
const ringGeometry = new THREE.RingGeometry(7, 11, 32);
const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xd3d3d3, side: THREE.DoubleSide });
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2;
saturn.mesh.add(ring);

const planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];

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
