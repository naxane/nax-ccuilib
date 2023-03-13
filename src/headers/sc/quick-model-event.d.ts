

export { };

declare global {
	namespace sc {
		const enum QUICK_MODEL_EVENT {
			EXIT_MENU,
			SWITCH_STATE,
			INFO_TEXT_CHANGED,
			BUFF_TEXT_CHANGED,
			INPUT_MODEL_TOGGLED,
			FOCUS_NODE,
			UNFOCUS,
			ENSURE_FOCUS
		}
	}
}