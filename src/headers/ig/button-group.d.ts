export { };

declare global {
	namespace ig {
		interface ButtonGroup {
			addPressCallback(callback: (data: any) => void): void;
		}
	}
}