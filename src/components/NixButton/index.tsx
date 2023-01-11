// utils
import React from 'react';

// components
import {View, TouchableOpacity, Text} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

// styles
import {styles} from './NixButton.styles';

interface NixButtonProps {
  type?:
    | 'facebook'
    | 'red'
    | 'positive'
    | 'primary'
    | 'calm'
    | 'energized'
    | 'blue'
    | 'dark'
    | 'default'
    | 'outline'
    | 'gray';
  disabled?: boolean;
  onTap?: () => void;
  onPress?: () => void;
  title?: string;
  iconName?: string;
  style?: {
    [key: string]: string | number;
  };
  buttonTextStyles?: {
    [key: string]: string | number;
  };
  width?: number | string;
  withMarginTop?: boolean;
  btnTextStyles?: {
    [key: string]: string | number;
  };
  iconStyles?: {
    [key: string]: string | number;
  };
  iosIcon?: boolean;
}

export const NixButton: React.FC<NixButtonProps> = ({
  type,
  disabled,
  onTap,
  onPress,
  title,
  iconName,
  width,
  style,
  withMarginTop,
  btnTextStyles,
  iconStyles,
  iosIcon,
}) => {
  let buttonTypeStyles = {};
  let buttonTypeTextStyles = {};

  switch (type) {
    case 'facebook': {
      buttonTypeStyles = styles.facebookBtn;
      buttonTypeTextStyles = styles.facebookBtnText;
      break;
    }
    case 'red': {
      buttonTypeStyles = styles.assertive;
      buttonTypeTextStyles = styles.assertiveText;
      break;
    }
    case 'positive': {
      buttonTypeStyles = styles.positive;
      buttonTypeTextStyles = styles.positiveText;
      break;
    }
    case 'primary': {
      buttonTypeStyles = styles.primary;
      buttonTypeTextStyles = styles.primaryText;
      break;
    }
    case 'calm': {
      buttonTypeStyles = styles.calm;
      buttonTypeTextStyles = styles.calmText;
      break;
    }
    case 'energized': {
      buttonTypeStyles = styles.energized;
      buttonTypeTextStyles = styles.energizedText;
      break;
    }
    case 'blue': {
      buttonTypeStyles = styles.blue;
      buttonTypeTextStyles = styles.blueText;
      break;
    }
    case 'dark': {
      buttonTypeStyles = styles.dark;
      buttonTypeTextStyles = styles.darkText;
      break;
    }
    case 'outline': {
      buttonTypeStyles = styles.outline;
      buttonTypeTextStyles = styles.outlineText;
      break;
    }
    case 'gray': {
      buttonTypeStyles = styles.gray;
      buttonTypeTextStyles = styles.grayText;
      break;
    }
    default: {
      buttonTypeStyles = styles.defaultBtnBgColor;
      buttonTypeTextStyles = styles.defaultTextStyles;
    }
  }

  let disabledStyles = disabled ? {opacity: 0.5} : {};
  const widthStyles = width ? {width} : {};

  const Icon = iosIcon ? Ionicons : FontAwesome;

  return (
    <View
      style={[
        {
          ...styles.nixButton,
          ...buttonTypeStyles,
          ...disabledStyles,
          ...widthStyles,
          ...style,
        },
        withMarginTop ? styles.mt10 : {},
      ]}>
      <TouchableOpacity
        style={styles.contentWrapper}
        onPress={onTap || onPress}
        disabled={disabled}>
        {iconName ? (
          <Icon name={iconName} style={{...styles.icon, ...iconStyles}} />
        ) : null}
        <View style={styles.titleContainer}>
          <Text
            style={{
              ...styles.title,
              ...buttonTypeTextStyles,
              ...btnTextStyles,
            }}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
