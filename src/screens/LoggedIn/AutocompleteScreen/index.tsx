// utils
import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment-timezone';

// components
import {View, Text, FlatList, TouchableWithoutFeedback} from 'react-native';
import BasketButton from 'components/BasketButton';
import MealListItem from 'components/FoodLog//MealListItem';
import ConsolidatedSearchResults from 'components/ConsolidatedSearchResults';
import {NavigationHeader} from 'components/NavigationHeader';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// actions
import * as basketActions from 'store/basket/basket.actions';
import * as autocompleteActions from 'store/autoComplete/autoComplete.actions';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FoodProps} from 'store/userLog/userLog.types';
import {RouteProp} from '@react-navigation/native';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './AutocompleteScreen.styles';

interface AutocompleteScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Autocomplete
  >;
  route: RouteProp<StackNavigatorParamList, Routes.Autocomplete>;
}

export const AutocompleteScreen: React.FC<AutocompleteScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const {selectedDate} = useSelector(state => state.userLog);
  const [suggestedTime, setSuggestedTime] = useState('');
  const [currentTab, setCurrentTab] = useState('all');

  const tabItemsListRef = useRef<FlatList<any>>(null);

  const autocompleteFoods = useSelector(state => state.autoComplete);

  useEffect(() => {
    setSuggestedTime(moment().format('h:00 A'));
    dispatch(autocompleteActions.showSuggestedFoods(-1));

    return () => {
      dispatch(autocompleteActions.clear());
    };
  }, [dispatch, setSuggestedTime]);

  React.useLayoutEffect(() => {
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
        />
      ),
    });
  }, [navigation]);

  const changeActiveTab = (tabName: string) => {
    setCurrentTab(tabName);
    if (!!tabItemsListRef.current) {
      tabItemsListRef.current?.scrollToOffset({offset: 0, animated: false});
    }
  };

  const addItemToBasket = async (item: FoodProps) => {
    dispatch(basketActions.addFoodToBasket(item.food_name)).then(() => {
      dispatch(
        basketActions.mergeBasket(
          route.params?.mealType
            ? {
                consumed_at: selectedDate,
                meal_type: route.params?.mealType,
              }
            : {
                consumed_at: selectedDate,
              },
        ),
      );
      navigation.replace(Routes.Basket);
    });
  };

  const getActiveTabColor = (tabToCheck: string) => {
    return currentTab === tabToCheck ? '#fff' : '#eee';
  };

  return (
    <View style={styles.root}>
      {autocompleteFoods.self.length ||
      autocompleteFoods.common.length ||
      autocompleteFoods.branded.length ? (
        <View>
          <View style={styles.main}>
            <TouchableWithoutFeedback onPress={() => changeActiveTab('all')}>
              <View
                style={{
                  ...styles.tab,
                  marginLeft: 4,
                  backgroundColor: getActiveTabColor('all'),
                }}>
                <Text>All</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => changeActiveTab('history')}>
              <View
                style={{
                  ...styles.tab,
                  backgroundColor: getActiveTabColor('history'),
                }}>
                <Text>Your foods</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => changeActiveTab('common')}>
              <View
                style={{
                  ...styles.tab,
                  backgroundColor: getActiveTabColor('common'),
                }}>
                <Text>Common</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => changeActiveTab('branded')}>
              <View
                style={{
                  ...styles.tab,
                  backgroundColor: getActiveTabColor('branded'),
                }}>
                <Text>Branded</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          {currentTab === 'all' ? (
            <ConsolidatedSearchResults
              foods={autocompleteFoods}
              onTap={addItemToBasket}
            />
          ) : currentTab === 'history' && !autocompleteFoods.self.length ? (
            <Text>No foods found</Text>
          ) : currentTab === 'common' && !autocompleteFoods.common.length ? (
            <Text>No foods found</Text>
          ) : currentTab === 'branded' && !autocompleteFoods.branded.length ? (
            <Text>No foods found</Text>
          ) : (
            <FlatList
              ref={tabItemsListRef}
              data={
                currentTab === 'history'
                  ? autocompleteFoods.self
                  : currentTab === 'common'
                  ? autocompleteFoods.common
                  : autocompleteFoods.branded
              }
              keyExtractor={item => item.food_name}
              renderItem={({item}) => (
                <MealListItem
                  foodObj={item}
                  onTap={() => addItemToBasket(item)}
                />
              )}
            />
          )}
        </View>
      ) : autocompleteFoods.suggested.length ? (
        <View>
          <Text style={styles.footerText}>
            Foods Eaten Around {suggestedTime}
          </Text>
          <FlatList
            data={autocompleteFoods.suggested}
            keyExtractor={item => item.food_name}
            renderItem={({item}) => (
              <MealListItem
                foodObj={item}
                onTap={() => addItemToBasket(item)}
              />
            )}
          />
        </View>
      ) : (
        <Text style={styles.note}>
          no foods found yet. Please check your search query.
        </Text>
      )}
    </View>
  );
};
