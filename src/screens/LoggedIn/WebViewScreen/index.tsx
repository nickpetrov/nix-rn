// utils
import React from 'react';

// components
import WebView from 'react-native-webview';
import {SafeAreaView} from 'react-native';

//styles
import {styles} from './WebViewScreen.styles';

// types
import {RouteProp} from '@react-navigation/native';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {Routes} from 'navigation/Routes';

interface WebViewScreenProps {
  route: RouteProp<StackNavigatorParamList, Routes.WebView>;
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({route}) => {
  return (
    <SafeAreaView style={styles.root}>
      <WebView style={styles.webView} source={{uri: route.params.url}} />
    </SafeAreaView>
  );
};

export default WebViewScreen;
