// utils
import React from 'react';

// components
import BasketButton from 'components/BasketButton';
import {Header} from 'components/Header';
import {Dimensions, Text, View} from 'react-native';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// constants
import {Routes} from 'navigation/Routes';

interface BasketScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export const BasketScreen: React.FC<BasketScreenProps> = ({navigation}) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: undefined,
      headerTitle: (props: {
        children: string;
        tintColor?: string | undefined;
      }) => (
        <View style={{width: Dimensions.get('window').width - 110}}>
          <Header {...props} navigation={navigation} />
        </View>
      ),
      headerRight: () => (
        <BasketButton
          icon="times"
          onPress={() => navigation.navigate(Routes.Basket)}
        />
      ),
    });
  }, [navigation]);
  return (
    <View>
      <Text>Basket Screen</Text>
    </View>
  );
};
