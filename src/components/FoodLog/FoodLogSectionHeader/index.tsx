// utils
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

// components
import {View, Text, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TooltipView from 'components/TooltipView';

// styles
import {styles} from './FoodLogSectionHeader.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {FoodProps, mealById} from 'store/userLog/userLog.types';
import {mealTypes} from 'store/basket/basket.types';

interface FoodLogSectionHeaderProps {
  onPress: () => void;
  mealType?: keyof typeof mealById;
  foods?: FoodProps[];
  title: string;
  clientId?: string;
}

const FoodLogSectionHeader: React.FC<FoodLogSectionHeaderProps> = ({
  mealType,
  foods,
  onPress,
  title,
  clientId,
}) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<StackNavigatorParamList, Routes.Dashboard>
    >();
  const [totalMealCalories, setTotalMealCalories] = useState(0);

  useEffect(() => {
    setTotalMealCalories(() => {
      let newCalories = 0;
      foods?.map((food: FoodProps) => {
        newCalories += food.nf_calories || 0;
      });
      return newCalories;
    });
  }, [foods]);

  return (
    <TouchableOpacity
      disabled={!clientId}
      onPress={() => {
        if (foods?.length && mealType) {
          navigation.navigate(Routes.Totals, {
            foods: foods,
            type: mealById[mealType],
            readOnly: true,
            clientId,
          });
        }
      }}>
      <View style={styles.mealTitle}>
        <TouchableOpacity
          style={{
            ...styles.increasedTouchableArea,
            ...{flex: 1, flexDirection: 'row', alignItems: 'center'},
          }}
          disabled={!!clientId}
          onPress={onPress}>
          <Text style={styles.mealTitleText}>{title}</Text>
          {!clientId && (
            <View style={styles.mealTitleIconWrapper}>
              <Ionicons
                name="ios-add"
                color="#fff"
                size={14}
                style={styles.mealTitleIcon}
              />
            </View>
          )}
        </TouchableOpacity>
        {mealType ? (
          <View style={styles.mealDetailsWrapper}>
            <TouchableOpacity
              style={{
                ...styles.increasedTouchableArea,
                ...{
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              }}
              disabled={!!clientId}
              onPress={() => {
                if (foods?.length) {
                  navigation.navigate(Routes.Totals, {
                    foods: foods,
                    type: mealById[mealType],
                  });
                }
              }}>
              {mealType === mealTypes.Breakfast ? (
                <TooltipView
                  eventName="firstFoodAddedToFoodLog"
                  step={1}
                  childrenWrapperStyle={{backgroundColor: '#fff'}}>
                  <FontAwesome name="info-circle" color="#999" size={19} />
                </TooltipView>
              ) : (
                <FontAwesome name="info-circle" color="#999" size={19} />
              )}
              {foods && (
                <Text style={styles.mealTotalCalories}>
                  {totalMealCalories.toFixed(0)}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default FoodLogSectionHeader;
