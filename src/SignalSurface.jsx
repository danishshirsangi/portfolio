import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const smooth = (a, b, value) => THREE.MathUtils.smoothstep(value, a, b);

function colorCharacter(geometry) {
  const positions = geometry.attributes.position;
  const colors = new Float32Array(positions.count * 3);
  const skin = new THREE.Color("#f1ae8d");
  const mint = new THREE.Color("#40c4a9");
  const orange = new THREE.Color("#ff653c");
  const trousers = new THREE.Color("#252833");
  const hair = new THREE.Color("#211b26");
  const color = new THREE.Color();

  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    color.copy(skin);

    const pants = 1 - smooth(-0.52, -0.34, y);
    const jacket = smooth(-0.36, -0.22, y) * (1 - smooth(0.08, 0.21, y));
    const shirt = (1 - smooth(0.08, 0.15, Math.abs(x))) * smooth(-0.24, -0.12, y) * (1 - smooth(0.12, 0.22, y));
    const curls = (Math.abs(x) > 0.13 || z < 0.14 || y > 0.79) ? 1 : 0;
    const hairMask = smooth(0.56, 0.73, y) * curls;

    color.lerp(trousers, pants * 0.98);
    color.lerp(mint, jacket * 0.94);
    color.lerp(orange, shirt * 0.96);
    color.lerp(hair, hairMask * 0.98);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.attributes.color.needsUpdate = true;
}

function Avatar({ paused, pointer, greetKey }) {
  const root = useRef();
  const leftIris = useRef();
  const rightIris = useRef();
  const lastGreeting = useRef(-10);
  const greetingQueued = useRef(false);
  const { scene } = useGLTF("/models/danish-mini-avatar.glb");
  const { size } = useThree();
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    vertexColors: true,
    roughness: 0.22,
    metalness: 0.04,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    sheen: 0.5,
    sheenColor: new THREE.Color("#ffc8a7"),
  }), []);

  useEffect(() => {
    scene.traverse((node) => {
      if (!node.isMesh) return;
      colorCharacter(node.geometry);
      node.castShadow = true;
      node.receiveShadow = true;
      node.material = material;
    });
    return () => material.dispose();
  }, [scene, material]);

  useEffect(() => {
    if (greetKey > 0) greetingQueued.current = true;
  }, [greetKey]);

  useFrame(({ clock }, delta) => {
    if (!root.current) return;
    const t = clock.elapsedTime;
    if (greetingQueued.current) {
      greetingQueued.current = false;
      lastGreeting.current = t;
    }
    const aim = pointer?.current ?? { x: 0, y: 0 };
    const greeting = Math.max(0, 1 - (t - lastGreeting.current) / 0.8);
    const small = size.width < 640;
    const idle = paused ? 0 : Math.sin(t * 1.1) * 0.018;

    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, (paused ? 0 : aim.x * 0.2) + idle + Math.sin(greeting * Math.PI) * 0.12, 4, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, paused ? 0 : -aim.y * 0.07, 4, delta);
    root.current.position.x = THREE.MathUtils.damp(root.current.position.x, small ? 0 : 1.28 + (paused ? 0 : aim.x * 0.1), 3, delta);
    root.current.position.y = (small ? -0.42 : -0.05) + (paused ? 0 : Math.sin(t * 1.2) * 0.035) + Math.sin(greeting * Math.PI) * 0.1;
    root.current.scale.setScalar((small ? 0.7 : 0.96) * (1 + Math.sin(greeting * Math.PI) * 0.045));

    [leftIris.current, rightIris.current].forEach((iris) => {
      if (!iris) return;
      iris.position.x = THREE.MathUtils.damp(iris.position.x, aim.x * 0.024, 8, delta);
      iris.position.y = THREE.MathUtils.damp(iris.position.y, -aim.y * 0.018, 8, delta);
      iris.rotation.y = THREE.MathUtils.damp(iris.rotation.y, aim.x * 0.14, 8, delta);
      iris.rotation.x = THREE.MathUtils.damp(iris.rotation.x, aim.y * 0.12, 8, delta);
    });
  });

  const greet = (event) => {
    event.stopPropagation();
    greetingQueued.current = true;
  };
  const eye = (x, irisRef) => <group key={x} position={[x, 0.34, 0.407]}>
    <mesh scale={[1.15, 0.68, 0.38]}>
      <sphereGeometry args={[0.043, 24, 18]}/>
      <meshPhysicalMaterial color="#fff3e6" roughness={0.16} clearcoat={1}/>
    </mesh>
    <group ref={irisRef} position={[0, 0, 0.034]}>
      <mesh scale={[1, 1, 0.55]}>
        <sphereGeometry args={[0.021, 24, 18]}/>
        <meshPhysicalMaterial color="#5a3027" roughness={0.12} clearcoat={1}/>
      </mesh>
      <mesh position={[0, 0, 0.013]} scale={[1, 1, 0.5]}>
        <sphereGeometry args={[0.01, 18, 14]}/>
        <meshBasicMaterial color="#171319"/>
      </mesh>
      <mesh position={[-0.009, 0.012, 0.025]}>
        <sphereGeometry args={[0.004, 12, 10]}/>
        <meshBasicMaterial color="#fff8ef"/>
      </mesh>
    </group>
  </group>;

  return <group ref={root} onClick={greet} onPointerOver={() => { document.body.style.cursor = "pointer"; }} onPointerOut={() => { document.body.style.cursor = ""; }}>
    <primitive object={scene}/>
    {eye(-0.078, leftIris)}{eye(0.078, rightIris)}
  </group>;
}

export default function FloatScene({ paused, pointer, greetKey }) {
  return <Canvas className="float-canvas" aria-label="Interactive 3D portrait of Danish Shirsangi. Move your pointer to move his eyes; click him to make him greet you." dpr={[1, 1.5]} camera={{ position: [0, 0, 5.3], fov: 36 }} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }} frameloop="always" onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.outputColorSpace = THREE.SRGBColorSpace; gl.toneMapping = THREE.ACESFilmicToneMapping; }}>
    <ambientLight intensity={1.3}/>
    <directionalLight position={[3, 4, 3]} intensity={4} color="#fff2df"/>
    <pointLight position={[-2.4, 1.5, 2]} intensity={22} color="#ff9e62"/>
    <pointLight position={[2, -2, -1]} intensity={16} color="#69bba8"/>
    <Avatar paused={paused} pointer={pointer} greetKey={greetKey}/>
  </Canvas>;
}

useGLTF.preload("/models/danish-mini-avatar.glb");
