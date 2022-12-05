// utils
import React, {useCallback, useEffect, useState} from 'react';

// components
import {View, Text, TouchableWithoutFeedback, SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
              <View style={styles.icon}>
                <FontAwesome name="mobile" size={30} />
              </View>
              <Text style={styles.menuItemText}>
                Walkthrough (temporary unavailable)
              </Text>
              {/*TODO - create walkthrough*/}
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setWebViewUri('https://nutritionix.helpsite.com/');
            }}>
            <View style={styles.menuItem}>
              <View style={styles.icon}>
                <FontAwesome name="question-circle" size={30} />
              </View>
              <Text style={styles.menuItemText}>FAQ</Text>
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
        <View style={styles.footer}>
          <TouchableWithoutFeedback onPress={() => setWebViewUri('')}>
            <View style={styles.close}>
              <Text>X</Text>
            </View>
          </TouchableWithoutFeedback>
          <WebView
            // onMessage={data => handleMessageFromWebView(data)}
            style={styles.webView}
            source={{uri: webViewUri}}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
