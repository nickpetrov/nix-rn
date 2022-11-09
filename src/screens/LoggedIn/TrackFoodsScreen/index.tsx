// utils
import React, {useState, useLayoutEffect} from 'react';

// components
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import Footer from 'components/Footer';
import Grocery from 'components/TrackFoods/Grocery';
import NaturalForm from 'components/TrackFoods/NaturalForm';
import Restaurants from 'components/TrackFoods/Restaurants/intex';
import History from 'components/TrackFoods/History';
import BasketButton from 'components/BasketButton';
import {NavigationHeader} from 'components/NavigationHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';

// hooks
import {useSelector} from 'hooks/useRedux';

// styles
import {styles} from './TrackFoodsScreen.styles';

// constants
import {Routes} from 'navigation/Routes';

// helpres
import NixHelpers from 'helpers/nixApiDataUtilites/nixApiDataUtilites';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {FoodProps, NutrientProps} from 'store/userLog/userLog.types';

interface TrackFoodsScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.TrackFoods
  >;
}

export const TrackFoodsScreen: React.FC<TrackFoodsScreenProps> = ({
  navigation,
}) => {
  const basketFoods = useSelector(state => state.basket.foods);
  const [activeTab, setActiveTab] = useState('Freeform');
  let totalCalories = 0;
  basketFoods.map((food: FoodProps) => {
    food = {
      ...food,
      ...NixHelpers.convertFullNutrientsToNfAttributes(food?.full_nutrients),
    };

    totalCalories +=
      food.nf_calories ||
      food?.full_nutrients?.filter(
        (item: NutrientProps) => item.attr_id === 208,
      )[0].value;
  });

  const changeActiveTab = (tabName: string) => {
    if (activeTab !== tabName) {
      setActiveTab(tabName);
    }
  };

  const isActiveTab = (tabToCheck: string) => {
    return activeTab === tabToCheck;
  };

  const getHeaderTitle = (tabToCheck: string) => {
    switch (tabToCheck) {
      case 'Restaurants':
        return 'Restaurants';
      case 'Grocery':
        return 'Grocery brands';
      default:
        return null;
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: any) => (
        <NavigationHeader
          {...props}
          headerRight={
            <BasketButton
              icon="shopping-basket"
              withCount
              onPress={() => navigation.navigate(Routes.Basket)}
            />
          }
          headerTitle={getHeaderTitle(activeTab)}
          withAutoComplete={activeTab === 'Freeform' || activeTab === 'History'}
        />
      ),
    });
  }, [navigation, activeTab]);

  return (
    <View style={styles.layout}>
      <View style={styles.container}>
        <View style={styles.tabs}>
          <TouchableWithoutFeedback
            onPress={() => {
              changeActiveTab('Freeform');
            }}>
            <View
              style={{
                ...styles.tab,
                borderBottomWidth: isActiveTab('Freeform') ? 2 : 0,
                opacity: isActiveTab('Freeform') ? 1 : 0.5,
              }}>
              <Text style={styles.tabText}>Freeform</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              changeActiveTab('Restaurants');
            }}>
            <View
              style={{
                ...styles.tab,
                borderBottomWidth: isActiveTab('Restaurants') ? 2 : 0,
                opacity: isActiveTab('Restaurants') ? 1 : 0.5,
              }}>
              <Text style={styles.tabText}>Restaurants</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              changeActiveTab('Grocery');
            }}>
            <View
              style={{
                ...styles.tab,
                borderBottomWidth: isActiveTab('Grocery') ? 2 : 0,
                opacity: isActiveTab('Grocery') ? 1 : 0.5,
              }}>
              <Text style={styles.tabText}>Grocery</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              changeActiveTab('History');
            }}>
            <View
              style={{
                ...styles.tab,
                borderBottomWidth: isActiveTab('History') ? 2 : 0,
                opacity: isActiveTab('History') ? 1 : 0.5,
              }}>
              <Text style={styles.tabText}>History</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {activeTab === 'Freeform' ? (
          <NaturalForm navigation={navigation} />
        ) : activeTab === 'Restaurants' ? (
          <Restaurants navigation={navigation} />
        ) : activeTab === 'Grocery' ? (
          <Grocery navigation={navigation} />
        ) : (
          <History navigation={navigation} />
        )}
      </View>
      {basketFoods.length && (
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate(Routes.Basket)}>
          <View style={styles.mealBuilder}>
            <Text style={styles.mealBuilderTilte}>
              Review{' '}
              <Text style={styles.mealBuilderQty}>{basketFoods.length}</Text>{' '}
              Foods
            </Text>
            <View style={styles.mealBuilderRight}>
              <Text style={styles.mealBuilderQty}>
                {totalCalories.toFixed(0)}
                <Text style={styles.mealBuilderCal}>cal</Text>
              </Text>
              <Ionicons name="chevron-forward" color="#fff" size={30} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
      <Footer hide={false} navigation={navigation} style={styles.footer} />
    </View>
  );
};
