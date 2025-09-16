import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export default function Hoodie() {
  const mountRef = useRef(null)
  const rootRef = useRef(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1)
    mountRef.current.appendChild(renderer.domElement)

    // Add multiple lights for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    pointLight.position.set(-10, -10, -5)
    scene.add(pointLight)

    const gltfLoader = new GLTFLoader()
    gltfLoader.load(
      '/nua-hoodie-first-test/test-4.gltf',
      (gltf) => {
        console.log('Model loaded successfully')
        rootRef.current = gltf.scene
        scene.add(rootRef.current)

        // Get bounding box to position camera properly
        const box = new THREE.Box3().setFromObject(gltf.scene)
        const size = box.getSize(new THREE.Vector3()).length()
        const center = box.getCenter(new THREE.Vector3())

        gltf.scene.position.copy(center.multiplyScalar(-1))
        camera.position.set(0, 0, size * 2)
        camera.lookAt(0, 0, 0)
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%')
      },
      (error) => {
        console.error('Error loading model:', error)
      }
    )

    function animate() {
      if (rootRef.current) {
        rootRef.current.rotation.y += 0.005
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