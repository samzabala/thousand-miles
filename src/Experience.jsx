import { useState,useEffect } from 'react'
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

    let loopTimeout

    const loopAudio = () => {
        ambience.muted = false
        ambience.currentTime = 0;
        ambience.play();
        loopTimeout = setTimeout(loopAudio, 10600);

    }

    const playAudio = () => {
        ambience.pause();
        ambience.muted = false
        ambience.currentTime = 10.5
        ambience.play()
    }


    useEffect(()=>{

		const unsubscribePlayAudio = useGame.subscribe(
			(state) => state.phase,
			(value) => {
                console.log('phase changes to', value)

                if(value === 'ready' ) {
                    loopAudio()
                } else {
                    clearTimeout(loopTimeout);

                }

                if(value === 'playing'){
                    playAudio()
                } 
			}
		)

		return(()=>{
			unsubscribePlayAudio()
		})
	},[])

    return <>

        <color attach="background" args={ ['#bdedfc'] }/>


        <Lights />
        <Physics  >
            <Level count={ blocksCount } types={ [BlockAx,BlockSpinner,BlockLimbo] } seed={ blocksSeed } />
        </Physics>

    </>
}