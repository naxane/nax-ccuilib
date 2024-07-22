/// <reference path="global.d.ts" />

import { Mod, PluginClass } from "ultimate-crosscode-typedefs/modloader/mod";
import { registerOpts } from "./options.js";
import { initQuickRingUtil } from "./ui/quick-menu/quick-menu-preload.js";

export default class Item implements PluginClass {
	mod: Mod;

	constructor(mod: Mod) {
		this.mod = mod;

		// @ts-expect-error
		window.nax ??= {};
		// @ts-expect-error
		window.nax.ccuilib ??= {};

		initQuickRingUtil();
	}

	prestart() {
		registerOpts();
		const dir = this.mod.baseDirectory.substring(7);
		// @ts-expect-error
		window.moduleCache.registerModPrefix("nax-ccuilib", dir);

		ig.lib = dir;

		ig._loadScript("nax-ccuilib.ui");
	}
}
