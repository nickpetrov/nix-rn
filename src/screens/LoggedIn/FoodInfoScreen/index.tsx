// utils
import React, {useEffect, useState} from 'react';

// components
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import MealListItem from 'components/FoodLog/MealListItem';
import FoodLabel from 'components/FoodLabel';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NixButton} from 'components/NixButton';

// constants
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {FoodProps} from 'store/userLog/userLog.types';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// styles
import {styles} from './FoodInfoScreen.styles';

interface FoodInfoScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.FoodInfo
  >;
  route: RouteProp<StackNavigatorParamList, Routes.FoodInfo>;
}

export const FoodInfoScreen: React.FC<FoodInfoScreenProps> = props => {
  const [foodObj, setFoodObj] = useState<FoodProps>();
  const [photoVisible, setPhotoVisible] = useState<boolean>(false);

  useEffect(() => {
    setFoodObj(props.route.params?.foodObj);
  }, [props.route]);

  return (
    <SafeAreaView style={styles.root}>
      {foodObj ? (
        <ScrollView>
          <MealListItem foodObj={foodObj} />
          <TouchableWithoutFeedback
            onPress={() => setPhotoVisible(!photoVisible)}>
            <View style={styles.photoBtn}>
              <FontAwesome name="camera" color="#000" size={19} />
              <Text style={styles.photoBtnText}>Photo</Text>
              <FontAwesome
                name={photoVisible ? 'chevron-down' : 'chevron-right'}
                color="#000"
                size={15}
              />
            </View>
          </TouchableWithoutFeedback>
          {photoVisible && (
            <Image
              style={styles.image}
              source={{uri: foodObj.photo.highres || ''}}
              resizeMode="contain"
            />
          )}
          <View style={styles.p10}>
            <FoodLabel data={foodObj} />
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.text}>
              Net Carbs**: {(foodObj.net_carbs || 0).toFixed(1)} g
            </Text>
            <Text style={styles.text}>
              Vitamin D** : {(foodObj.vitamin_d || 0).toFixed(1)} IU
            </Text>
            <Text style={styles.text}>
              Phosphorus** : {(foodObj.nf_p || 0).toFixed(1)} mg
            </Text>
            <Text style={styles.text}>
              Potassium** : {(foodObj.nf_potassium || 0).toFixed(1)} mg
            </Text>
            <Text style={styles.text}>
              Caffeine** : {(foodObj.caffeine || 0).toFixed(1)} mg
            </Text>
          </View>
          <View style={styles.btnContainer}>
            <NixButton
              title="Go Back"
              type="facebook"
              width={100}
              onPress={() => props.navigation.goBack()}
            />
          </View>
          <Text style={styles.p10}>
            ** Please note that our restaurant and branded grocery food database
            does not have these attributes available, and if your food log
            contains restaurant or branded grocery foods, these totals may be
            incorrect. The data from these attributes is for reference purposes
            only, and should not be used for any chronic disease management.
          </Text>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
};
