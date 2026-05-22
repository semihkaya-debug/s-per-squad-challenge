# Native App Icons & Splash Screens

Source assets and pre-generated sizes for the Capacitor Android/iOS builds.

## Sources (edit these to rebrand)

- `icon.png` — 1024×1024 master app icon
- `splash.png` — 1920×1920 light splash (centered logo, dark navy bg)
- `splash-dark.png` — 1920×1920 dark splash

## Recommended: regenerate with @capacitor/assets

Once you've added the native platforms locally (`bunx cap add android` / `ios`), run:

```bash
bun add -D @capacitor/assets
bunx capacitor-assets generate --iconBackgroundColor "#1a1f2e" \
                               --iconBackgroundColorDark "#1a1f2e" \
                               --splashBackgroundColor "#1a1f2e" \
                               --splashBackgroundColorDark "#1a1f2e"
```

This reads `resources/icon.png`, `resources/splash.png`, `resources/splash-dark.png`
and writes every required size into `android/app/src/main/res/...` and
`ios/App/App/Assets.xcassets/...` automatically.

## Pre-generated sizes (manual fallback)

If you can't run the CLI, the exact PNGs are already exported here:

### Android (`resources/android/`)
- `icon/mipmap-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}-ic_launcher.png`
- `icon/mipmap-*-ic_launcher_round.png`
- `icon/mipmap-*-ic_launcher_foreground.png` (adaptive icon)
- `splash/drawable-{land,port}-{mdpi…xxxhdpi}-splash.png`
- `splash/drawable-night-...-splash.png` (dark mode)

Copy each file into the matching `android/app/src/main/res/mipmap-*/` or
`drawable-*/` folder after `bunx cap add android`. Rename by stripping the
density prefix (e.g. `mipmap-hdpi-ic_launcher.png` → `mipmap-hdpi/ic_launcher.png`).

### iOS (`resources/ios/`)
- `icon/AppIcon-{20,29,40,58,60,76,80,87,120,152,167,180,1024}.png`
- `splash/splash-{2732x2732,1334x1334,750x750}.png` (+ `splash-dark-*`)

Drag the icon PNGs into `ios/App/App/Assets.xcassets/AppIcon.appiconset/` and
the splashes into `Splash.imageset/` in Xcode. The `@capacitor/assets` CLI is
strongly preferred over doing this by hand.
