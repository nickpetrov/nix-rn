// utils
import React from 'react';

// componets
import {Text, TouchableOpacity} from 'react-native';

// styles
import {styles} from './FooterItem.styles';

interface FooterItemProps {
  onPress: () => void;
  children: React.ReactNode;
  titleStyle?: {
    [key: string]: string | number;
  };
  style?: {
    [key: string]: string | number;
  };
  title: string;
}

const FooterItem: React.FC<FooterItemProps> = props => {
  return (
    <TouchableOpacity
      style={{...styles.footerItem, ...props.style}}
      onPress={props.onPress}>
      {props.children}
      <Text style={{...styles.footerItemText, ...props.titleStyle}}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default FooterItem;
