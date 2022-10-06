// utils
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

// components
import {View, Text, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

// styles
import {styles} from './FoodLogSectionHeader.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {FoodProps, mealById} from 'store/userLog/userLog.types';

interface FoodLogSectionHeaderProps {
  onPress: () => void;
  mealType?: keyof typeof mealById;
  foods?: FoodProps[];
  title: string;
}

const FoodLogSectionHeader: React.FC<FoodLogSectionHeaderProps> = ({
  mealType,
  foods,
  onPress,
  title,
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
    <View style={styles.mealTitle}>
      <TouchableOpacity
        style={{
          ...styles.increasedTouchableArea,
          ...{flex: 1, flexDirection: 'row', alignItems: 'center'},
        }}
        onPress={onPress}>
        <Text style={styles.mealTitleText}>{title}</Text>
        <View style={styles.mealTitleIconWrapper}>
          <Ionicons
            name="ios-add"
            color="#fff"
            size={14}
            style={styles.mealTitleIcon}
          />
        </View>
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
            onPress={() => {
              if (foods?.length) {
                navigation.navigate(Routes.Totals, {
                  foods: foods,
                  type: mealById[mealType],
                });
              }
            }}>
            <FontAwesome name="info-circle" color="#999" size={19} />
            {foods && (
              <Text style={styles.mealTotalCalories}>
                {totalMealCalories.toFixed(0)}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default FoodLogSectionHeader;
