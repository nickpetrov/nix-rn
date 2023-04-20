## Install dependencies

1. `yarn install` (or `npm install`) from root folder
2. `cd ios bundle exec pod install --repo-update` - only for ios

### Developing Andorid

0. if you not install dependencies, check ## Install dependencies
1. open emulator from Android Studio
   1.1 Open Android Studio
   1.2 Open virtual device manager
   1.3 create or statr exist emulator
2. from terminal if app already exist at emulator run `yarn run start` - it will start metro bundle and start project
3. if you doesn't have app at emulator, then run `yarn run android` - it will create debug apk and install it on emulator , then start metro bundle. You can use `npx react-native run-android --variant=release` - to create release apk and install it on emulator
4. after you start project, you can open developer menu by press `d`.
5. if you want open debuger at browser, then just tap on `Debug`, or if you want open it at react-native-debugger, then open react-native-debugger and only then tap on `Debug`.

### Developing IOS

0. if you not install dependencies, check ## Install dependencies
1. Open project at xcode
2. choose emulator iOS device
3. start it (it will create apk and start emulator with app)

### create debug/release apk

0. change versionCode at android/app/build.gradle
1. `cd android`
2. `gradlew assembleDebug`(for debug) or `gradlew assembleRelease`(for release)
   <!-- no need use post-build if source-maps at sentry display errors correctly-->
   <!-- 3. `cd ..`, create source-maps(android) for sentry when upload new version to store `yarn run post-build` (see line 28 at this file - replace at script OS with your system) -->

### create bundle for TF (ios)

1. `cd ios bundle exec pod install --repo-update` - install all dependency, use at root folder of project(you can use terminal or vscode)
2. open project at xcode (from vscode: cd ios, xed .)
3. choose any iOS device
4. up bundle version:

- If current version is already approved in App Store, up version number and set build number to 1
- If current version is not approved in App Store, up build number by 1

5. create archive (Product -> Archive)
6. upload archive (Distribute App), make sure that the last version is active

<!-- ### produce source-map for android and upload it to sentry automaticaly (need done because of Hermes)
1. change line 27 at script scripts/sentry-sourcemaps.sh - replace "win64-bin" with your current system(OS-BIN is osx-bin, win64-bin, or linux64-bin, depending on which operating system you are using.)
2. run script `yarn run post-build` -->

### testing subscription

1. need license testers for google or sanbox testers for ios
2. login at google play with `license testers` or login at appleid with `sanbox tester`
3. test subscriptions: (on ios only at real device).
4. usefull links:
   `https://developer.android.com/google/play/billing/test#subs`
   `https://help.apple.com/app-store-connect/#/dev7e89e149d`
   `https://developer.apple.com/apple-pay/sandbox-testing/`

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for the module..
- `test`: adding or updating tests, eg add integration tests using detox.
- `chore`: tooling changes, e.g. change CI config.

### Scripts

The `package.json` file contains various scripts for common tasks:

- `yarn run android`: setup project for android.
- `yarn run ios`: setup project for ios.
- `yarn run start`: start metro bundle
- `yarn run lint`: lint files with ESLint.
- `yarn run test`: run unit tests with Jest.
- `yarn run post-build`: produce source-maps for android and upload it to sentry
