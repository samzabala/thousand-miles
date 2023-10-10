import * as THREE from 'three'
import {useState,useRef, useEffect} from 'react'
import {CuboidCollider,CylinderCollider,useRapier,RigidBody,BallCollider,RoundCuboidCollider} from '@react-three/rapier'
import {useFrame} from '@react-three/fiber'
import {useProgress,useKeyboardControls,useGLTF} from '@react-three/drei'
import useGame from '../stores/useGame.jsx'

export default function Player(){

	
	// const char = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/zombie-1/model.gltf')
	const char = useGLTF('./shrek.glb')
	// const charObj = char.scene
	const charObj = char.scene


	const body = useRef()

	
	const piano = useGLTF('./piano.bundle.glb')
    piano.scene.children.forEach((mesh) =>
    {
        mesh.castShadow = true
    })


    const [ subscribeKeys, getKeys ] = useKeyboardControls()

	const { rapier,world } = useRapier()


	//smoothen boi
    const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3())
    const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())

    useFrame((state, delta) =>
	{

		//movement
		if(body.current) {
	
			const { forward, backward, leftward, rightward } = getKeys()

			const impulseStrength = .6 * delta
			// const torqueStrength = .4 * delta
			const torqueStrength = .001 * delta
	
			const impulse = { x: 0, y: 0, z: 0 }
			const torque = { x: 0, y: 0, z: 0 }
	
			if(forward){
				impulse.z -= impulseStrength
				torque.x -= torqueStrength
			}
			if(backward){
				impulse.z += impulseStrength
				torque.x += torqueStrength
			}
			if(leftward){
				impulse.x -= impulseStrength * 1.5
				torque.z += torqueStrength
			}
			if(rightward){
				impulse.x += impulseStrength * 1.5
				torque.z -= torqueStrength
			}


			body.current.applyImpulse(impulse)
			body.current.applyTorqueImpulse(torque)



			// camera update 
			const bodyPosition = body.current.translation()

			const cameraPosition = new THREE.Vector3()
			cameraPosition.copy(bodyPosition)
			cameraPosition.z += 2.5
			cameraPosition.y += 0.8

			const cameraTarget = new THREE.Vector3()
			cameraTarget.copy(bodyPosition)
			cameraTarget.y += 0.5


			// luh anu daw
			smoothedCameraPosition.lerp(cameraPosition, 0.1)
			smoothedCameraTarget.lerp(cameraTarget, 0.1)
	
			state.camera.position.copy(smoothedCameraPosition)
			state.camera.lookAt(smoothedCameraTarget)



			//states and shit
			if(
				bodyPosition.z < - (blocksCount * 4 + 2)
				&& bodyPosition.y >=0
				&& bodyPosition.x <= 2
				&& bodyPosition.x >= -2

				)
				end()


			if(bodyPosition.y < - 4)
				restart()
		}
	})

    const jump = () =>
	{
		const origin = body.current.translation()
		origin.y -= 0.31
		const direction = { x: 0, y: -1.5, z: 0 }
		const ray = new rapier.Ray(origin, direction)
		const hit = world.castRay(ray)
		// if(hit){
			if(hit && hit.toi < 0.2)
				body.current.applyImpulse({ x: 0, y: 0.8, z: 0 })
		// }
	}




	const reset = () =>
    {
		body.current.setTranslation({ x: 0, y: 1, z: 0 })
		body.current.setLinvel({ x: 0, y: 0, z: 0 })
		body.current.setAngvel({ x: 0, y: 0, z: 0 })
    }

    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const restart = useGame((state) => state.restart)
    const blocksCount = useGame((state) => state.blocksCount)

	const { progress } = useProgress()

	// //para daw di natiotrigger twice
	useEffect(()=>{
		if(progress >= 100) {
			const unsubscribeReset = useGame.subscribe(
				(state) => state.phase,
				(value) => {
					// console.log('phase changes to', value)

					if(value === 'ready')
						reset()
				}
			)


			const unsubscribeJump = subscribeKeys(
				(state)=>{
					return state.jump
				},
				(value)=>{
					value && jump()
				}
			)

			
			const unsubscribeAny = subscribeKeys(()=>{
				start()
			})

			return(()=>{
				unsubscribeJump()
				unsubscribeAny()
				unsubscribeReset()
			})
		}
	},[progress])



	return <RigidBody
		colliders={ false }
		position={ [0,1,0]}
		friction={ 1 }
		restitution={ .1 }
		canSleep={ false } // kaya pala nagadan sio cube mo pagkatapos mo dae pagong click for a while
		ref={ body }
	>
		<group
			position={ [0,.1,0] }
			rotation-y={ Math.PI * .5 }
			// rotation-x={ .2}
			>
			<mesh
			receiveShadow
			castShadow
			>
					<primitive object={ piano.scene }
					
						scale={0.025} 
					/>
			</mesh>
			<mesh
			receiveShadow
			castShadow
			>
					<primitive
						object={charObj }
						scale={ 0.003 }
						position={[ 0,.1,-.2]}
					/>
			</mesh>
			<RoundCuboidCollider
				args={ [.1,.1,.17,.2,0]}
				position={[0,.3,.07]}
				mass={.15 }
			/>
			{/* <CuboidCollider args={ [.25,.3,.35]} position={[0,.3,.05]}  canSleep={ false } /> */}
			{/* <BallCollider args={[.3] } position={[0,.3,.1]} />
			<BallCollider args={[.19] } position={[.1,.19,-.2]} />
			<BallCollider args={[.19] } position={[-.1,.19,-.2]} /> */}
		</group>
	</RigidBody> 
}