ig.module("nax-ccuilib.ui.quick-menu.help-button").defines(() => {
	let button: sc.ButtonGui;
	const localStorageId = "ccuilib-hidequickmenuhelpbutton";

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
				sc.Dialogs.showChoiceDialog(text, sc.DIALOG_INFO_ICON.INFO, ["Close", "Hide"], button => {
					if (button.data == 1) {
						localStorage.setItem(localStorageId, "true");
					}
				});
			};
			this.addChildGui(button);
		},
		_enterMenu() {
			this.parent();

			if (localStorage.getItem(localStorageId) != "true") {
				sc.quickmodel.buttonInteract.addGlobalButton(button, () => sc.control.menuHotkeyHelp());
				button.doStateTransition("DEFAULT");

				button.doPosTranstition(349, 295, 0, KEY_SPLINES.LINEAR);
			}
		},
		_exitMenu() {
			this.parent();
			sc.quickmodel.buttonInteract.removeGlobalButton(button);
			button.doStateTransition("HIDDEN", true);

			const popup = ig.gui.guiHooks.find(h => h.gui instanceof sc.ModalButtonInteract)?.gui as sc.ModalButtonInteract | undefined;
			if (popup) {
				popup.buttongroup._invokePressCallbacks(popup.buttons[0]);
			}
		},
	});
});
