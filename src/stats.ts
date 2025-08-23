import { Equipment, Stats } from './game'

export const defaultStats: Stats = {
	attack: 10,
	armor: 0,
	hp: 100,
}

export const equipment: Equipment[] = [
	{
		name: 'Iron Sword',
		type: 'weapon',
		applyStats: (stats) => ({
			...stats,
			attack: stats.attack + 5,
		}),
	},
	{
		name: 'Iron Helmet',
		type: 'head',
		applyStats: (stats) => ({
			...stats,
			armor: stats.armor + 2,
		}),
	},
	{
		name: 'Iron Chestplate',
		type: 'chest',
		applyStats: (stats) => ({
			...stats,
			armor: stats.armor + 3,
		}),
	},
	{
		name: 'Iron Leggings',
		type: 'legs',
		applyStats: (stats) => ({
			...stats,
			armor: stats.armor + 2,
		}),
	},
	{
		name: 'Iron Boots',
		type: 'feet',
		applyStats: (stats) => ({
			...stats,
			armor: stats.armor + 1,
		}),
	},
	{
		name: 'Iron Gauntlets',
		type: 'hands',
		applyStats: (stats) => ({
			...stats,
			armor: stats.armor + 1,
		}),
	},
]
