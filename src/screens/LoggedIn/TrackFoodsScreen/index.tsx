// utils
import React, {useLayoutEffect, useEffect} from 'react';

// components
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import Footer from 'components/Footer';
import Grocery from 'components/TrackFoods/Grocery';
import NaturalForm from 'components/TrackFoods/NaturalForm';
import Restaurants from 'components/TrackFoods/Restaurants/intex';
import History from 'components/TrackFoods/History';
import BasketButton from 'components/BasketButton';
import {NavigationHeader} from 'components/NavigationHeader';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// actions
import {setTrackTab, setSelectedRestaurant} from 'store/foods/foods.actions';
import {setWalkthroughTooltip} from 'store/walkthrough/walkthrough.actions';

// styles
import {styles} from './TrackFoodsScreen.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {
  NativeStackHeaderProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {TrackTabs} from 'store/foods/foods.types';
import {analyticSetUserId} from 'helpers/analytics.ts';
import TooltipView from 'components/TooltipView';

interface TrackFoodsScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.TrackFoods
  >;
}

export const TrackFoodsScreen: React.FC<TrackFoodsScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const firstEnterInTrackTab = useSelector(
    state => state.walkthrough.checkedEvents.firstEnterInTrackTab,
  );
  const userId = useSelector(state => state.auth.userData.id);
  const {currentTrackTab: activeTab, selectedRestaurant} = useSelector(
    state => state.foods,
  );
  const changeActiveTab = (tabName: TrackTabs) => {
    if (activeTab !== tabName) {
      dispatch(setTrackTab(tabName));
    }
    dispatch(setSelectedRestaurant(null));
  };

  const isActiveTab = (tabToCheck: string) => {
    return activeTab === tabToCheck;
  };

  const getHeaderTitle = (tabToCheck: string) => {
    switch (tabToCheck) {
      case TrackTabs.RESTAURANTS:
        return 'Restaurants';
      case TrackTabs.GROCERY:
        return 'Grocery brands';
      default:
        return undefined;
    }
  };

  useEffect(() => {
    analyticSetUserId(userId);
    return () => {
      dispatch(setTrackTab(TrackTabs.FREEFORM));
    };
  }, [dispatch, userId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <NavigationHeader
          {...props}
          navigation={navigation}
          headerRight={
            <BasketButton
              icon="shopping-basket"
              withCount
              onPress={() => navigation.navigate(Routes.Basket)}
            />
          }
          headerTitle={getHeaderTitle(activeTab)}
          withAutoComplete={
            activeTab === TrackTabs.FREEFORM || activeTab === TrackTabs.HISTORY
          }
          withoutTitle={
            activeTab === TrackTabs.RESTAURANTS && !!selectedRestaurant
          }>
          {activeTab === TrackTabs.RESTAURANTS && !!selectedRestaurant && (
            <View style={styles.inputContainer} />
          )}
        </NavigationHeader>
      ),
    });
  }, [navigation, activeTab, selectedRestaurant]);

  useEffect(() => {
    if (!firstEnterInTrackTab.value) {
      setTimeout(() => {
        dispatch(setWalkthroughTooltip('firstEnterInTrackTab', 0));
      }, 2000);
    }
  }, [firstEnterInTrackTab, dispatch]);

  return (
    <View style={styles.layout}>
      <View style={styles.container}>
        <TooltipView eventName="firstEnterInTrackTab" step={1}>
          <View style={styles.tabs}>
            {Object.values(TrackTabs).map(item => (
              <TouchableWithoutFeedback
                key={item}
                onPress={() => {
                  changeActiveTab(item);
                }}>
                <View
                  style={{
                    ...styles.tab,
                    borderBottomWidth: isActiveTab(item) ? 2 : 0,
                    opacity: isActiveTab(item) ? 1 : 0.5,
                  }}>
                  <Text style={styles.tabText}>{item}</Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </TooltipView>
        {activeTab === TrackTabs.FREEFORM ? (
          <NaturalForm navigation={navigation} />
        ) : activeTab === TrackTabs.RESTAURANTS ? (
          <Restaurants navigation={navigation} />
        ) : activeTab === TrackTabs.GROCERY ? (
          <Grocery navigation={navigation} />
        ) : (
          <History navigation={navigation} />
        )}
      </View>
      <Footer
        hide={false}
        navigation={navigation}
        style={styles.footer}
        withMealBuilder
      />
    </View>
  );
};
