// utils
import React, {useEffect, useState, useMemo} from 'react';
import moment from 'moment-timezone';
import {useDebounce} from 'use-debounce';

// helpers
import {addGramsToAltMeasures} from 'helpers/nixApiDataUtilites/nixApiDataUtilites';

// components
import {View, Text, TouchableWithoutFeedback, SectionList} from 'react-native';
import BasketButton from 'components/BasketButton';
import MealListItem from 'components/FoodLog//MealListItem';
import {NavigationHeader} from 'components/NavigationHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CommonFoodItem from 'components/CommonFoodItem';
import LoadIndicator from 'components/LoadIndicator';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';
import {useNetInfo} from '@react-native-community/netinfo';

// actions
import * as basketActions from 'store/basket/basket.actions';
import * as autocompleteActions from 'store/autoComplete/autoComplete.actions';
import {setInfoMessage} from 'store/base/base.actions';
import {getRecipes} from 'store/recipes/recipes.actions';
import {getCustomFoods} from 'store/customFoods/customFoods.actions';
import {updateSearchResults} from 'store/autoComplete/autoComplete.actions';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FoodProps, MeasureProps} from 'store/userLog/userLog.types';
import {RouteProp} from '@react-navigation/native';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {searchSections} from 'store/autoComplete/autoComplete.types';

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
  const netInfo = useNetInfo();
  const dispatch = useDispatch();
  const customFoods = useSelector(state => state.customFoods.foods);
  const searchValue = useSelector(state => state.autoComplete.searchValue);
  const [searchQuery] = useDebounce(searchValue, 350);
  const {selectedDate} = useSelector(state => state.userLog);
  const [suggestedTime, setSuggestedTime] = useState('');
  const [currentTab, setCurrentTab] = useState(searchSections.ALL);
  const autocompleteFoods = useSelector(state => state.autoComplete);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const sections = useMemo(() => {
    let arr: {data: any; key: searchSections}[] = [
      {key: searchSections.HISTORY, data: autocompleteFoods.self},
    ];

    if (
      !autocompleteFoods.common?.filter(item => item.food_name).length ||
      searchQuery.includes('and') ||
      searchQuery.includes(' of ') ||
      (!isNaN(+searchQuery.charAt(0)) && searchQuery.charAt(0))
    ) {
      arr.unshift({
        key: searchSections.FREEFORM,
        data: [
          {
            id: searchQuery,
            name: searchQuery,
          },
        ],
      });
    }

    if (searchQuery && customFoods.length) {
      arr.push({
        key: searchSections.YOUR_FOODS,
        data: customFoods.filter(item => item.food_name?.includes(searchQuery)),
      });
    }
    arr = arr.concat([
      {key: searchSections.COMMON, data: autocompleteFoods.common},
      {key: searchSections.BRANDED, data: autocompleteFoods.branded},
    ]);

    if (currentTab !== searchSections.ALL) {
      arr = arr.filter(item => item.key === currentTab);
    }

    return arr;
  }, [
    autocompleteFoods.self,
    autocompleteFoods.common,
    autocompleteFoods.branded,
    currentTab,
    searchQuery,
    customFoods,
  ]);
  const suggestedSection = [
    {key: searchSections.SUGGESTED, data: autocompleteFoods.suggested},
  ];

  useEffect(() => {
    if (searchQuery) {
      setSearchLoading(true);
      dispatch(updateSearchResults(searchQuery)).then(() =>
        setSearchLoading(false),
      );
    }
  }, [searchQuery, dispatch]);

  useEffect(() => {
    setSuggestedTime(moment().format('h:00 A'));
    setLoading(true);

    // get suggested foods
    dispatch(autocompleteActions.showSuggestedFoods(-1)).then(() =>
      setLoading(false),
    );

    // ger custom foods
    dispatch(getCustomFoods());

    //get recipes
    dispatch(getRecipes());

    return () => {
      dispatch(autocompleteActions.clear());
    };
  }, [dispatch]);

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

  const changeActiveTab = (tabName: searchSections) => {
    setCurrentTab(tabName);
  };

  const addSuggestedFood = async (item: Partial<FoodProps>) => {
    if (!item.food_name) {
      return;
    }
    delete item.id;
    delete item.note;
    item.consumed_at = moment().format();
    if (item.alt_measures && item.serving_weight_grams) {
      var temp: MeasureProps = {
        serving_weight: item.serving_weight_grams,
        seq: null,
        measure: item.serving_unit as string,
        qty: item.serving_qty as number,
      };
      item.alt_measures.unshift(temp);
      item = addGramsToAltMeasures(item as FoodProps);
    }
    dispatch(basketActions.addExistFoodToBasket([item])).then(() => {
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

  const handleAddCommonFood = (item_name: string, is_freeform: boolean) => {
    // log user interaction with autocomplete for analytics purpose
    if (!is_freeform) {
      // ApiService.logAutocompleteStats($scope.data.search, 1, item_name);
    }
    dispatch(basketActions.addFoodToBasket(item_name))
      .then(() => {
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
      })
      .catch(err => {
        dispatch(
          setInfoMessage({
            title: `${err.data.message} for:`,
            text: item_name,
          }),
        );
      });
  };

  const addMyFood = (id: string) => {
    dispatch(basketActions.addFoodToBasketById(id))
      .then(() => {
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
      })
      .catch(err => {
        dispatch(
          setInfoMessage({
            title: `${err.data.message} for:`,
            text: id,
          }),
        );
      });
  };

  const addCustomFood = (food: FoodProps) => {
    // todo
  };

  const getActiveTabColor = (tabToCheck: searchSections) => {
    return currentTab === tabToCheck ? '#fff' : '#eee';
  };

  const getTabText = (tabToCheck: searchSections) => {
    switch (tabToCheck) {
      case searchSections.ALL:
        return 'All';
      case searchSections.YOUR_FOODS:
        return 'Your foods';
      case searchSections.COMMON:
        return 'Common';
      case searchSections.BRANDED:
        return 'Branded';
      default:
        return 'All';
    }
  };

  return (
    <View style={styles.root}>
      {netInfo.isConnected ? (
        <>
          {loading ? (
            <LoadIndicator color="green" />
          ) : (
            <>
              {!suggestedSection[0].data.length && (
                <View style={styles.showHint}>
                  <FontAwesome name="arrow-up" color="#aaa" size={20} />
                  <Text style={styles.showHintText}>
                    Use the search box above to search for foods to add to your
                    log.
                  </Text>
                </View>
              )}
              <SectionList
                listKey="rootFoodList"
                sections={searchQuery.length > 0 ? sections : suggestedSection}
                keyExtractor={(item: any, index: number) =>
                  `${index} - ${item.id || item.tag_id || item.nix_item_id}`
                }
                ListHeaderComponent={() => (
                  <>
                    <View style={styles.main}>
                      {searchQuery &&
                        Object.values(searchSections)
                          .filter(
                            item =>
                              item !== searchSections.HISTORY &&
                              item !== searchSections.SUGGESTED &&
                              item !== searchSections.FREEFORM &&
                              item !== searchSections.SELF,
                          )
                          .map(item => {
                            return (
                              <TouchableWithoutFeedback
                                key={item}
                                onPress={() =>
                                  changeActiveTab(item as searchSections)
                                }>
                                <View
                                  style={{
                                    ...styles.tab,
                                    marginLeft: 4,
                                    backgroundColor: getActiveTabColor(
                                      item as searchSections,
                                    ),
                                  }}>
                                  <Text>
                                    {getTabText(item as searchSections)}
                                  </Text>
                                </View>
                              </TouchableWithoutFeedback>
                            );
                          })}
                    </View>
                  </>
                )}
                renderSectionHeader={({section}) => {
                  if (section.data.length) {
                    return (
                      <Text style={styles.sectionTitle}>
                        {section.key === searchSections.SUGGESTED
                          ? `Foods Eaten Around ${suggestedTime}`
                          : section.key}
                      </Text>
                    );
                  } else if (
                    currentTab !== searchSections.ALL &&
                    !searchLoading
                  ) {
                    return <Text>No matching food found</Text>;
                  } else {
                    return null;
                  }
                }}
                renderItem={({item, section}: any) => {
                  if (section.key === searchSections.FREEFORM) {
                    return (
                      <CommonFoodItem
                        text={item.name}
                        onTap={() => handleAddCommonFood(item.name, true)}
                        withArrow
                      />
                    );
                  } else {
                    return (
                      <MealListItem
                        foodObj={item}
                        onTap={() => {
                          if (section.key === searchSections.HISTORY) {
                            addMyFood(item.uuid);
                          } else if (
                            section.key === searchSections.YOUR_FOODS
                          ) {
                            addCustomFood(item);
                          } else if (section.key === searchSections.SUGGESTED) {
                            addSuggestedFood(item);
                          }
                        }}
                        smallImage
                      />
                    );
                  }
                }}
                // renderSectionFooter={({section}) => {
                //   return;
                // }}
              />
            </>
          )}
        </>
      ) : (
        <View style={styles.noNet}>
          <Text style={styles.noNetText}>
            You must connect to the internet to use this feature
          </Text>
        </View>
      )}
    </View>
  );
};
