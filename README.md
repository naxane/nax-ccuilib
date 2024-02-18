<!-- markdownlint-disable MD013 MD024 MD001 MD045 -->

# nax-ccuilib

Aims to provide cross compatability with multiple mods wanting to use the same UI space.

## Quick menu extension

https://github.com/krypciak/nax-ccuilib/assets/115574014/45e3745f-399a-41a3-93b9-751260c63129

The action button is right click or press X on gamepad.  
To switch rings on gamepad, use L1 and R1.

### Mods that add more widgets

- [cc-jetpack-widget](https://github.com/krypciak/cc-jetpack-widget) adds a jetpack widget  
- [cc-character-widgets](https://github.com/krypciak/cc-character-widgets) adds character swapping widgets
- [cc-vim](https://github.com/krypciak/cc-vim) add some useful widgets for mod developers
- [cc-speedrun-utilities](https://github.com/CCDirectLink/cc-speedrun-utilities) add speedrun related widgets
- [cc-blitzkrieg](https://github.com/krypciak/cc-blitzkrieg) adds a puzzle skipping widget

### For developers

#### Building

```bash
git clone https://github.com/naxane/nax-ccuilib
cd nax-ccuilib
npm install
# this should return no errors (hopefully)
npx tsc
npm run build
```

This should output a `.ccmod`  

#### Adding your own widget

```ts
import 'nax-ccuilib/src/headers/nax/quick-menu-public-api.d.ts'

/* check if the mod is installed */
if (nax.ccuilib.QuickRingMenuWidgets) {
    nax.ccuilib.QuickRingMenuWidgets.addWidget({
        name: 'freesp',
        title: 'Give SP',
        description: 'Gives the player SP',
        pressEvent: () => {
            ig.game.playerEntity.params.currentSp += 4
        },
        image: () => ({
            gfx: new ig.Image('media/gui/menu.png'),
            srcPos: { x: 593, y: 18 },
            pos: { x: 11, y: 10 },
            size: { x: 12, y: 12 },
        }),
    })
}
```
