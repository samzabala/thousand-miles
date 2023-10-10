import { useState,useEffect,useMemo } from 'react'
import * as THREE from 'three'
import {Level,BlockAx,BlockSpinner,BlockLimbo} from './components/Level.jsx'
import { Physics } from '@react-three/rapier'
import Lights from './components/Lights.jsx'
import useGame from './stores/useGame.jsx'

export default function Experience() {
    const blocksCount = useGame((state) => state.blocksCount)
    const blocksSeed = useGame(state => state.blocksSeed)

    const [ ambience ] = useState(() => new Audio('./ambience.mp3'))
    ambience.muted = true
    ambience.volume = .8

    let _loopAudio

    const loopAudio = () => {
        ambience.muted = false
        ambience.currentTime = 0;
        ambience.play();
        _loopAudio = setTimeout(loopAudio, 10700);

    }

    const playAudio = () => {
        ambience.pause();
        ambience.muted = false
        ambience.currentTime = 10.7
        ambience.play()
    }



    useEffect(()=>{

		const unsubscribePlayAudio = useGame.subscribe(
			(state) => state.phase,
			(value) => {
                console.log('phase changes to', value)

                if(value === 'ready' ) {
                    setTimeout(()=> loopAudio(),100)
                } 

                if(value === 'playing'){
                    playAudio()
                    clearTimeout(_loopAudio);
                } 
			}
		)

		return(()=>{
            clearTimeout(_loopAudio);
			unsubscribePlayAudio()
		})
	},[])

    return <>

        <color attach="background" args={ ['SkyBlue'] }/>

        <Lights />
        <Physics  >
            <Level count={ blocksCount } types={ [BlockSpinner,BlockAx,BlockLimbo] } seed={ blocksSeed } />
        </Physics>

    </>
}