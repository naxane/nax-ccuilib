ig.module("nax-ccuilib.ui.quick-menu.help-button").defines(() => {
	/* it differs from sc.Dialogs.showChoiceDialog by returning the dialog instance */
	function showChoiceDialog(
		text: sc.TextLike,
		icon: Nullable<sc.DIALOG_INFO_ICON>,
		option: sc.TextLike[],
		callback: (button: sc.ButtonGui & { data: number }, dialog?: sc.ModalButtonInteract) => void,
		disableSubmitSound?: Nullable<boolean>
	): sc.ModalButtonInteract {
		const popup = new sc.ModalButtonInteract(text, icon, option, callback, disableSubmitSound);
		ig.gui.addGuiElement(popup);
		popup.show();
		return popup;
	}

	let popup: sc.ModalButtonInteract;
	/* force keep the menu open while the popup is visible */
	sc.Control.inject({
		quickmenu() {
			if (popup?.hook?.currentStateName == "DEFAULT") return true;
			return this.parent();
		},
	});

	const localStorageId = "ccuilib-hidequickmenuhelpbutton";
	let button: sc.ButtonGui;
	sc.QuickMenu.inject({
		init() {
			this.parent();

			button = new sc.ButtonGui("\\i[help]Quick menu extension manual", undefined, undefined, sc.BUTTON_TYPE.DEFAULT);
			button.doStateTransition("HIDDEN", true);
			button.onButtonPress = () => {
				const text =
					"\\c[3]CCUILib\\c[0]: Quick menu extension\n" +
					"Allows for quick menu buttons to be moved and for new buttons to be added by mods.\n\n" +
					"To enter edit mode, press \\i[key-throw] or \\i[gamepad-x].\n" +
					"Press \\i[key-throw] or \\i[gamepad-x] on a focused button to \\c[3]cut\\c[0] it, then press \\i[key-throw] or \\i[gamepad-x] on a different button to \\c[3]paste\\c[0] it there.\n" +
					"To switch rings on gamepad, use \\i[gamepad-l1] and \\i[gamepad-r1].\n" +
					"Choose the \\c[3]Hide\\c[0] button to hide the help button.";
				popup = showChoiceDialog(text, sc.DIALOG_INFO_ICON.INFO, ["Close", "Hide"], button => {
					if (button.data == 1) {
						localStorage.setItem(localStorageId, "true");
					}
				});
			};
			this.addChildGui(button);
		},
		_enterMenu() {
			this.parent();

			/* CrossedEyes has a different quick menu help screen, below it's checking if it's enabled, if yes, then don't implement the help popup here */
			if (!sc.options.get("tts-tts")) {
				sc.quickmodel.buttonInteract.addGlobalButton(button, () => sc.control.menuHotkeyHelp());
				if (localStorage.getItem(localStorageId) != "true") {
					button.doStateTransition("DEFAULT");
					button.doPosTranstition(349, 295, 0, KEY_SPLINES.LINEAR);
				}
			}
		},
	});
});
