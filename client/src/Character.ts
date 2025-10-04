import { AnimationAction } from 'three'
import { AnimationsOf, Model } from './assets'

export class Character extends Model<'character_005'> {
	private item: Model<'equipment_005'>

	constructor() {
		super('character_005')
		this.item = new Model('equipment_005')
		this.add(this.item)
		itemSets.flatMap((s) => itemSlots.map((p) => this.getItemObj(s, p))).forEach((o) => (o.visible = false))
	}

	private getItemObj(set: ItemSet, slot: ItemSlot) {
		const obj = this.item.getObjectByName(`${set}_${slot}`)
		if (!obj) throw new Error(`Item ${set} ${slot} not found on model ${this.item}`)
		return obj
	}

	equip(set: ItemSet, slot: ItemSlot) {
		itemSets.forEach((s) => (this.getItemObj(s, slot).visible = false))
		this.getItemObj(set, slot).visible = true
	}

	override play(anim: AnimationsOf<'character_005'>, fadeSpeed = 1) {
		super.play(anim, fadeSpeed)
		this.item.play(anim, fadeSpeed)
	}

	update(delta: number) {
		this.mixer.update(delta)
		this.item.mixer.update(delta)
	}
}

export const itemSets = ['BlueSet', 'GreenSet'] as const
export type ItemSet = (typeof itemSets)[number]
export const itemSlots = ['Arms', 'Boots', 'Chest', 'Head', 'Pants'] as const
export type ItemSlot = (typeof itemSlots)[number]
