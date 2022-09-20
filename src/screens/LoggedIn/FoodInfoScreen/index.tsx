// utils
import React, {useEffect, useState} from 'react';

// components
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import FoodItem from 'components/FoodItem';
import WhenSection from 'components/WhenSection';
import {NixButton} from 'components/NixButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NutritionPieChart, {
  pieChartDataProps,
} from 'components/NutritionPieChart';
import FoodLabel from 'components/FoodLabel';
import DeleteModal from 'components/DeleteModal';
// @ts-ignore
import QRCode from 'react-native-qrcode-svg';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import * as basketActions from 'store/basket/basket.actions';
import {DeleteFoodFromLog} from 'store/userLog/userLog.actions';

// constants
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {FoodProps} from 'store/userLog/userLog.types';
import {StackNavigatorParamList} from 'navigation/navigation.types';

interface FoodInfoScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.FoodInfo
  >;
  route: RouteProp<StackNavigatorParamList, Routes.FoodInfo>;
}

export const FoodInfoScreen: React.FC<FoodInfoScreenProps> = props => {
  const {selectedDate} = useSelector(state => state.userLog);
  const [foodObj, setFoodObj] = useState<FoodProps>();
  const [showNotes, setShowNotes] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pieChartData, setPieChartData] = useState<pieChartDataProps>();
  const dispatch = useDispatch();

  useEffect(() => {
    setFoodObj(props.route.params?.foodObj);
  }, [props.route]);

  useEffect(() => {
    const newPieChartData: pieChartDataProps = {
      totalFatCalories:
        (foodObj
          ? foodObj.nf_total_fat ||
            foodObj.full_nutrients.filter(attr => attr.attr_id === 204)[0]
              .value ||
            0
          : 0) * 9,
      totalCarbohydratesCalories:
        (foodObj
          ? foodObj.nf_total_carbohydrate ||
            foodObj.full_nutrients.filter(attr => attr.attr_id === 205)[0]
              .value ||
            0
          : 0) * 4,
      totalProteinCalories:
        (foodObj
          ? foodObj.nf_protein ||
            foodObj.full_nutrients.filter(attr => attr.attr_id === 203)[0]
              .value ||
            0
          : 0) * 4,
    };

    let alcoholAttr =
      foodObj && foodObj.full_nutrients
        ? foodObj.full_nutrients.filter(attr => attr.attr_id === 221)[0]?.value
        : 0;

    if (alcoholAttr) {
      newPieChartData.totalAlcoholCalories = alcoholAttr * 7;
    }

    setPieChartData(newPieChartData);
  }, [foodObj]);

  const deleteFromLog = () => {
    dispatch(DeleteFoodFromLog([{id: foodObj?.id || '-1'}])).then(() => {
      setShowDeleteModal(false);
      props.navigation.navigate(Routes.Dashboard);
    });
  };

  const addItemToBasket = async () => {
    dispatch(basketActions.addFoodToBasket(foodObj?.food_name || '')).then(
      () => {
        dispatch(basketActions.changeConsumedAt(selectedDate));

        if (props.route.params?.mealType) {
          dispatch(basketActions.changeMealType(props.route.params.mealType));
        }
        props.navigation.replace('Basket');
      },
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: '#fff'}}>
      {foodObj ? (
        <ScrollView>
          <FoodItem
            key={foodObj.food_name + foodObj.consumed_at}
            foodObj={foodObj}
          />
          <WhenSection
            consumed_at={foodObj.consumed_at}
            meal_type={foodObj.meal_type}
            onDateChange={() => console.log(foodObj)}
            onMealTypeChange={() => console.log(foodObj)}
          />
          {/* TODO Photo */}

          <View style={{padding: 10, flexDirection: 'row', flex: 1}}>
            <View style={{flex: 1, marginRight: 10}}>
              <NixButton
                title="Copy"
                type="outline"
                onPress={() => addItemToBasket()}
              />
            </View>
            <View style={{flex: 1}}>
              <NixButton
                title="Delete"
                type="outline"
                onPress={() => setShowDeleteModal(true)}
              />
            </View>
          </View>
          <View style={{padding: 10}}>
            <FoodLabel data={foodObj} />
          </View>
          <View style={{paddingHorizontal: 10, paddingBottom: 10}}>
            <Text style={{fontSize: 12}}>
              Net Carbs**: {(foodObj.net_carbs || 0).toFixed(1)} g
            </Text>
            <Text style={{fontSize: 12}}>
              Vitamin D** : {(foodObj.vitamin_d || 0).toFixed(1)} IU
            </Text>
            <Text style={{fontSize: 12}}>
              Phosphorus** : {(foodObj.nf_p || 0).toFixed(1)} mg
            </Text>
            <Text style={{fontSize: 12}}>
              Potassium** : {(foodObj.nf_potassium || 0).toFixed(1)} mg
            </Text>
            <Text style={{fontSize: 12}}>
              Caffeine** : {(foodObj.caffeine || 0).toFixed(1)} mg
            </Text>
          </View>

          {pieChartData && (
            <View style={{marginVertical: 10}}>
              <NutritionPieChart data={pieChartData} />
            </View>
          )}

          <View>
            <TouchableWithoutFeedback onPress={() => setShowNotes(!showNotes)}>
              <View
                style={{padding: 10, borderTopWidth: 1, borderBottomWidth: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 16}}>Notes</Text>
                  <FontAwesome name="angle-down" size={23} />
                </View>
                {showNotes ? (
                  <TextInput
                    multiline={true}
                    numberOfLines={5}
                    value={foodObj.notes}
                    style={{
                      marginTop: 10,
                      borderWidth: 1,
                      padding: 8,
                      minHeight: 200,
                    }}
                  />
                ) : null}
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={{padding: 10}}>
            <View style={{alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 20}}>
                Share this food
              </Text>
              {/* TODO - Share icon to other options here*/}
            </View>
            <View style={{alignItems: 'center', margin: 10}}>
              <QRCode
                size={270}
                logo={require('assets/icon.png')}
                logoSize={5}
                value={`https://nutritionix.app.link/q3?ufl=${foodObj.id}&s=${foodObj.share_key}`}
              />
            </View>
            <Text>
              Have a friend use the Track barcode scanner to scan this code and
              instantly copy this meal to their food log. You can also tap the
              share icon to share this meal via SMS or email.
            </Text>
          </View>
          <Text style={{padding: 10}}>
            ** Please note that our restaurant and branded grocery food database
            does not have these attributes available, and if your food log
            contains restaurant or branded grocery foods, these totals may be
            incorrect. The data from these attributes is for reference purposes
            only, and should not be used for any chronic disease management.
          </Text>
        </ScrollView>
      ) : null}
      <DeleteModal
        title="Delete Food"
        text="Are you sure you wantto delete this food?"
        modalVisible={showDeleteModal}
        setModalVisible={setShowDeleteModal}
        delete={deleteFromLog}
      />
    </SafeAreaView>
  );
};
