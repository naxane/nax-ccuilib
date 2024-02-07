/// <reference path="global.d.ts" />

import { Mod, PluginClass } from "ultimate-crosscode-typedefs/modloader/mod";
import { quickRingUtil } from "./ui/quick-menu/quick-menu-preload.js";

export default class Item implements PluginClass {
	mod: Mod;

	constructor(mod: Mod) {
		this.mod = mod;

		// @ts-expect-error
		window.nax ??= {};
		// @ts-expect-error
		window.nax.ccuilib ??= {};

		quickRingUtil.initExtensionVars();
	}

	prestart() {
		const dir = this.mod.baseDirectory.substring(7);
		// @ts-expect-error
		window.moduleCache.registerModPrefix("nax-ccuilib", dir);

		ig.lib = dir;

		ig._loadScript("nax-ccuilib.ui");
	}

	poststart() {
		import("./ui/quick-menu/additional-widgets.js");
	}
}
