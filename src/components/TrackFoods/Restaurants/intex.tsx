// utils
import React, {useState, useEffect, useMemo} from 'react';
import {FullOptions, Searcher} from 'fast-fuzzy';
import {batch} from 'react-redux';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';

// components
import {
  View,
  Text,
  TextInput,
  SectionList,
  SectionListData,
  Linking,
} from 'react-native';
import RestaurantItem from './RestaurantItem/intex';
import RestaurantFoods from './RestaurantFoods';
import {NixButton} from 'components/NixButton';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';
import {useDebounce} from 'use-debounce';

// actions
import {
  getRestorants,
  getRestorantsWithCalc,
  setSelectedRestaurant,
} from 'store/foods/foods.actions';
import {setInfoMessage} from 'store/base/base.actions';

// services
import baseService from 'api/baseService';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {
  RestaurantsProps,
  RestaurantsWithCalcProps,
  RestaurantsWithCalcV2Props,
} from 'store/foods/foods.types';

// constants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './Restaurants.styles';
import {Keyboard} from 'react-native';

interface RestaurantsComponentProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.TrackFoods
  >;
}

enum RestorantTypes {
  RESTORANTS = 'restaurants',
  RESTORANTS_WITH_CALC = 'restaurantsWithCalc',
  RESTORANTS_WITH_CALC_V2 = 'restaurantsWithCalcV2',
}

