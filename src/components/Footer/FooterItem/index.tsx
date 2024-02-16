// utils
import React from 'react';

// componets
import {Text, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';

// styles
import {styles} from './FooterItem.styles';

interface FooterItemProps {
  onPress: () => void;
  children: React.ReactNode;
  titleStyle?: TextStyle;
  style?: ViewStyle | ViewStyle[];
  title: string;
  activeTab?: boolean;
}

const FooterItem: React.FC<FooterItemProps> = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.footerItem, props.style, props.activeTab && styles.activeTab]}
      onPress={props.onPress}>
      {props.children}
      <Text style={{...styles.footerItemText, ...props.titleStyle}}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default FooterItem;
