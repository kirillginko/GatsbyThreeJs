import React, { useState, useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import {
  Canvas,
  extend,
  useThree,
  useFrame,
  useResource,
} from "react-three-fiber"
import { useSpring, a } from "react-spring/three"

import "./style.css"

extend({ OrbitControls })

const Car = () => {
  const [model, setModel] = useState()

  useEffect(() => {
    new GLTFLoader().load("/scene.gltf", setModel)
  }, [])

  return model ? <primitive object={model.scene} /> : null
}

function Lights() {
  const [ref, light] = useResource()

  return (
    <>
      <directionalLight
        ref={ref}
        intensity={0.6}
        position={[5, 5, 8]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        castShadow
      />
      <directionalLight
        ref={ref}
        intensity={0.05}
        position={[-5, 5, -8]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        castShadow
      />
      {light && (
        <>
          <primitive object={light.target} position={[0, 10, 0]} />
          <directionalLightHelper args={[light, 5]} />
        </>
      )}
    </>
  )
}

const Controls = () => {
  const orbitRef = useRef()
  const { camera, gl } = useThree()

  useFrame(() => {
    orbitRef.current.update()
  })

  return (
    <orbitControls
      autoRotate
      maxPolarAngle={Math.PI / 3}
      minPolarAngle={Math.PI / 3}
      args={[camera, gl.domElement]}
      ref={orbitRef}
    />
  )
}

// const SpaceShip = () => {
//   const [model, setModel] = useState()

//   useEffect(() => {
//     new GLTFLoader().load("/scene.gltf", setModel)
//   })

//   return model ? <primitive object={model.scene} /> : null
// }

// const Controls = () => {
//   const orbitRef = useRef()
//   const { camera, gl } = useThree()

//   useFrame(() => {
//     orbitRef.current.update()
//   })

//   return (
//     <orbitControls
//       autoRotate
//       maxPolarAngle={Math.PI / 3}
//       minPolarAngle={Math.PI / 3}
//       args={[camera, gl.domElement]}
//       ref={orbitRef}
//     />
//   )
// }

const Plane = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
    <planeBufferGeometry attach="geometry" args={[100, 100]} />
    <meshPhysicalMaterial attach="material" color="red" />
  </mesh>
)

const Box = () => {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const props = useSpring({
    scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
    color: hovered ? "hotpink" : "gray",
  })

  return (
    <a.mesh
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive(!active)}
      scale={props.scale}
      castShadow
    >
      <ambientLight />
      <spotLight position={[0, 5, 10]} penumbra={1} />
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <a.meshPhysicalMaterial attach="material" color={props.color} />
    </a.mesh>
  )
}

const Home = () => {
  const isBrowser = typeof window !== "undefined"

  return (
    <>
      {isBrowser && (
        <Canvas
          camera={{ position: [0, 0, 400] }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true
            gl.shadowMap.type = THREE.PCFSoftShadowMap
          }}
        >
          {/* <ambientLight intensity={0.5} />
          <spotLight position={[5, 20, 5]} penumbra={1} castShadow /> */}
          {/* <fog attach="fog" args={["black", 10, 25]} /> */}
          <Controls />
          {/* <Box /> */}
          {/* <Plane /> */}
          <Lights />
          <Car />
          {/* <SpaceShip /> */}
        </Canvas>
      )}
    </>
  )
}

export default Home
