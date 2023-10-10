import * as THREE from 'three'
import {useMemo,useState,usEffect,useRef, useEffect} from 'react'
import {CuboidCollider,useRapier,RigidBody,BallCollider,RoundCuboidCollider} from '@react-three/rapier'
import {useFrame} from '@react-three/fiber'
import {Html,Text,useKeyboardControls,Float,useGLTF} from '@react-three/drei'
import Player from './Player.jsx'
import Credits from './Credits.jsx'

//optimize ya bitches
	const boxGeometry = new THREE.BoxGeometry(1,1,1)

	const floor1Material = new THREE.MeshStandardMaterial({ color: 'lawngreen' })
	const floor2Material = new THREE.MeshStandardMaterial({ color: 'limeGreen' })
	const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
	const wallMaterial = new THREE.MeshStandardMaterial({ color: 'ForestGreen' })

	const textMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false })

	const colliderProps = {
		restitution: 0.2,
		friction: 0
	}

export function BlockStart({ position = [ 0, 0, 0 ] }) {

	const [ showCredits, setShowCredits ] = useState(() => false )

	const creditsMaterial = useRef()

	return <>
	<Float
		rotationIntensity={.2}
	>
		<group
			position={ [ 0.1, 0.9, 0.4 ] }
			rotation-y={ - 0.01 }
			rotation-z={ -0.1 }
		>
			<Text
				font="./bebas-neue-v9-latin-regular.woff"
				scale={ 0.25 }
				maxWidth={ 5 }
				depthOffset={ 2}
				lineHeight={ 0.75 }
				textAlign="right"
				material={ textMaterial }
			>
				
				Makin' my way downtown...
				<meshBasicMaterial toneMapped={ false } />
			</Text>

			<Text
				font="./bebas-neue-v9-latin-regular.woff"
				scale={ 0.07 }
				maxWidth={ 5 }
				textAlign="right"
				depthOffset={ 2}
				position={ [ .53, -0.3, 0 ] }
				material={ textMaterial }
				onClick={()=>{
					setShowCredits(!showCredits)
				} }
				onPointerEnter={ () => {
					creditsMaterial.current.color.setHex(new THREE.Color('orangered').getHex())
					document.body.style.cursor = 'pointer' }
				}
				onPointerLeave={ () => {
					creditsMaterial.current.color.setHex(0xffffff)
					document.body.style.cursor = 'default' }
				}
			>
				Credits
				<meshBasicMaterial ref={ creditsMaterial } toneMapped={ false } />

				<Html>
					{showCredits ? <Credits /> : null }
				</Html>
			</Text>
		</group>
	</Float>
	<RigidBody type="fixed" colliders="hull"
		{...colliderProps }
	>

		<mesh
			geometry={boxGeometry}
			position={ position }
			scale={[ 4, 0.2, 4 ]}
			receiveShadow
			material={ floor1Material }
		>
		</mesh>
	</RigidBody>
	</>
}

export function BlockEnd({ position = [ 0, 0, 0 ] }) {
	const burger = useGLTF('./hamburger.glb')
    burger.scene.children.forEach((mesh) =>
    {
        mesh.castShadow = true
    })
	return <>
	<RigidBody colliders="hull" type="fixed"
		{...colliderProps }
		position={ position }
	>
		<mesh
			geometry={boxGeometry}
			scale={[ 4, 0.2, 4 ]}
			receiveShadow
			material={ floor1Material }
		>
		</mesh>
		<primitive object={ burger.scene } scale={0.2} />
	</RigidBody>
	</>
}

export function BlockSpinner({ position = [ 0, 0, 0 ] }) {
    const obstacle = useRef()

	const [ speed ] = useState(()=> (Math.random() + .5) * (Math.random() < 0.5 ? 1 : -1) )


	useFrame((state) => {
		if(obstacle.current){
	
			const time = state.clock.getElapsedTime()
	
			//spinny thing
			const rotation = new THREE.Quaternion()
			rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
			obstacle.current.setNextKinematicRotation(rotation)
		}
	})

    return <group position={ position }>
        <mesh
			geometry={ boxGeometry }
			material={ floor2Material }
			position={ [ 0, - 0.1, 0 ] }
			scale={ [ 4, 0.2, 4 ] }
			receiveShadow
			/>

			<RigidBody ref={obstacle}type="kinematicPosition"
				position={ [ 0, 0.3, 0 ] }
				{...colliderProps }
			>

				<mesh
					geometry={ boxGeometry }
					material={ obstacleMaterial }
					scale={ [ 3.5, 0.3, 0.3 ] }
					receiveShadow
					castShadow
					/>
			</RigidBody>
    </group>
}



