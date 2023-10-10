import { useEffect,useRef } from 'react'
import { addEffect } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import useGame from '../stores/useGame.jsx'

export default function Ui(){
	
    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)
    const jump = useKeyboardControls((state) => state.jump)

	const [triggerState,trigger] = useKeyboardControls()

    const phase = useGame((state) => state.phase)
    const restart = useGame((state) => state.restart)

	const time = useRef()


    useEffect(() =>
    {
		const unsubscribeEffect = addEffect(() =>
		{
			const state = useGame.getState()
	
			let elapsedTime = 0
	
			if(state.phase === 'playing')
				elapsedTime = Date.now() - state.startTime
			else if(state.phase === 'ended')
				elapsedTime = state.endTime - state.startTime

				elapsedTime /= 1000


			elapsedTime = elapsedTime.toFixed(2)

			
			if(time.current)
				time.current.textContent = elapsedTime
		})
	
		return () =>
		{
			unsubscribeEffect()
		}
    }, [])

    return <div className="interface">
    {/* Time */}
    <div ref={time} className="time">0.00</div>
		{ (phase === 'ended' || phase === 'won')
			? <button className="restart" onClick={ restart }>
				{ phase == 'won' 
					? <>
					You can stop now god get a life <br />
					<small>(Or you can start from scratch again if you like to suffer)</small>
					</>
					: 'You Want More?'
				}
			</button>
			: null
		}

		{/* Controls */}
		<div className="controls">
			<div className="raw">
				<button onMouseDown={ () =>{  } } className={ `key forwards  ${ forward ? 'active' : '' }` }>&uarr;</button>
				<button onMouseDown={ () =>{  } } className={ `key left  ${ leftward ? 'active' : '' }` }>&larr;</button>
				<button onMouseDown={ () =>{  } } className={ `key backwards  ${ backward ? 'active' : '' }` }>&darr;</button>
				<button onMouseDown={ () =>{  } } className={ `key right  ${ rightward ? 'active' : '' }` }>&rarr;</button>
				<button onMouseDown={ () =>{  } } className={ `key jump  ${ jump ? 'active' : '' }` }>[SPACE]</button>
			</div>
		</div>
    </div>
}