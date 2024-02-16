// utils
import React from 'react';

// components
import {View, Text, Switch, SafeAreaView} from 'react-native';

// config
import {grocery_photo_upload} from 'config/index';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import {toggleGroceryAgentPreferences} from 'store/base/base.actions';

// styles
import {styles} from './GroceryAgentSettingsScreen.styles';
import {Colors} from 'constants/Colors';

export const GroceryAgentSettingsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const food_update_time = grocery_photo_upload.food_update_time;
  const volunteer = useSelector(
    state => state.base.groceryAgentPreferences.volunteer,
  );

  const handleChangeGroceryAgentPreference = () => {
    dispatch(toggleGroceryAgentPreferences());
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.item}>
        <View style={styles.left}>
          <Text style={styles.title}>Volunteer to submit new photos</Text>
          <Text>
            {`if the product is out of date  (${food_update_time.quantity} ${food_update_time.unit})`}
          </Text>
        </View>
        <View>
          <Switch
            value={volunteer}
            onChange={handleChangeGroceryAgentPreference}
            style={styles.switch}
            trackColor={{false: Colors.LightGray, true: Colors.LightGreen}}
            thumbColor={'#fff'}
            ios_backgroundColor="#fff"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
