export { };

declare global {
	namespace ig {
		interface Input {
			mouse: Vec2;
			ignoreKeyboard: boolean;
		}
	}
}