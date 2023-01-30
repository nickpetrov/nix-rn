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
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './BackButton.styles';

interface BackButtonProps {
  navigation: NavigationProp<ParamListBase>;
}

const BackButton: React.FC<BackButtonProps> = ({navigation}) => {
  const route = useRoute<any>();
  const from = route?.params?.from;

  return (
    <TouchableOpacity
      onPress={() => {
        if (from && (from === Routes.Basket || from === Routes.Dashboard)) {
          navigation.navigate(from, {
            from: route.name,
          });
        } else if (
          from &&
          (from === Routes.BarcodeScanner || from === Routes.PhotoUpload)
        ) {
          navigation.navigate(Routes.Dashboard);
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