export function BlockLimbo({ position = [ 0, 0, 0 ] })
{
    const obstacle = useRef()

	const [ timeOffset ] = useState(()=> Math.random() * Math.PI * 2 )



    useFrame((state) => {
		if(obstacle.current){
			
			const time = state.clock.getElapsedTime()
	
			const y = Math.sin(time + timeOffset) + 1.15
			obstacle.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] })
		}
    })

    return <group position={ position }>
        <mesh
			geometry={ boxGeometry }
			material={ floor2Material }
			position={ [ 0, - 0.1, 0 ] }
			scale={ [ 4, 0.2, 4 ] }
			receiveShadow
			/>

			<RigidBody ref={obstacle}type="kinematicPosition"
				position={ [ 0, 0.3, 0 ] }
				restitution={ 0.2 }
				friction={ 0 }
			>

				<mesh
					geometry={ boxGeometry }
					material={ obstacleMaterial }
					scale={ [ 3.5, 0.3, 0.3 ] }
					receiveShadow
					castShadow
					/>
			</RigidBody>
    </group>
}



export function BlockAx({ position = [ 0, 0, 0 ] })
{
    const obstacle = useRef()

	const [ timeOffset ] = useState(()=> Math.random() * Math.PI * 2 )

    useFrame((state) =>
    {
		if(obstacle.current){
			
			const time = state.clock.getElapsedTime()
	
			const x = Math.sin(time + timeOffset)
			obstacle.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1], z: position[2] })
		}
    })

    return <group position={ position }>
        <mesh
			geometry={ boxGeometry }
			material={ floor2Material }
			position={ [ 0, - 0.1, 0 ] }
			scale={ [ 4, 0.2, 4 ] }
			receiveShadow
			/>

			<RigidBody ref={obstacle} type="kinematicPosition"
				position={ [ 0, 0, 0 ] }
				restitution={ 0.2 }
				friction={ 0 }
			>

				<mesh
					geometry={ boxGeometry }
					material={ obstacleMaterial }
					scale={ [ 1.5, 1.5, 0.3 ] }
					position-y={ 0.75 }
					receiveShadow
					castShadow
				/>
				
			</RigidBody>
    </group>
}


function Bounds({length=1}){
	return <>
		{/* wall left */}
		<mesh 
            position={ [ 2.15, .75, - (length * 2) + 2 ] }
            geometry={ boxGeometry }
            material={ wallMaterial }
            scale={ [ 0.3, 1.5, 4 * length ] }
			castShadow
		/>
		{/* wall right */}
		<mesh 
            position={ [ -2.15, .75, - (length * 2) + 2 ] }
            geometry={ boxGeometry }
            material={ wallMaterial }
            scale={ [ 0.3, 1.5, 4 * length ] }
			castShadow receiveShadow
		/>
		{/* wall end */}
        <mesh
            position={ [ 0, .75, - (length * 4) + 2] }
            geometry={ boxGeometry }
            material={ wallMaterial }
            scale={ [ 4, 1.5, 0.3 ] }
            receiveShadow
        />

	{/* collider for floor*/}
	{/* friction p[ara gumulong ang bol] */}
	<CuboidCollider
		args={ [ 2, 0.1, 2 * length ] }
		position={ [ 0, -0.1, - (length * 2) + 2 ] }
		restitution={ 0.2 }
		friction={ 1 }
	/>

	{/* walls because it wont fuckin update  the colliders with the mesh fuckin shiiet*/}
		{/* wall left */}
		<CuboidCollider
			args={ [ 0.15, .75, 2 * length ] }
			position={ [ 2.15, .75, - (length * 2) + 2 ] }
			restitution={ 0.2 }
			friction={ 1 }
		/>
		{/* wall right */}
		<CuboidCollider
			args={ [ 0.15, .75, 2 * length ] }
			position={ [ -2.15, .75, - (length * 2) + 2 ] }
			restitution={ 0.2 }
			friction={ 1 }
		/>
		{/* wall end */}
		<CuboidCollider
			args={ [ 2, .75, 0.15 ] }
			position={ [ 0, .75, - (length * 4) + 2] }
			restitution={ 0.2 }
			friction={ 1 }
		/>
	</>
}


export function Level({
	count = 1,
	types = [ BlockSpinner, BlockAx, BlockLimbo ],
	seed = 1
}){

	const blocks = useMemo(() =>
    {
        const blocks = []

		for(let i = 0; i < (count); i++){
			const type = types[ Math.floor(Math.random() * types.length) ]
			blocks.push(type)
		}

		
        return blocks
    }, [ count, types, seed ])

	return <>


        <BlockStart position={ [ 0, 0, 0 ] } />
		<Player />

        { blocks.map((Block, index) => <Block key={ index } position={ [ 0, 0, - (index + 1) * 4 ] } />) }

        <BlockEnd position={ [ 0, 0, - (blocks.length + 1) * 4 ] } />
		
        <Bounds length={ blocks.length + 2 } />

	</>
}