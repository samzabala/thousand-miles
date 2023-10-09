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
		{ phase === 'ended' ? <button className="restart" onClick={ restart }>Again</button> : null }

		{/* Controls */}
		<div className="controls">
			<div className="raw">
			</div>
			<div className="raw">
				<div className={ `key forwards  ${ forward ? 'active' : '' }` }>&uarr;</div>
				<div className={ `key left  ${ leftward ? 'active' : '' }` }>&larr;</div>
				<div className={ `key backwards  ${ backward ? 'active' : '' }` }>&darr;</div>
				<div className={ `key right  ${ rightward ? 'active' : '' }` }>&rarr;</div>
				<div className={ `key jump  ${ jump ? 'active' : '' }` }>[SPACE]</div>
			</div>
		</div>
    </div>
}