import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {styles} from './NutritionLabel.styles';
import {round} from 'helpers/nutrionixLabel';

type Props = {
  option: Record<string, any>;
};

const HTML = `
  <!-- include the needed font from google api -->
  <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Archivo+Black" />

  <!-- include the nutrition label plugin css file -->
  <link rel="stylesheet" type="text/css" href="http://nutritionix.com/html/label-jquery-plugin/nutritionLabel-min.css">
  
  <!-- include the jquery library from the google cdn -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
  
  <!-- include the nutrition label plugin js file -->
  <script type="text/javascript" src="http://nutritionix.com/html/label-jquery-plugin/nutritionLabel-min.js"></script>

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style> body { padding: 0; margin: 0; } #nutTable > div { margin: 0 auto; } </style>

  <div id="nutTable"></div>
`;

export default function NutritionLabel(props: Props) {
  const {option} = props;

  if (option?.applyMathRounding) {
    [
      'valueServingWeightGrams',
      'valueServingPerContainer',
      'valueCalories',
      'valueFatCalories',
      'valueTotalFat',
      'valueSatFat',
      'valueTransFat',
      'valuePolyFat',
      'valueMonoFat',
      'valueCholesterol',
      'valueSodium',
      'valuePotassium',
      'valueTotalCarb',
      'valueFibers',
      'valueSugars',
      'valueAddedSugars',
      'valueProteins',
      'valueVitaminA',
      'valueVitaminC',
      'valueVitaminD',
      'valueCalcium',
      'valueIron',
    ].forEach(attribute => {
      if (option[attribute]) {
        option[attribute] = round(option[attribute]);
      }
    });
  }

  const height = useSharedValue(100);
  const animatedStyles = useAnimatedStyle(() => ({height: height.value}));

  const webViewRef = useRef<WebView>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [onLoaded, setOnLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (onLoaded && option) {
      setIsLoading(false);

      webViewRef.current?.injectJavaScript(`
        $('#nutTable').empty();

        setTimeout(() => {
          $('#nutTable').nutritionLabel(${JSON.stringify(option)});

          const interval = setInterval(() => {
            try {
              const height = document
                .getElementById('nutTable')
                .getBoundingClientRect()
                .height;
    
              if (height) {
                clearInterval(interval);
                window.ReactNativeWebView.postMessage(height);
              }
            } catch(err) {}
          }, 50);
        });
        true; // note: this is required, or you'll sometimes get silent failures
      `);
    }

    if (!option) {
      setIsLoading(true);
      webViewRef.current?.injectJavaScript(`
      $('#nutTable').empty();
      true; // note: this is required, or you'll sometimes get silent failures
      `);
      height.value = withTiming(100, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [option, onLoaded, height]);

  const onLoadWebView = () => {
    setOnLoaded(true);
  };

  const onMessage = (event: WebViewMessageEvent) => {
    if (event.nativeEvent.data) {
      height.value = withTiming(+event.nativeEvent.data + 3, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  };

  return (
    <Animated.View style={[styles.labelContainer, animatedStyles]}>
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator color={'gray'} />
        </View>
      )}

      <WebView
        ref={webViewRef}
        style={styles.webView}
        source={{html: HTML}}
        onLoad={onLoadWebView}
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled
        allowUniversalAccessFromFileURLs
        androidHardwareAccelerationDisabled
        onMessage={onMessage}
      />
    </Animated.View>
  );
}
