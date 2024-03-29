#!/bin/bash 

# Make sure we're in the root directory of the React Native project
if [ ! -d "android" ] || [ ! -d "ios" ] || [ ! -f "index.js" ]; then
  echo "Error: this script should be run from the root directory of a React Native project"
  exit 1
fi

# Create the source-maps directory if it doesn't exist
mkdir -p source-maps

# uncomment if need log at file log.out
# exec 3>&1 4>&2
# trap 'exec 2>&4 1>&3' 0 1 2 3
# exec 1>source-maps/log.out 2>&1
# Everything below will go to the file 'log.out':

export NODE_OPTIONS="--max-old-space-size=8192" # Increase to 8 GB to prevent FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory

export SENTRY_ORG=nutritionix-5x
export SENTRY_PROJECT=nutritionix-track-react-native
export SENTRY_TOKEN=ef9f490466ad4540856b447cab0216651d916ae99c54400d80fb9e49c62f6246

RELEASE_NAME_PREFIX=$(cat android/app/build.gradle | grep -o "applicationId \".*" | cut -d " " -f 2 | sed -e "s/\"//g")
RELEASE_NAME=$(cat android/app/build.gradle | grep -o "versionName \".*" | cut -d " " -f 2 | sed -e "s/\"//g")
RELEASE_CODE=$(cat android/app/build.gradle | grep -o -m 1 "versionCode .*" | cut -d " " -f 2)
# DISTRIBUTION_NAME=$(cat android/app/build.gradle | grep -o "versionCode .*" | cut -d " " -f 2)

echo $RELEASE_NAME_PREFIX
echo $RELEASE_NAME
echo $RELEASE_CODE
# echo $DISTRIBUTION_NAME


node_modules/.bin/react-native bundle \
    --dev false \
    --platform android \
    --entry-file index.js \
    --bundle-output ./source-maps/index.android.bundle \
    --sourcemap-output ./source-maps/index.android.bundle-plain.map \
    --minify false

node_modules/react-native/sdks/hermesc/win64-bin/hermesc -O -emit-binary -out ./source-maps/android-release.bundle.hbc ./source-maps/index.android.bundle -output-source-map

if [ ! -f "./source-maps/android-release.bundle.hbc" ]; then
  echo "Error: hermesc command failed to produce android-release.bundle.hbc file"
  exit 1
fi

rm -f ./source-maps/index.android.bundle
mv ./source-maps/android-release.bundle.hbc ./source-maps/index.android.bundle

node node_modules/react-native/scripts/compose-source-maps.js ./source-maps/index.android.bundle-plain.map ./source-maps/android-release.bundle.hbc.map -o ./source-maps/index.android.bundle.map

node_modules/@sentry/cli/bin/sentry-cli --auth-token ${SENTRY_TOKEN} \
    releases \
    files "${RELEASE_NAME_PREFIX}@${RELEASE_NAME}+${RELEASE_CODE}" \
    upload-sourcemaps \
    --dist ${RELEASE_CODE} \
    --bundle-sourcemap ./source-maps/index.android.bundle.map \
    --bundle ./source-maps/index.android.bundle \
    --rewrite

# disable for looking at logs at source-maps/log.out file
rm -rf ./source-maps