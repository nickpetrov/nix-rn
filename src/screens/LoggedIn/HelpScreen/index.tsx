// utils
import React, {useCallback, useEffect, useState} from 'react';

// components
import {View, Text, TouchableWithoutFeedback, SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';

// styles
import {styles} from './HelpScreen.styles';

interface HelpScreenProps {}

export const HelpScreen: React.FC<HelpScreenProps> = () => {
  const [showWebView, setShowWebView] = useState(false);
  const [webViewUri, setWebViewUri] = useState('');

  const showWalkthrough = useCallback(() => {
    console.log('walkthrough unavailable');
  }, []);

  useEffect(() => {
    if (webViewUri.length) {
      setShowWebView(true);
    } else {
      setShowWebView(false);
    }
  }, [webViewUri]);

  return (
    <SafeAreaView style={styles.root}>
      {!showWebView ? (
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={() => {
              showWalkthrough();
            }}>
            <View style={styles.menuItem}>
              <Text>Walkthrough (temporary unavailable)</Text>
              {/*TODO - create walkthrough*/}
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setWebViewUri('https://nutritionix.helpsite.com/');
            }}>
            <View style={styles.menuItem}>
              <Text>FAQ</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.terms}>
            <TouchableWithoutFeedback
              onPress={() => {
                setWebViewUri('https://www.nutritionix.com/terms');
              }}>
              <Text style={styles.text}>Terms and Conditions</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                setWebViewUri('https://www.nutritionix.com/privacy');
              }}>
              <Text style={styles.text}>Privacy Policy</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={() => setWebViewUri('')}>
            <View style={styles.close}>
              <Text>X</Text>
            </View>
          </TouchableWithoutFeedback>
          <WebView
            // onMessage={data => handleMessageFromWebView(data)}
            style={{width: '100%'}}
            source={{uri: webViewUri}}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
