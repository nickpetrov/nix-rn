// utils
import React, {useCallback, useEffect} from 'react';

// components
import {View, Text, FlatList, Linking} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import Footer from 'components/Footer';
import SuggestedProductItem from 'components/SuggestedProductItem';

// styles
import {styles} from './SuggestedScreen.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import {getSuggestedFoods} from 'store/foods/foods.actions';
import {useNetInfo} from '@react-native-community/netinfo';

interface SuggestedScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Suggested
  >;
}

export const SuggestedScreen: React.FC<SuggestedScreenProps> = ({
  navigation,
}) => {
  const netInfo = useNetInfo();
  const dispatch = useDispatch();
  const suggested_foods = useSelector(state => state.foods.suggested_foods);

  useEffect(() => {
    dispatch(getSuggestedFoods());
  }, [dispatch]);

  const handlePress = useCallback(async (url: string) => {
    console.log(url);
    await Linking.openURL(url);
  }, []);

  return (
    <>
      <View style={styles.root}>
        <View style={styles.banner}>
          <View style={styles.imageContainer}>
            <WithLocalSvg
              asset={require('assets/recommended.svg')}
              width="40"
              height="60"
              viewBox="0 0 10 16"
              preserveAspectRatio="none"
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              Our team of registered dietitians scours the web to pick out
              products that could help you stay on track to leading a healthier
              lifestyle.
            </Text>
          </View>
        </View>
        {netInfo.isConnected ? (
          <FlatList
            data={suggested_foods}
            keyExtractor={item => item.id}
            renderItem={product => (
              <SuggestedProductItem
                onPress={() => handlePress(product.item.url)}
                item={product.item}
              />
            )}
            ListFooterComponent={() => (
              <Text style={styles.disclaimer}>
                We hope you enjoy our product recommendations! Nutritionix may
                collect a share of sales or other compensation from the links on
                this page.
              </Text>
            )}
          />
        ) : (
          <Text style={styles.offline}>
            This feature is not available in offline mode.
          </Text>
        )}
      </View>
      <Footer hide={false} navigation={navigation} />
    </>
  );
};
