// utils
import React, {useLayoutEffect} from 'react';

// components
import WebView from 'react-native-webview';
import {SafeAreaView, TouchableOpacity} from 'react-native';
import BasketButton from 'components/BasketButton';
import {NavigationHeader} from 'components/NavigationHeader';
import Ionicon from 'react-native-vector-icons/Ionicons';

//styles
import {styles} from './WebViewScreen.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {RouteProp} from '@react-navigation/native';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Footer from 'components/Footer';

interface WebViewScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.TrackFoods
  >;
  route: RouteProp<StackNavigatorParamList, Routes.WebView>;
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({route, navigation}) => {
  useLayoutEffect(() => {
    if (route.params.title) {
      navigation.setOptions({
        headerShown: true,
        header: (props: any) => (
          <NavigationHeader
            {...props}
            headerLeft={
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicon name="ios-close" color="#fff" size={40} />
              </TouchableOpacity>
            }
            headerRight={
              <BasketButton
                icon="shopping-basket"
                withCount
                onPress={() => navigation.navigate(Routes.Basket)}
              />
            }
            headerTitle={route.params.title}
          />
        ),
      });
    }
  }, [navigation, route.params.title]);
  return (
    <SafeAreaView style={styles.root}>
      <WebView
        style={styles.webView}
        source={{uri: route.params.url}}
        onMessage={route.params.onMessage}
        onNavigationStateChange={route.params.onNavigationStateChange}
      />
      {route.params.withFooter && (
        <Footer hide={false} navigation={navigation} withMealBuilder />
      )}
    </SafeAreaView>
  );
};

export default WebViewScreen;
