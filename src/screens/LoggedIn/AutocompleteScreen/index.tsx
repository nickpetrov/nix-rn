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
import ChooseModal from 'components/ChooseModal';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';
import {useNetInfo} from '@react-native-community/netinfo';

// api service
import autoCompleteService from 'api/autoCompleteService';

// actions
import * as basketActions from 'store/basket/basket.actions';
import * as autocompleteActions from 'store/autoComplete/autoComplete.actions';
import {setInfoMessage} from 'store/base/base.actions';
import {getRecipes} from 'store/recipes/recipes.actions';
import {getCustomFoods} from 'store/customFoods/customFoods.actions';
import {updateSearchResults} from 'store/autoComplete/autoComplete.actions';

// types
import {
  NativeStackHeaderProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {FoodProps, MeasureProps} from 'store/userLog/userLog.types';
import {RouteProp, useIsFocused} from '@react-navigation/native';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {searchSections} from 'store/autoComplete/autoComplete.types';
import {RecipeProps} from 'store/recipes/recipes.types';

// constants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './AutocompleteScreen.styles';
import {NixButton} from 'components/NixButton';
import {guessMealTypeByTime} from 'helpers/foodLogHelpers';
import {analyticTrackEvent} from 'helpers/analytics.ts';

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
  const IsFocused = useIsFocused();
  const basketFoods = useSelector(state => state.basket.foods);
  const emptyBasket = basketFoods.length === 0;
  const customFoods = useSelector(state => state.customFoods.foods);
  const recipes = useSelector(state => state.recipes.recipes);
  const searchValue = useSelector(state => state.autoComplete.searchValue);
  const [searchQuery] = useDebounce(searchValue.trim(), 500);
  const {selectedDate} = useSelector(state => state.userLog);
  const [suggestedTime, setSuggestedTime] = useState('');
  const [currentTab, setCurrentTab] = useState(searchSections.ALL);
  const autocompleteFoods = useSelector(state => state.autoComplete);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showBasketIsNotEmpty, setShowBasketIsNotEmpty] = useState<
    RecipeProps | false
  >(false);
  const [autocompleteView, setAutocompleteView] = useState({
    commonLimit: 3,
    brandedLimit: 5,
    additionToLimit: 0,
  });

  const sections = useMemo(() => {
    // add HISTORY section
    let arr: {data: any; key: searchSections}[] = [
      {key: searchSections.HISTORY, data: autocompleteFoods.self},
    ];

    // add Freeform section
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
    // add your foods section
    if (searchQuery && customFoods.length) {
      arr.push({
        key: searchSections.YOUR_FOODS,
        data: customFoods
          .filter(item =>
            item.food_name?.includes(searchQuery.toLocaleLowerCase()),
          )
          .slice(0, 3 + autocompleteView.additionToLimit / 2),
      });
    }

    // add your recipe section without section header (will be under your foods)
    if (searchQuery && recipes.length) {
      arr.push({
        key: searchSections.RECIPES,
        data: recipes
          .filter(item => item.name?.includes(searchQuery.toLocaleLowerCase()))
          .slice(0, 3 + autocompleteView.additionToLimit / 2),
      });
    }

    // add your common and branded section
    arr = arr.concat([
      {
        key: searchSections.COMMON,
        data: autocompleteFoods.common.slice(
          0,
          autocompleteView.commonLimit + autocompleteView.additionToLimit,
        ),
      },
      {
        key: searchSections.BRANDED,
        data: autocompleteFoods.branded.slice(
          0,
          autocompleteView.brandedLimit + autocompleteView.additionToLimit,
        ),
      },
    ]);

    // filter by tab
    if (currentTab === searchSections.YOUR_FOODS) {
      arr = arr.filter(
        item =>
          item.key === currentTab ||
          item.key === searchSections.HISTORY ||
          item.key === searchSections.RECIPES,
      );
    } else if (currentTab !== searchSections.ALL) {
      arr = arr.filter(item => item.key === currentTab);
    }

    // addutional clear empty sections
    arr = arr.filter(item => item.data.length);

    return arr;
  }, [
    autocompleteFoods.self,
    autocompleteFoods.common,
    autocompleteFoods.branded,
    currentTab,
    searchQuery,
    customFoods,
    recipes,
    autocompleteView,
  ]);
  const suggestedSection = [
    {key: searchSections.SUGGESTED, data: autocompleteFoods.suggested},
  ];

  useEffect(() => {
    if (searchQuery) {
      setSearchLoading(true);
      dispatch(updateSearchResults(searchQuery))
        .then(() => {
          setSearchLoading(false);
        })
        .catch(() => {
          setSearchLoading(false);
        });
    }
  }, [searchQuery, dispatch]);

  useEffect(() => {
    const min = moment().get('minute');
    if (min > 30) {
      setSuggestedTime(moment().add(1, 'hour').format('hA'));
    } else {
      setSuggestedTime(moment().format('h A'));
    }
    setLoading(true);

    // get suggested foods
    dispatch(autocompleteActions.showSuggestedFoods(-1))
      .then(() => setLoading(false))
      .catch(err => {
        // somethime return error with to large data response
        console.log(err);
        setLoading(false);
      });

    // ger custom foods
    dispatch(getCustomFoods()).catch(err => console.log(err));

    //get recipes
    dispatch(getRecipes({newLimit: 300})).catch(err => console.log(err));

    return () => {
      dispatch(autocompleteActions.clear());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!IsFocused) {
      dispatch(autocompleteActions.setSearchValue(''));
    }
  }, [IsFocused, dispatch]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <NavigationHeader
          {...props}
          withAutoComplete
          headerRight={
            <BasketButton
              icon="shopping-basket"
              withCount
              onPress={() => navigation.navigate(Routes.Basket)}
            />
          }
          navigation={navigation}
        />
      ),
    });
  }, [navigation]);

  const changeActiveTab = (tabName: searchSections) => {
    setCurrentTab(tabName);
    if (tabName === searchSections.COMMON) {
      setAutocompleteView({
        brandedLimit: 0,
        additionToLimit: 0,
        commonLimit: 10,
      });
    } else if (tabName === searchSections.BRANDED) {
      setAutocompleteView({
        commonLimit: 0,
        additionToLimit: 0,
        brandedLimit: 10,
      });
    } else if (tabName === searchSections.YOUR_FOODS) {
      setAutocompleteView({
        commonLimit: 0,
        additionToLimit: 0,
        brandedLimit: 0,
      });
    } else {
      setAutocompleteView({
        additionToLimit: 0,
        commonLimit: 3,
        brandedLimit: 5,
      });
    }
  };

  const callBackAfterAddFoodToBasket = () => {
    dispatch(
      basketActions.mergeBasket({
        consumed_at: selectedDate,
        meal_type: route.params?.mealType
          ? route.params?.mealType
          : emptyBasket
          ? guessMealTypeByTime(moment().hours())
          : undefined,
      }),
    );
    navigation.replace(Routes.Basket);
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
    dispatch(basketActions.addExistFoodToBasket([item])).then(
      callBackAfterAddFoodToBasket,
    );
  };

  const handleAddCommonFood = (item_name: string, is_freeform: boolean) => {
    // log user interaction with autocomplete for analytics purpose
    if (!is_freeform) {
      autoCompleteService.logAutocompleteStats(item_name, 1, item_name);
    }
    dispatch(basketActions.addFoodToBasket(item_name))
      .then(callBackAfterAddFoodToBasket)
      .then(() => {
        const naturalEvent = is_freeform
          ? 'natural_freeform'
          : 'natural_common';
        analyticTrackEvent(naturalEvent, item_name);
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
      .then(callBackAfterAddFoodToBasket)
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
    dispatch(basketActions.addCustomFoodToBasket([food])).then(
      callBackAfterAddFoodToBasket,
    );
  };

  const addRecipeToBasket = (id: string) => {
    dispatch(basketActions.addRecipeToBasket(id))
      .then((scaled_recipe: RecipeProps) => {
        dispatch(
          basketActions.mergeBasket({
            consumed_at: selectedDate,
            meal_type: route.params?.mealType
              ? route.params?.mealType
              : emptyBasket
              ? guessMealTypeByTime(moment().hours())
              : undefined,
            recipeBrand: scaled_recipe.brand_name,
            servings: scaled_recipe.serving_qty.toString(),
            recipeName: scaled_recipe.name,
          }),
        );
        navigation.replace(Routes.Basket);
      })
      .catch(err => console.log(err));
  };

  const tryAddRecipeToBasket = (recipe: RecipeProps) => {
    if (!basketFoods.length) {
      addRecipeToBasket(recipe.id);
    } else {
      setShowBasketIsNotEmpty(recipe);
    }
  };

  const addBrandedFoodToBasket = (id: string) => {
    autoCompleteService.logAutocompleteStats(searchQuery, 8, id);
    dispatch(basketActions.addBrandedFoodToBasket(id)).then(
      callBackAfterAddFoodToBasket,
    );
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

  const showMore = () => {
    const filteredCustomFoods = sections.find(
      item => item.key === searchSections.SELF,
    )?.data;
    const filteredRecipes = sections.find(
      item => item.key === searchSections.RECIPES,
    )?.data;
    if (
      !autocompleteView.additionToLimit &&
      currentTab !== searchSections.ALL &&
      ((currentTab === searchSections.YOUR_FOODS &&
        filteredCustomFoods?.length + filteredRecipes?.length > 6) ||
        (currentTab === searchSections.COMMON &&
          autocompleteFoods.common.length > autocompleteView.commonLimit) ||
        (currentTab === searchSections.BRANDED &&
          autocompleteFoods.branded.length > autocompleteView.commonLimit))
    ) {
      setAutocompleteView(prev => ({...prev, additionToLimit: 10}));
    } else if (
      autocompleteFoods.branded.length &&
      autocompleteView.brandedLimit + autocompleteView.additionToLimit < 20 &&
      currentTab === searchSections.ALL
    ) {
      setAutocompleteView(prev => ({
        ...prev,
        brandedLimit: 20,
      }));
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
              {!suggestedSection[0].data.length && !searchQuery && (
                <View style={styles.showHint}>
                  <FontAwesome name="arrow-up" color="#aaa" size={20} />
                  <Text style={styles.showHintText}>
                    Use the search box above to search for foods to add to your
                    log.
                  </Text>
                </View>
              )}
              <View style={styles.tabs}>
                {searchQuery &&
                  Object.values(searchSections)
                    .filter(
                      item =>
                        item !== searchSections.HISTORY &&
                        item !== searchSections.SUGGESTED &&
                        item !== searchSections.FREEFORM &&
                        item !== searchSections.SELF &&
                        item !== searchSections.RECIPES,
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
                            <Text>{getTabText(item as searchSections)}</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      );
                    })}
              </View>
              <View style={[!!searchQuery && styles.emptySpaceForTabs]}>
                <SectionList
                  listKey="rootFoodList"
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                  sections={
                    searchQuery.length > 0 ? sections : suggestedSection
                  }
                  keyExtractor={(item: any, index: number) =>
                    `${index} - ${item.id || item.tag_id || item.nix_item_id}`
                  }
                  renderSectionHeader={({section}) => {
                    if (
                      section.key === searchSections.RECIPES &&
                      !sections.find(
                        item => item.key === searchSections.YOUR_FOODS,
                      )
                    ) {
                      return (
                        <Text style={styles.sectionTitle}>YOUR FOODS</Text>
                      );
                    } else if (section.key === searchSections.RECIPES) {
                      return null;
                    }
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
                      return (
                        <Text style={styles.noMatch}>
                          No matching food found
                        </Text>
                      );
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
                          searchValue={searchQuery}
                        />
                      );
                    } else if (section.key === searchSections.COMMON) {
                      return (
                        <CommonFoodItem
                          image={item.photo.thumb}
                          name={item.food_name}
                          onTap={() =>
                            handleAddCommonFood(item.food_name, false)
                          }
                          searchValue={searchQuery}
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
                            } else if (
                              section.key === searchSections.SUGGESTED
                            ) {
                              addSuggestedFood(item);
                            } else if (section.key === searchSections.RECIPES) {
                              tryAddRecipeToBasket(item);
                            } else if (section.key === searchSections.BRANDED) {
                              addBrandedFoodToBasket(item.nix_item_id);
                            }
                          }}
                          smallImage
                          withCal
                          withoutPhotoUploadIcon
                          recipe={section.key === searchSections.RECIPES}
                          searchValue={searchQuery}
                        />
                      );
                    }
                  }}
                  ListFooterComponent={() => {
                    const filteredBrandedFoods = sections.find(
                      item => item.key === searchSections.BRANDED,
                    )?.data;
                    const filteredCustomFoods = sections.find(
                      item => item.key === searchSections.SELF,
                    )?.data;
                    const filteredRecipes = sections.find(
                      item => item.key === searchSections.RECIPES,
                    )?.data;
                    return (
                      <>
                        {sections.length === 0 && !loading && !!searchQuery && (
                          <Text style={styles.noMatch}>
                            No matching food found
                          </Text>
                        )}

                        {searchQuery &&
                        ((!autocompleteView.additionToLimit &&
                          currentTab !== searchSections.ALL &&
                          ((currentTab === searchSections.YOUR_FOODS &&
                            filteredCustomFoods?.length +
                              filteredRecipes?.length >
                              6) ||
                            (currentTab === searchSections.COMMON &&
                              autocompleteFoods.common.length >
                                autocompleteView.commonLimit) ||
                            (currentTab === searchSections.BRANDED &&
                              autocompleteFoods.branded.length >
                                autocompleteView.commonLimit))) ||
                          (autocompleteFoods.branded.length &&
                            autocompleteView.brandedLimit +
                              autocompleteView.additionToLimit <
                              20 &&
                            currentTab === searchSections.ALL &&
                            filteredBrandedFoods?.length < 20)) ? (
                          <TouchableWithoutFeedback onPress={showMore}>
                            <View style={styles.showMore}>
                              <Text style={styles.showMoreText}>
                                Show More Results
                              </Text>
                              <FontAwesome
                                style={styles.showMoreIcon}
                                name="angle-down"
                              />
                            </View>
                          </TouchableWithoutFeedback>
                        ) : null}
                        {currentTab === searchSections.ALL &&
                        searchQuery &&
                        !sections.some(
                          item => item.key === searchSections.FREEFORM,
                        ) ? (
                          <>
                            <Text style={styles.sectionTitle}>FREEFORM</Text>
                            <CommonFoodItem
                              text={searchQuery}
                              onTap={() =>
                                handleAddCommonFood(searchQuery, true)
                              }
                              searchValue={searchQuery}
                            />
                          </>
                        ) : null}
                        <View style={styles.footer}>
                          <NixButton
                            onPress={() =>
                              navigation.navigate(Routes.TrackFoods)
                            }
                            title="Browse All Foods"
                            type="primary"
                            style={{marginBottom: 10}}
                          />
                          <NixButton
                            onPress={() =>
                              navigation.navigate(Routes.CustomFoodEdit, {
                                logAfterSubmit: true,
                                mealType: route.params?.mealType,
                              })
                            }
                            title="Create custom food"
                            type="primary"
                          />
                        </View>
                      </>
                    );
                  }}
                />
              </View>
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
      <ChooseModal
        modalVisible={!!showBasketIsNotEmpty}
        hideModal={() => setShowBasketIsNotEmpty(false)}
        title="Warning"
        subtitle="The basket is not empty"
        text="To log a recipe the basket needs to be empty. Tap OK to clear the basket and add this recipe."
        btns={[
          {
            type: 'gray',
            title: 'Cancel',
            onPress: () => {
              setShowBasketIsNotEmpty(false);
            },
          },
          {
            type: 'primary',
            title: 'Yes',
            onPress: () => {
              dispatch(basketActions.reset()).then(() => {
                if (showBasketIsNotEmpty) {
                  addRecipeToBasket(showBasketIsNotEmpty.id);
                }
                setShowBasketIsNotEmpty(false);
              });
            },
          },
        ]}
      />
    </View>
  );
};
