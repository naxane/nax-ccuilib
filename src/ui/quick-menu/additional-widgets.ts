ig.module("nax-ccuilib.ui.quick-menu.additional-widgets")
	.requires("game.feature.party.party")
	.defines(() => {
		/* character swap */
		function getPlayerHeadConfig(playerName: string): nax.ccuilib.QuickMenuWidgetImageConfig {
			return () => {
				const headIdx = sc.party.models[playerName].getHeadIdx();
				return {
					gfx: new ig.Image("media/gui/severed-heads.png"),
					pos: { x: 4, y: 1 },
					srcPos: { x: headIdx * 24, y: 0 },
					size: { x: 24, y: 24 },
				};
			};
		}
		for (let i = 0; i < sc.PARTY_OPTIONS.length; i++) {
			const playerName = sc.PARTY_OPTIONS[i];
			const image = getPlayerHeadConfig(playerName);
			nax.ccuilib.QuickRingMenuWidgets.addWidget({
				title: playerName,
				name: `chararacter_${playerName}`,
				description: `Click to play as ${playerName}`,
				image,
				pressEvent: () => {
					const config = sc.party.models[playerName].config;
					sc.model.player.setConfig(config);
					ig.ENTITY.Combatant.prototype.update.call(ig.game.playerEntity);
				},
			});
		}

		/* jetpack */
		let jetpackOn = false;
		const keyboardJetpackOn = !(sc.OPTIONS_DEFINITION["keys-jump"] /* CCJetpack */);
		if (keyboardJetpackOn) ig.input.bind(ig.KEY.CTRL, "keys-jump");
		ig.ENTITY.Player.inject({
			update() {
				this.parent();
				if (jetpackOn && (ig.gamepad.isButtonDown(ig.BUTTONS.FACE0 /* a */) || (keyboardJetpackOn && ig.input.state("keys-jump"))))
					ig.game.playerEntity.doJump(150, 16, 250);
			},
		});
		nax.ccuilib.QuickRingMenuWidgets.addWidget({
			name: "jetpack",
			title: "Toggle jetpack",
			description: "Press CTRL or gamepad A to fly.",
			pressEvent: () => {
				jetpackOn = !jetpackOn;
			},
			keepPressed: true,
			image: () => ({
				gfx: new ig.Image("media/gui/widgetIcons.png"),
				srcPos: { x: 0, y: 0 },
				pos: { x: 9, y: 8 },
				size: { x: 16, y: 16 },
			}),
		});
	});
