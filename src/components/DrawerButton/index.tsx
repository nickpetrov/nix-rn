import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {styles} from './DrawerButton.styles';

const DrawerButton = ({navigation}: any) => (
  <TouchableOpacity
    onPress={() => navigation.toggleDrawer()}
    style={styles.buttonStyle}>
    <Icon name="bars" style={styles.iconStyle} />
  </TouchableOpacity>
);

export default DrawerButton;
