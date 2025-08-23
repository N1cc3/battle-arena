import { createServer } from './server'
import { defaultStats } from './stats'

export type GameMsgIn = { type: 'animate'; anim: string }
export type GameMsgOut = { type: 'game_state'; state: GameState }

export interface Character {
	name: string
	hp: number
	animation: string
	equipment: Equipment[]
}

export interface Equipment {
	name: string
	type: 'weapon' | 'head' | 'chest' | 'legs' | 'feet' | 'hands'
	applyStats(stats: Readonly<Stats>): Stats
}

export interface Stats {
	attack: number
	armor: number
	hp: number
}

export interface GameState {
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
		joinedGame.characters.push({ name: player.name, hp: 10, animation: 'Great Sword Idle', equipment: [] })
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

export const getStats = (char: Character) => char.equipment.reduce((acc, item) => item.applyStats(acc), defaultStats)
export const combat = (attacker: Character, defender: Character) => {
	const attackerStats = getStats(attacker)
	const defenderStats = getStats(defender)

	const damage = Math.max(0, attackerStats.attack - defenderStats.armor)
	defender.hp -= damage

	return { attacker, defender, damage }
}

export const simulateTurn = (gameState: GameState) => {
	const { characters } = gameState
	characters.forEach((char) => {
		const target = getRandomTarget(char, characters)
		combat(char, target)
	})
}

const getRandomTarget = (char: Character, characters: Character[]): Character => {
	const filtered = characters.filter((c) => c !== char)
	const randomIndex = Math.floor(Math.random() * filtered.length)
	const target = filtered[randomIndex]
	if (!target) throw new Error('No valid target found')
	return target
}
