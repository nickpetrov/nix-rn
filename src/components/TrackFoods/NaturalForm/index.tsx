// utils
import React, {useState} from 'react';

// components
import {View, Text} from 'react-native';
import {NixButton} from 'components/NixButton';
import VoiceInput from 'components/VoiceInput';

// hooks
import {useDispatch} from 'hooks/useRedux';

// actions
import * as basketActions from 'store/basket/basket.actions';

// styles
import {styles} from './NaturalForm.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';

interface NaturalFormProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.TrackFoods
  >;
}

const NaturalForm: React.FC<NaturalFormProps> = ({navigation}) => {
  const [naturalQuery, setNaturalQuery] = useState('');
  const dispatch = useDispatch();
  const [randomPlaceholderIndex] = useState(Math.floor(Math.random() * 9));

  const placeholderText = [
    ' e.g. Turkey club sandwich and 12oz coke',
    ' e.g. 600 cal chicken caesar salad',
    ' e.g. 5 eggs and 1 glass milk',
    ' e.g. 2 glasses of wine',
    ' e.g. 15 almonds',
    ' e.g. 100 cal greek yogurt',
    ' e.g. yesterday for dinner i ate a grilled cheese (this will log to 7pm yesterday)',
    ' e.g. for breakfast i had 2 eggs, a slice of bacon, and toast (this will log to 8am this morning)',
  ];

  const handleQueryChange = (text: string) => setNaturalQuery(text);

  const sendNaturalQuery = async () => {
    dispatch(basketActions.addFoodToBasket(naturalQuery)).then(foodsToAdd => {
      dispatch(basketActions.changeMealType(foodsToAdd.foods[0].meal_type));
      dispatch(basketActions.changeConsumedAt(foodsToAdd.foods[0].consumed_at));
      navigation.replace(Routes.Basket);
    });
  };
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <VoiceInput
          value={naturalQuery}
          onChangeText={handleQueryChange}
          placeholder={placeholderText[randomPlaceholderIndex]}
          style={styles.voiceInput}
        />
        <View style={styles.btnContainer}>
          <NixButton
            title="Add to Basket"
            type="primary"
            onPress={sendNaturalQuery}
          />
        </View>
        <View>
          <Text>How does Freeform work?</Text>
          <Text>Type or speak freeform text in the box above.</Text>
          <Text>
            Freeform is fueled by our state-of-the-art Natural Language
            Processing technology to accurately determine what you ate.
          </Text>
          <Text>
            After you add foods to the Basket, you will have a chance to review
            the foods, change the time you ate them, and change serving sizes
            before adding to your food log.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NaturalForm;
