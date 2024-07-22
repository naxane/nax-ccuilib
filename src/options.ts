import type { Options } from "ccmodmanager/types/mod-options";

export let Opts: ReturnType<typeof modmanager.registerAndGetModOptions<ReturnType<typeof registerOpts>>>;

export function registerOpts() {
	const defaultLayout: Record<number, string> = {
		[nax.ccuilib.quickRingUtil.getIdFromRingPos(0, 0)]: "11_items",
		[nax.ccuilib.quickRingUtil.getIdFromRingPos(0, 2)]: "11_analyze",
		[nax.ccuilib.quickRingUtil.getIdFromRingPos(0, 4)]: "11_party",
		[nax.ccuilib.quickRingUtil.getIdFromRingPos(0, 6)]: "11_map",
	};
	const opts = {
		general: {
			settings: {
				title: "General",
				tabIcon: "general",
			},
			headers: {
				"quick menu": {
					lockLayout: {
						type: "CHECKBOX",
						init: false,
						name: "Lock quick menu layout",
						description: "Lock the quick menu button layout.",
					},
					resetButton: {
						type: "BUTTON",
						onPress() {
							Opts.ringConfiguration = defaultLayout;
						},
						name: "Reset the default layout",
						description: "Restore the quick menu layout to the default one.",
					},

					ringConfiguration: {
						type: "JSON_DATA",
						init: defaultLayout,
					},
					buttonPressStatus: {
						type: "JSON_DATA",
						init: {} as Record<string, boolean>,
					},
				},
			},
		},
	} as const satisfies Options;

	Opts = modmanager.registerAndGetModOptions(
		{
			modId: "nax-ccuilib",
			title: "CCUILib",
			helpMenu: {
				title: "CCUILib",
				pages: [
					{
						title: "\\c[3]CCUILib\\c[0]: Quick menu extension\n",
						content: [
							"Allows for quick menu buttons to be moved and for new buttons to be added by mods.\n\n" +
								"To enter edit mode, press \\i[key-throw] or \\i[gamepad-x].\n" +
								"Press \\i[key-throw] or \\i[gamepad-x] on a focused button to \\c[3]cut\\c[0] it, then press \\i[key-throw] or \\i[gamepad-x] on a different button to \\c[3]paste\\c[0] it there.\n" +
								"To switch rings on gamepad, use \\i[gamepad-l1] and \\i[gamepad-r1].\n",
						],
					},
				],
			},
		},
		opts
	);
	return opts;
}
