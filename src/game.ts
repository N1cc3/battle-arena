import { createServer } from './server'

export type GameMsgIn = { type: 'animate'; anim: string }
export type GameMsgOut = { type: 'game_state'; state: GameState }

interface Character {
	name: string
	hp: number
	animation: string
}

interface GameState {
	characters: Character[]
}

const games: Record<string, GameState> = {}

createServer<GameMsgIn, GameMsgOut>({
	onHost(game) {
		const newGame = (games[game.id] = { characters: [] })
		game.broadcast({ type: 'game_state', state: newGame })
	},
	onJoin(game, player) {
		const joinedGame = games[game.id]
		if (!joinedGame) return
		joinedGame.characters.push({ name: player.name, hp: 10, animation: 'Great Sword Idle' })
		game.broadcast({ type: 'game_state', state: joinedGame })
	},
	onGameMsg(game, player, msg) {
		const currentGame = games[game.id]
		if (!currentGame) return
		if (msg.type === 'animate') {
			const char = currentGame.characters.find((c) => c.name === player.name)
			if (!char) return
			char.animation = msg.anim
			game.broadcast({ type: 'game_state', state: currentGame })
		}
	},
})
