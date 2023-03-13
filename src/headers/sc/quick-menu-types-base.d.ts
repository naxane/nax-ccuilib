

export { };

declare global {
	namespace sc {
		interface QuickMenuTypesBase extends ig.FocusGui {
			gfx: ig.Image;
			entity: ActorEntity
		}

		interface QuickMenuTypesBaseCon extends ImpactClass<QuickMenuTypesBase> {
			new(): QuickMenuTypesBase;
		}

		let QuickMenuTypesBase: QuickMenuTypesBaseCon;
	}
}