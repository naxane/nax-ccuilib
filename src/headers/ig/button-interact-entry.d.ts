export { };

declare global {
	namespace ig {
		interface ButtonInteractEntry {
			removeButtonGroup(buttonGroup: sc.ButtonGroup): void;
		}
	}
}