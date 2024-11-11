import { animate, createTimer, createTimeline, utils, engine } from '../../../lib/anime.esm.js';

import {
  Object3D,
  Vector3,
  Color,
  PerspectiveCamera,
  BoxGeometry,
  SphereGeometry,
  MeshBasicMaterial,
  InstancedMesh,
  AmbientLight,
  DirectionalLight,
  Scene,
  WebGLRenderer,
  Mesh,
} from '../../../node_modules/three/build/three.module.min.js';

const $particlesContainer = document.querySelector('#particles-container');

const sceneData = {
  count: 5000,
};

let containerRect = $particlesContainer.getBoundingClientRect();
let containerW = containerRect.width;
let containerH = containerRect.height;
let W = containerW;
let H = containerH;
let halfW = containerW * .5;
let halfH = containerH * .5;

class InstancedMeshProxy {
  constructor(count) {
    this.index = 0;
    this._x = new Float32Array(count);
    this._y = new Float32Array(count);
    this._z = new Float32Array(count);
    this._rotation = new Float32Array(count);
    this._scale = new Float32Array(count);
    this._started = new Int8Array(count);
    this._reversed = new Int8Array(count);
  }
  set x(v) { this._x[this.index] = v; }
  get x()  { return this._x[this.index]; }
  set y(v) { this._y[this.index] = v; }
  get y()  { return this._y[this.index]; }
  set z(v) { this._z[this.index] = v; }
  get z()  { return this._z[this.index]; }
  set rotation(v) { this._rotation[this.index] = v; }
  get rotation()  { return this._rotation[this.index]; }
  set scale(v) { this._scale[this.index] = v; }
  get scale()  { return this._scale[this.index]; }
  set started(v) { this._started[this.index] = v; }
  get started()  { return this._started[this.index]; }
  set reversed(v) { this._reversed[this.index] = v; }
  get reversed()  { return this._reversed[this.index]; }
}

const dummy = new Object3D();

const camera = new PerspectiveCamera(60, containerW / containerH, 1, 150);
camera.position.set(0, 0, -10);
camera.lookAt(0, 0, 0);

const geometry = new BoxGeometry(1, 1, 1);
// const geometry = new SphereGeometry(1, 6, 3);
const material = new MeshBasicMaterial();
const mesh = new InstancedMesh(geometry, material, sceneData.maxCount);
const meshProxy = new InstancedMeshProxy(sceneData.maxCount);

const basicMesh = new Mesh(geometry, material);

const scene = new Scene();
scene.add(mesh);

scene.add(basicMesh);

const renderer = new WebGLRenderer({
  antialias: false,
  powerPreference: 'high-performance',
});

renderer.setPixelRatio(1);
renderer.setSize(containerW, containerH);

$particlesContainer.appendChild(renderer.domElement);

const renderLoop = createTimer({
  onUpdate: () => {
    renderer.render(scene, camera);
  },
  autoplay: false
});

const screenCoords = new Vector3();
const worldCoords = new Vector3();

const colors = [new Color('#FF4B4B'), new Color('#9F3A39'), new Color('#CF4242')];

function renderMesh(i) {
  meshProxy.index = i;
  dummy.position.set(meshProxy.x, meshProxy.y, 0);
  const r = meshProxy.rotation;
  dummy.rotation.set(r, r, r);
  const s = meshProxy.scale;
  dummy.scale.set(s, s, s);
  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix);
  mesh.instanceMatrix.needsUpdate = true;
}

for (let i = 0; i < sceneData.count; i++) {
  meshProxy.index = i;
  meshProxy.x = utils.random(-10, 10);
  meshProxy.y = utils.random(-10, 10);
  meshProxy.z = utils.random(-10, 10);
  meshProxy.scale = 2;
  meshProxy.rotation = Math.PI * .2;
  meshProxy.reversed = utils.random(0, 1);
  // mesh.setColorAt(i, utils.randomPick(colors));
  renderMesh(i);
  // mesh.instanceColor.needsUpdate = true;
}

renderLoop.play();

  // const params = {
  //   composition: 'none', // Needed to avoid overiding proxy tweens
  //   delay,
  //   duration,
  //   ease,
  //   onRender: () => renderMesh(i),
  //   onUpdate: () => meshProxy.index = i,
  //   onComplete: self => {
  //     animateParticle(i, l);
  //   },
  // animate(meshProxy, params);

function onResize() {
  containerRect = $particlesContainer.getBoundingClientRect();
  containerW = containerRect.width;
  containerH = containerRect.height;
  camera.aspect = containerW / containerH;
  camera.updateProjectionMatrix();
  renderer.setSize(containerW, containerH);
  screenCoords.set(2, 2, .5);
  screenCoords.unproject(camera);
  screenCoords.sub(camera.position).normalize();
  worldCoords.copy(camera.position).add(screenCoords.multiplyScalar(-camera.position.z / screenCoords.z));
  W = worldCoords.x;
  H = worldCoords.y;
  halfW = W * .5;
  halfH = H * .5;
}

onResize();

window.onresize = onResize;