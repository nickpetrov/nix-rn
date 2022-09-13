// utils
import React from 'react';

// components
import {View, Text} from 'react-native';
import MealListItem from 'components/FoodLog/MealListItem';
import {ScrollView} from 'react-native-gesture-handler';

// styles
import {styles} from './ConsolidatedSearchResults.styles';

// types
import {AutoCompleteState} from 'store/autoComplete/autoComplete.types';
import {FoodProps} from 'store/autoComplete/autoComplete.types';

interface ConsolidatedSearchResultsProps {
  foods: AutoCompleteState;
  onTap: (food: FoodProps) => void;
}

const ConsolidatedSearchResults: React.FC<
  ConsolidatedSearchResultsProps
> = props => {
  const foods = props.foods;
  const onTap = props.onTap;

  const HistoryFoods = () => {
    return foods.self.length > 0 ? (
      <>
        {foods.self.map((food, index) => {
          if (index < 3) {
            return (
              <MealListItem
                key={`history-${food.id || food.uuid || food.nix_item_id}`}
                foodObj={food}
                onTap={() => onTap(food)}
              />
            );
          } else {
            return null;
          }
        })}
      </>
    ) : null;
  };
  const CommonFoods = () => {
    return foods.common.length ? (
      <>
        {foods.common.map((food, index) => {
          if (index < 5) {
            return (
              <MealListItem
                key={`common-${food.tag_id}-${food.food_name}`}
                foodObj={food}
                onTap={() => onTap(food)}
              />
            );
          } else {
            return null;
          }
        })}
      </>
    ) : null;
  };
  const BrandedFoods = () => {
    return foods.branded.length ? (
      <>
        {foods.branded.map((food, index) => {
          if (index < 3) {
            return (
              <MealListItem
                key={`brand-${food.nix_item_id}`}
                foodObj={food}
                onTap={() => onTap(food)}
              />
            );
          } else {
            return null;
          }
        })}
      </>
    ) : null;
  };

  return (
    <View>
      <ScrollView>
        {foods.self.length ? (
          <>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>History foods</Text>
            </View>
            <HistoryFoods />
          </>
        ) : null}
        {foods.common.length ? (
          <>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>Common Foods</Text>
            </View>
            <CommonFoods />
          </>
        ) : null}
        {foods.branded.length ? (
          <>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>Branded Foods</Text>
            </View>
            <BrandedFoods />
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default ConsolidatedSearchResults;
