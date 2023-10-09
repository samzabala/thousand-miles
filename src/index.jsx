import './style.css'
import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import Ui from './components/Ui.jsx'
import LoadingBar from './components/LoadingBar.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <>
    <KeyboardControls
        map={ [
            { name: 'forward', keys: [ 'ArrowUp', 'KeyW' ] },
            { name: 'backward', keys: [ 'ArrowDown', 'KeyS' ] },
            { name: 'leftward', keys: [ 'ArrowLeft', 'KeyA' ] },
            { name: 'rightward', keys: [ 'ArrowRight', 'KeyD' ] },
            { name: 'jump', keys: [ 'Space' ] },
        ] }
    >
        <Canvas
            shadows
            camera={ {
                fov: 45,
                near: 0.1,
                far: 200,
                position: [ 2.5, 4, 6 ]
            } }
        >
            <Suspense>
                <Experience />
            </Suspense>
        </Canvas>
        <Ui />
        <LoadingBar />
    </KeyboardControls>
    </>
)