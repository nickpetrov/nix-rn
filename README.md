### Developing

1. `yarn install` (or `npm install`)
2. `cd ios bundle exec pod install --repo-update` - for ios
3. `yarn run android` or `npm run android` - for android
4. `yarn run ios` or `npm run ios` - for ios

### create debug/release apk

0. change versionCode at android/app/build.gradle
1. `cd android`
2. `gradlew assembleDebug` or `gradlew assembleRelease`
   <!-- no need use post-build if source-maps at sentry display errors correctly-->
   <!-- 3. `cd ..`, create source-maps(android) for sentry when upload new version to store `yarn run post-build` (see line 28 at this file - replace at script OS with your system) -->

### create bundle for TF (ios)

1. `cd ios bundle exec pod install --repo-update` - install all dependency
2. choose any iOS device
3. up bundle version:

- If current version is already approved in App Store, up version number and set build number to 1
- If current version is not approved in App Store, up build number by 1

4. create archive (Product -> Archive)
5. upload archive (Distribute App), make sure that the last version is active

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
