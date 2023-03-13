ig.module("nax-ccuilib.ui.test-menu")
	.requires(
		"impact.feature.gui.gui",
		"nax-ccuilib.ui.input-field"
	)
	.defines(() => {
		nax.ccuilib.TestMenu = sc.BaseMenu.extend({
			buttonGroup: null,
			content: null,
			init() {
				this.parent();
				this.hook.size.x = ig.system.width;
				this.hook.size.y = ig.system.height;

				// One button group required for back button to default to
				this.buttonGroup = new sc.ButtonGroup();

				// Wrapper box for our UI
				this.content = new ig.GuiElementBase();
				this.content.setSize(300, 200);


				this.doStateTransition("DEFAULT", true);
			},

			showMenu() {
				this.addObservers();

				sc.menu.buttonInteract.pushButtonGroup(this.buttonGroup);
				sc.menu.pushBackCallback(this.onBackButtonPress.bind(this));
				sc.menu.moveLeaSprite(0, 0, sc.MENU_LEA_STATE.HIDDEN);
			},

			hideMenu() {
				this.removeObservers();
				sc.menu.moveLeaSprite(0, 0, sc.MENU_LEA_STATE.LARGE);
				sc.menu.buttonInteract.removeButtonGroup(this.buttonGroup);
			},

			// Called by showMenu
			addObservers() {
				sc.Model.addObserver(sc.menu, this);
			},

			// Called by hideMenu
			removeObservers() {
				sc.Model.removeObserver(sc.menu, this);
			},

			onBackButtonPress() {
				sc.menu.popBackCallback();
				sc.menu.popMenu();
			},

			// Although empty, is required.
			modelChanged(sender, event, data) {

			},
		});
	});