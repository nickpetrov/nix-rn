// utils
import React from 'react';

// components
import {Dimensions, Text, View} from 'react-native';
import BasketButton from 'components/BasketButton';

// hooks
// import {useSelector} from 'hooks/useRedux';

// constant
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Header} from 'components/Header';

interface DashboardScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  navigation,
}) => {
  // const userData = useSelector(state => state.auth.userData);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackButtonMenuEnabled: false,
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
          icon="shopping-basket"
          onPress={() => navigation.navigate(Routes.Basket)}
        />
      ),
    });
  }, [navigation]);

  return (
    <View>
      <Text>Dashboard Screen</Text>
    </View>
  );
};
