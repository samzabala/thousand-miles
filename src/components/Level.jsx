import * as THREE from 'three'
import {useMemo,useState,useRef, useEffect} from 'react'
import {CuboidCollider,useRapier,RigidBody,BallCollider,RoundCuboidCollider} from '@react-three/rapier'
import {useFrame} from '@react-three/fiber'
import {Html,Text,useKeyboardControls,Float,useGLTF} from '@react-three/drei'
import Player from './Player.jsx'
import Credits from './Credits.jsx'

//optimize ya bitches
	const boxGeometry = new THREE.BoxGeometry(1,1,1)

	const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' })
	const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
	const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
	const wallMaterial = new THREE.MeshStandardMaterial({ color: '#609040' })

	const textMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false })


export function BlockStart({ position = [ 0, 0, 0 ] }){

	const [ showCredits, setShowCredits ] = useState(() => false )

	const creditsMaterial = useRef()

	return <>
	<Float>
		<group
			position={ [ 0.3, 0.65, 0.5 ] }
			rotation-y={ - 0.25 }
		>
			<Text
				font="./bebas-neue-v9-latin-regular.woff"
				scale={ 0.18 }
				maxWidth={ 5 }
				lineHeight={ 0.75 }
				textAlign="right"
				material={ textMaterial }
			>
				Makin my way downtown...
				<meshBasicMaterial toneMapped={ false } />
			</Text>

			<Text
				font="./bebas-neue-v9-latin-regular.woff"
				scale={ 0.07 }
				maxWidth={ 5 }
				textAlign="right"
				position={ [ .35, -0.2, 0 ] }
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
		restitution={0.2}
		friction={0}
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

export function BlockEnd({ position = [ 0, 0, 0 ] }){
	const burger = useGLTF('./hamburger.glb')
    burger.scene.children.forEach((mesh) =>
    {
        mesh.castShadow = true
    })
	return <>
	<RigidBody type="fixed" colliders="hull"
		restitution={0.2}
		friction={0}
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
			<RigidBody type="fixed" colliders="hull"
				restitution={0.2}
				friction={0}
			>
				<primitive object={ burger.scene } scale={0.2} position={ position } />
			</RigidBody>
	</>
}
export function BlockSpinner({ position = [ 0, 0, 0 ] })
{
    const obstacle = useRef()

	const [ speed ] = useState(()=> (Math.random() + .5) * (Math.random() < 0.5 ? 1 : -1) )


	useFrame((state) =>
{
		const time = state.clock.getElapsedTime()

		//spinny thing
		const rotation = new THREE.Quaternion()
		rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
		obstacle.current.setNextKinematicRotation(rotation)
	})

    return <group position={ position }>
        <mesh geometry={ boxGeometry }
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

				<mesh geometry={ boxGeometry }
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



    useFrame((state) =>
    {
        const time = state.clock.getElapsedTime()

        const y = Math.sin(time + timeOffset) + 1.15
        obstacle.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] })
    })

    return <group position={ position }>
        <mesh geometry={ boxGeometry }
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

				<mesh geometry={ boxGeometry }
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
        const time = state.clock.getElapsedTime()

        const x = Math.sin(time + timeOffset)
        obstacle.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1], z: position[2] })
    })

    return <group position={ position }>
        <mesh geometry={ boxGeometry }
			material={ floor2Material }
			position={ [ 0, - 0.1, 0 ] }
			scale={ [ 4, 0.2, 4 ] }
			receiveShadow
			/>

			<RigidBody ref={obstacle}type="kinematicPosition"
				position={ [ 0, 0, 0 ] }
				restitution={ 0.2 }
				friction={ 0 }
			>

				<mesh geometry={ boxGeometry }
					material={ obstacleMaterial }
					scale={ [ 1.5, .75, 0.3 ] }
					position-y={ 0.35 }
					receiveShadow
					castShadow
					/>
			</RigidBody>
    </group>
}


function Bounds({length=1}){
	return <>
	<RigidBody type="fixed" restitution={ 0.2 } friction={0}>
		<mesh 
            position={ [ 2.15, .75, - (length * 2) + 2 ] }
            geometry={ boxGeometry }
            material={ wallMaterial }
            scale={ [ 0.3, 1.5, 4 * length ] }
			castShadow
		/>
		<mesh 
            position={ [ -2.15, .75, - (length * 2) + 2 ] }
            geometry={ boxGeometry }
            material={ wallMaterial }
            scale={ [ 0.3, 1.5, 4 * length ] }
			castShadow receiveShadow
		/>
        <mesh
            position={ [ 0, .75, - (length * 4) + 2] }
            geometry={ boxGeometry }
            material={ wallMaterial }
            scale={ [ 4, 1.5, 0.3 ] }
            receiveShadow
        />

	</RigidBody>

	{/* collider for floor*/}
	{/* friction p[ara gumulong ang bol] */}
	<CuboidCollider
		args={ [ 2, 0.1, 2 * length ] }
		position={ [ 0, -0.1, - (length * 2) + 2 ] }
		restitution={ 0.2 }
		friction={ 1 }
	/>
	{/* <CuboidCollider
		args={ [ 2, 0.1, 2 * length ] }
		position={ [ 0, 2.1, - (length * 2) + 2 ] }
		restitution={ 0.2 }
		friction={ 1 }
	/> */}
	{/* <CuboidCollider
		args={ [ 4, 2, 0.3 ] }
		position={ [ 0, 0, 2] }
		restitution={ 0.2 }
		friction={ 1 }
	/> */}
	</>
}


export function Level({
	count = 1,
	types = [ BlockSpinner, BlockAx, BlockLimbo ],
	seed = 0
}){

	const blocks = useMemo(() =>
    {
        const blocks = []

		for(let i = 0; i < count; i++){
			const type = types[ Math.floor(Math.random() * types.length) ]
			blocks.push(type)
		}
		
        return blocks
    }, [ count, types, seed ])

	return <>


        <BlockStart position={ [ 0, 0, 0 ] } />
		<Player />

        { blocks.map((Block, index) => <Block key={ index } position={ [ 0, 0, - (index + 1) * 4 ] } />) }

        <BlockEnd position={ [ 0, 0, - (count + 1) * 4 ] } />
        <Bounds length={ count + 2 } />

	</>
}