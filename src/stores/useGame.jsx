import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'


export default create(subscribeWithSelector((set) =>
{
	const maxSeeds = 23 //because * 3 is equal to my favorite number mweeheeheee

    return {
        blocksCount: 3,
		blockSeed: 1,
		phase: 'ready', // ready,playing,ended
        startTime: 0,
        endTime: 0,



		start: ()=>{
			set((state) => {
				if(state.phase === 'ready')
					return { phase: 'playing', startTime: Date.now() }
		
				return {}
			})
		},

        restart: () => {
            set((state) => {
				if(state.phase === 'ended' ){
					const newSeed = state.blockSeed + 1;
					return { phase: 'ready', blocksCount: newSeed * state.blocksCount, blockSeed: newSeed   }
					
				}else if(state.phase === 'won' ){
					return { phase: 'ready', blocksCount: 1, blockSeed: 1   }
				}else if(state.phase === 'playing' ){
					return { phase: 'ready' }
				
				}else{
					return {}
				}
		
            })
        },


        end: () => {
			set((state) => {
				if(state.phase === 'playing'){
					if(state.blockSeed > maxSeeds) {
						return { phase: 'won', endTime: Date.now()   }
					} else {
						return { phase: 'ended', endTime: Date.now() }
					}
				}
		
				return {}
			})
        },
    }
}))