const Restaurants: React.FC<RestaurantsComponentProps> = ({navigation}) => {
  const netInfo = useNetInfo();
  const dispatch = useDispatch();
  const {restaurants, restaurantsWithCalc, selectedRestaurant} = useSelector(state => state.foods);
  const [limit, setLimit] = useState(50);
  const [restaurantQuery, setRestaurantQuery] = useState('');
  const [searchValue] = useDebounce(restaurantQuery, 500);

  const [restaurantsList, setRestaurantsList] = useState<Array<RestaurantsProps>>([]);
  const [restaurantsListWithCalc, setRestaurantsListWithCalc] = useState<Array<RestaurantsWithCalcProps>>([]);
  const [restaurantsListWithCalcV2, setRestaurantsListWithCalcV2] = useState<Array<RestaurantsWithCalcV2Props>>([]);

  const [filteredRestaurantsList, setFilteredRestaurantsList] = useState<Array<RestaurantsProps>>([]);
  const [filteredRestaurantsListWithCalc, setFilteredRestaurantsListWithCalc] = useState<Array<RestaurantsWithCalcProps>>([]);
  const [filteredRestaurantsListWithCalcV2, setFilteredRestaurantsListWithCalcV2] = useState<Array<RestaurantsWithCalcV2Props>>([]);

  const [restaurantSearcher, setRestaurantSearcher] = useState<Searcher<RestaurantsProps, FullOptions<RestaurantsProps>>>();
  const [restaurantWithCalcSearcher, setRestaurantWithCalcSearcher] = useState<Searcher<RestaurantsWithCalcProps, FullOptions<RestaurantsWithCalcProps>>>();
  const [restaurantWithCalcV2Searcher, setRestaurantWithCalcV2Searcher] = useState<Searcher<RestaurantsWithCalcV2Props, FullOptions<RestaurantsWithCalcV2Props>>>();

  const sections = useMemo(() => {
    return [
      {
        key: RestorantTypes.RESTORANTS_WITH_CALC,
        data: filteredRestaurantsListWithCalc.filter(
          item => !!item.mobile_calculator_url,
        ),
      },
      {
        key: RestorantTypes.RESTORANTS_WITH_CALC_V2,
        data: filteredRestaurantsListWithCalcV2.slice(0, limit),
      },
      {
        key: RestorantTypes.RESTORANTS,
        data: filteredRestaurantsList.slice(0, limit),
      },
    ] as readonly SectionListData<
      RestaurantsProps | RestaurantsWithCalcProps,
      {
        key: RestorantTypes;
        data: RestaurantsProps[] | RestaurantsWithCalcProps[] | RestaurantsWithCalcV2Props[];
      }
    >[];
  }, [filteredRestaurantsList, filteredRestaurantsListWithCalc, limit]);

  useEffect(() => {
    batch(() => {
      dispatch(getRestorants());
      dispatch(getRestorantsWithCalc());
      setRestaurantsListWithCalcV2([
        {
          brand_id: '1',
          brand_logo: 'https://d1r9wva3zcpswd.cloudfront.net/5c3e4dce1c9d444e84a567cd.jpg',
          desktop_calculator_url: 'https://restaurant.nutritionix.com/potbelly/landing',
          proper_brand_name: 'Potbelly'
        },
        {
          brand_id: '2',
          brand_logo: 'https://d1r9wva3zcpswd.cloudfront.net/5de6ab061c9d44342bda9c01.jpg',
          desktop_calculator_url: 'https://restaurant.nutritionix.com/pokeworks/landing',
          proper_brand_name: 'Pokeworks',
        }
      ]);
    });
  }, [dispatch]);

  useEffect(() => {
    setRestaurantsList(() => {
      const newArr = restaurants.sort((a, b) => {
        let textA = a.name.toUpperCase();
        let textB = b.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      return newArr;
    });
  }, [restaurants]);

  useEffect(() => {
    setRestaurantsListWithCalc(() => {
      const newArr = restaurantsWithCalc.sort((a, b) => {
        let textA = a.proper_brand_name.toUpperCase();
        let textB = b.proper_brand_name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      return newArr;
    });
  }, [restaurantsWithCalc]);

  // searcher for restaurantsList
  useEffect(() => {
    const filteredList =
      restaurantSearcher && restaurantsList.length && searchValue.length
        ? restaurantSearcher.search(searchValue)
        : restaurantsList;
    setFilteredRestaurantsList(filteredList);
  }, [searchValue, restaurantSearcher, restaurantsList]);

  useEffect(() => {
    // setFilteredRestaurantsList(restaurantsList);
    setRestaurantSearcher(
      new Searcher(restaurantsList, {
        keySelector: obj => obj.name,
        threshold: 1,
      }),
    );
  }, [restaurantsList]);

  // searcher for restaurantsListWithCalc
  useEffect(() => {
    const filteredList =
      restaurantWithCalcSearcher && restaurantsListWithCalc.length && searchValue.length
        ? restaurantWithCalcSearcher.search(searchValue)
        : restaurantsListWithCalc;
    setFilteredRestaurantsListWithCalc(filteredList);
  }, [searchValue, restaurantWithCalcSearcher, restaurantsListWithCalc]);

  useEffect(() => {
    // setFilteredRestaurantsListWithCalc(restaurantsListWithCalc);
    setRestaurantWithCalcSearcher(
      new Searcher(restaurantsListWithCalc, {
        keySelector: obj => obj.proper_brand_name,
        threshold: 1,
      }),
    );
  }, [restaurantsListWithCalc]);

  useEffect(() => {
    const filteredList =
      restaurantWithCalcV2Searcher && restaurantsListWithCalcV2.length && searchValue.length
        ? restaurantWithCalcV2Searcher.search(searchValue)
        : restaurantsListWithCalcV2;
    setFilteredRestaurantsListWithCalcV2(filteredList);
  }, [searchValue, restaurantWithCalcV2Searcher, restaurantsListWithCalcV2]);

  useEffect(() => {
    setRestaurantWithCalcV2Searcher(
      new Searcher(restaurantsListWithCalcV2, {
        keySelector: obj => obj.proper_brand_name,
        threshold: 1,
      }),
    );
  }, [restaurantsListWithCalcV2]);

  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected == false) {
        dispatch(
          setInfoMessage({
            title: 'This feature is not available in offline mode',
            btnText: 'Ok',
          }),
        );
      }
    });
  }, [dispatch, netInfo]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        console.log('beforeRemove', e);
        if (!selectedRestaurant || e.data.action.type !== 'GO_BACK') {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        // Prompt the user before leaving the screen
        dispatch(setSelectedRestaurant(null));
      }),
    [navigation, selectedRestaurant, dispatch],
  );

  const showRestaurant = (
    restaurant: RestaurantsProps | RestaurantsWithCalcProps,
  ) => {
    if (!netInfo.isConnected) {
      dispatch(
        setInfoMessage({
          title: 'This feature is not available in offline mode',
          btnText: 'Ok',
        }),
      );
      return;
    }
    dispatch(setSelectedRestaurant(restaurant));
  };

  const showRestaurantV2 = (restaurant: RestaurantsWithCalcV2Props) => {
    if (!netInfo.isConnected) {
      dispatch(
        setInfoMessage({
          title: 'This feature is not available in offline mode',
          btnText: 'Ok',
        }),
      );
      return;
    }
    if (restaurant.desktop_calculator_url) {
      navigation.navigate(Routes.WebView, {
        title: restaurant.proper_brand_name,
        close: true,
        withFooter: true,
        url: restaurant.desktop_calculator_url,
      })
    }
    return;
  }

  const requestRestaurant = () => {
    const bugReportData = {
      feedback: `Request missing restaurant. Restaurant name: ${searchValue}.`,
      type: 2,
    };
    baseService
      .sendBugReport(bugReportData)
      .then(() => {
        setRestaurantQuery('');
        dispatch(
          setInfoMessage({
            title: 'Thank you!',
            text: 'Your feedback has been queued up with our registered dietitian team, and will be reviewed shortly.',
          }),
        );
      })
      .catch(() => {
        dispatch(
          setInfoMessage({
            title: 'Error',
            child: (
              <Text>
                'There was an error with your submission, please email us at{' '}
                <Text
                  style={styles.link}
                  onPress={() =>
                    Linking.openURL('mailto:support@nutritionix.com')
                  }>
                  support@nutritionix.com
                </Text>{' '}
                to report this problem.'
              </Text>
            ),
          }),
        );
      });
  };

  return (
    <View style={styles.root}>
      {!selectedRestaurant ? (
        <View>
          <View style={styles.container}>
            <TextInput
              placeholder={'Search All Restaurans'}
              style={styles.input}
              value={restaurantQuery}
              onChangeText={text => setRestaurantQuery(text)}
            />
          </View>
          <View>
            <SectionList
              listKey="restaurantsList"
              keyboardShouldPersistTaps="always"
              sections={sections}
              keyExtractor={item =>
                (item as RestaurantsProps)?.id ||
                (item as RestaurantsWithCalcProps)?.brand_id
              }
              data={filteredRestaurantsList}
              extraData={searchValue}
              renderSectionHeader={({section}) => {
                if (section.data.length) {
                  if (section.key === RestorantTypes.RESTORANTS_WITH_CALC) {
                    return (
                      <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderTitle}>
                          Restaurants with Nutrition Calculator available:
                        </Text>
                      </View>
                    );
                  } else if (section.key === RestorantTypes.RESTORANTS) {
                    return (
                      <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderTitle}>
                          Additional restaurants:
                        </Text>
                      </View>
                    );
                  } else {
                    return (
                      <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderTitle}>
                          Restaurants with Nutrition Calculator 2.0 available:
                        </Text>
                      </View>
                    );
                  }
                } else {
                  return null;
                }
              }}
              renderItem={({item, section}) => {
                if (!!section.key) {
                  switch(section.key) {
                    case RestorantTypes.RESTORANTS:
                      return (
                        <RestaurantItem
                          isWithCalc={false}
                          name={(item as RestaurantsProps).name}
                          logo={(item as RestaurantsProps).logo}
                          onPress={() => {
                            Keyboard.dismiss();
                            showRestaurant(item);
                          }}
                        />
                      );
                    case RestorantTypes.RESTORANTS_WITH_CALC:
                      return (
                        <RestaurantItem
                          isWithCalc={true}
                          name={
                            (item as RestaurantsWithCalcProps).proper_brand_name
                          }
                          logo={(item as RestaurantsWithCalcProps).brand_logo}
                          onPress={() => {
                            showRestaurant(item);
                          }}
                        />
                      );
                    case RestorantTypes.RESTORANTS_WITH_CALC_V2:
                      return (
                        <RestaurantItem
                          isWithCalc={true}
                          name={
                            (item as RestaurantsWithCalcProps).proper_brand_name
                          }
                          logo={(item as RestaurantsWithCalcProps).brand_logo}
                          onPress={() => {
                            showRestaurantV2(item);
                          }}
                        />
                      );
                    default:
                      return null;
                  }
                } else {
                  return null;
                }
              }}
              renderSectionFooter={({section}) => {
                if (
                  section.key === RestorantTypes.RESTORANTS &&
                  !section.data.length
                ) {
                  return (
                    <View style={styles.emptyContainer}>
                      <View style={styles.empty}>
                        <Text style={styles.emptyText}>Nothing found.</Text>
                        <NixButton
                          title="Submit a missing restaurant"
                          type="primary"
                          onPress={requestRestaurant}
                        />
                      </View>
                    </View>
                  );
                } else {
                  return null;
                }
              }}
              onEndReached={() => {
                if (restaurants.length < limit) {
                  setLimit(prev => prev + 50);
                }
              }}
            />
          </View>
        </View>
      ) : (
        <RestaurantFoods
          restaurant={selectedRestaurant}
          navigation={navigation}
        />
      )}
    </View>
  );
};

export default Restaurants;
