### Developing

1. `yarn install` (or `npm install`)
2. `cd ios bundle exec pod install --repo-update` - for ios
3. `yarn run android` or `npm run android` - for android
4. `yarn run ios` or `npm run ios` - for ios

### create debug/release apk

1. `cd android`
2. `gradlew assembleDebug` or `gradlew assembleRelease`

### create bundle for TF (ios)

1. `cd ios bundle exec pod install --repo-update` - install all dependency
2. choose any iOS device
3. up bundle version:

- If current version is already approved in App Store, up version number and set build number to 1
- If current version is not approved in App Store, up build number by 1

4. create archive (Product -> Archive)
5. upload archive (Distribute App), make sure that the last version is active

### produce source-map for sentry

for ios:

1. `npx react-native bundle --platform ios --dev false --entry-file index.js --reset-cache --bundle-output main.jsbundle --sourcemap-output main.jsbundle.map --minify false`

for android

1. `npx react-native bundle --platform android --dev false --entry-file index.js --reset-cache --bundle-output index.android.bundle --sourcemap-output index.android.bundle.packager.map --minify false`
2. `npx node_modules/react-native/sdks/hermesc/{OS-BIN}/hermesc -O -emit-binary -output-source-map -out=index.android.bundle.hbc index.android.bundle` - OS-BIN is osx-bin, win64-bin, or linux64-bin, depending on which operating system you are using.
   2.1 `rm -f index.android.bundle`
   2.2 `mv index.android.bundle.hbc index.android.bundle`
3. `npx node node_modules/react-native/scripts/compose-source-maps.js index.android.bundle.packager.map index.android.bundle.hbc.map -o index.android.bundle.map`

### upload source-map for sentry

1. `npx sentry-cli releases new <release_name>` - release_name - example: com.nutritionx-1.0 (can find at App.tsx where sentry init - release: getBundleId() + '-' + getVersion(),)
2. `npx sentry-cli releases files <release_name> upload-sourcemaps /path/to/files` - example path ./index.android.bundle ./index.android.bundle.map
3. `npx sentry-cli releases finalize <release_name>`

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

- `yarn android`: setup project for android.
- `yarn ios`: setup project for ios.
- `yarn start`: start metro bundle
- `yarn lint`: lint files with ESLint.
- `yarn test`: run unit tests with Jest.
