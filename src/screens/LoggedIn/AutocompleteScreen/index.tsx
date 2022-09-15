// utils
import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment-timezone';

// components
import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import BasketButton from 'components/BasketButton';
import MealListItem from 'components/FoodLog//MealListItem';
import ConsolidatedSearchResults from 'components/ConsolidatedSearchResults';
import {Header} from 'components/Header';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// actions
import * as basketActions from 'store/basket/basket.actions';
import * as autocompleteActions from 'store/autoComplete/autoComplete.actions';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AutoCompleteFoodProps} from 'store/autoComplete/autoComplete.types';
import {RouteProp} from '@react-navigation/native';

// constants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './AutocompleteScreen.styles';

interface AutocompleteScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any>;
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
          icon="shopping-basket"
          onPress={() => navigation.navigate(Routes.Basket)}
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

  const addItemToBasket = async (item: AutoCompleteFoodProps) => {
    dispatch(basketActions.addFoodToBasket(item.food_name)).then(() => {
      dispatch(basketActions.changeConsumedAt(selectedDate));

      if (route.params?.mealType) {
        dispatch(basketActions.changeMealType(route.params.mealType));
      }
      navigation.replace('Basket');
    });
  };

  const getActiveTabColor = (tabToCheck: string) => {
    return currentTab === tabToCheck ? '#fff' : '#eee';
  };

  return (
    <View style={{backgroundColor: '#fff'}}>
      {autocompleteFoods.self.length ||
      autocompleteFoods.common.length ||
      autocompleteFoods.branded.length ? (
        <View>
          <View
            style={{flexDirection: 'row', flexWrap: 'nowrap', marginTop: 3}}>
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
          <Text style={{textAlign: 'center', padding: 16, fontSize: 16}}>
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
        <Text style={{textAlign: 'center'}}>
          no foods found yet. Please check your search query.
        </Text>
      )}
    </View>
  );
};
