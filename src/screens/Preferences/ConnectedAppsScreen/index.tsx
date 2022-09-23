// utils
import React from 'react';

// components
import {
  View,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import {SvgUri} from 'react-native-svg';

// constants
import {Routes} from 'navigation/Routes';

//types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// styles
import {styles} from './ConnectedAppsScreen.styles';

const {uri} = Image.resolveAssetSource(require('assets/fitbit.svg'));

interface ConnectedAppsScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.ConnectedApps
  >;
}

export const ConnectedAppsScreen: React.FC<ConnectedAppsScreenProps> = ({
  navigation,
}) => {
  return (
    <SafeAreaView style={styles.root}>
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate(Routes.FitbitSync)}>
        <View style={styles.iconContainer}>
          <SvgUri uri={uri} width="80" height="28" preserveAspectRatio="none" />
        </View>
      </TouchableWithoutFeedback>
      {Platform.OS === 'ios' ? (
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate(Routes.HealthkitSync)}>
          <View style={styles.healthContainer}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require('assets/AppleHealth.png')}
              />
            </View>
            <Text style={styles.text}>Healthkit</Text>
          </View>
        </TouchableWithoutFeedback>
      ) : null}
    </SafeAreaView>
  );
};
