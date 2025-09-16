import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export default function Hoodie() {
  const mountRef = useRef(null)
  const rootRef = useRef(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer()
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(1, 1, 1)
    scene.add(light)

    const gltfLoader = new GLTFLoader()
    gltfLoader.load('/nua-hoodie-first-test/test-4.gltf', (gltf) => {
      rootRef.current = gltf.scene
      scene.add(rootRef.current)
      gltf.scene.position.set(0, 0, 0)
      gltf.scene.scale.set(1, 1, 1)
    })

    camera.position.z = 30

    function animate() {
      if (rootRef.current) {
        rootRef.current.rotation.x += 0.01
        rootRef.current.rotation.y += 0.002
        rootRef.current.rotation.z += 0.003
      }
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      mountRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} />
}