yarn 

echo "Applying patch for react-native-webview@12.1.0"
git apply --ignore-whitespace patches/react-native-webview+12.1.0.patch

echo "Applying patch for react-native-vision-camera@2.15.4"
git apply --ignore-whitespace patches/react-native-vision-camera+2.15.4.patch

