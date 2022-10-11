// utils
import React from 'react';
import {TouchableOpacity} from 'react-native';

// components
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// types
import {
  NavigationProp,
  ParamListBase,
  useRoute,
} from '@react-navigation/native';

// styles
import {styles} from './BackButton.styles';

interface BackButtonProps {
  navigation: NavigationProp<ParamListBase>;
}

const BackButton: React.FC<BackButtonProps> = ({navigation}) => {
  const route = useRoute<any>();
  const redirectStateKey = route?.params?.redirectStateKey;

  return (
    <TouchableOpacity
      onPress={() => {
        if (redirectStateKey) {
          navigation.navigate({key: redirectStateKey});
        } else {
          navigation.goBack();
        }
      }}
      style={styles.buttonStyle}>
      <FontAwesome name="angle-left" style={styles.iconStyle} />
    </TouchableOpacity>
  );
};

export default BackButton;
