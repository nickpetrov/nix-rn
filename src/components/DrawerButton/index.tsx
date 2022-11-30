// utils
import React from 'react';
import {TouchableOpacity} from 'react-native';

// components
import Icon from 'react-native-vector-icons/FontAwesome';

// types
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {ParamListBase, useNavigation} from '@react-navigation/native';

// styles
import {styles} from './DrawerButton.styles';

interface DrawerButtonProps {}

const DrawerButton: React.FC<DrawerButtonProps> = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  return (
    <TouchableOpacity
      onPress={() => navigation.toggleDrawer()}
      style={styles.buttonStyle}>
      <Icon name="bars" style={styles.iconStyle} />
    </TouchableOpacity>
  );
};

export default DrawerButton;
