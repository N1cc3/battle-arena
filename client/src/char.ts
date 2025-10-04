import { AnimationMixer } from 'three'
import { AnimationsOf, Model } from './assets'

export class Character extends Model<'character_005'> {
	private equip: Model<'equipment_005'>

	constructor() {
		super('character_005')
		this.equip = new Model('equipment_005')
		this.add(this.equip)
	}

	override play(anim: AnimationsOf<'character_005'>) {
		this.equip.play(anim)
		return super.play(anim)
	}

	update(delta: number) {
		this.mixer.update(delta)
		this.equip.mixer.update(delta)
	}
}
