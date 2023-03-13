export { };

declare global {
	namespace nax {
		namespace ccuilib {
			export function registerSubMenu(menuName: string, clazz: Function): void;
		}
	}
}