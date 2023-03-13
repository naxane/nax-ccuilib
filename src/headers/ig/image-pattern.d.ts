
export { };

declare global {
	namespace ig {
		interface ImagePatternConstructor extends ImpactClass<ImagePattern> {
			OPT: typeof ImagePattern$OPT;
			new(path: string, x: number, y: number, width: number, height: number, patternType: ImagePattern$OPT): ig.ImagePattern;
		}
	}
}