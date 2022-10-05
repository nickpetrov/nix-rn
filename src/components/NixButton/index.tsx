// utils
import React from 'react';

// components
import {View, TouchableOpacity, Text} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// styles
import {styles} from './NixButton.styles';

interface NixButtonProps {
  type?:
    | 'facebook'
    | 'assertive'
    | 'positive'
    | 'primary'
    | 'calm'
    | 'energized'
    | 'royal'
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
  width?: number;
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
}) => {
  let buttonTypeStyles = {};
  let buttonTypeTextStyles = {};

  switch (type) {
    case 'facebook': {
      buttonTypeStyles = styles.facebookBtn;
      buttonTypeTextStyles = styles.facebookBtnText;
      break;
    }
    case 'assertive': {
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
    case 'royal': {
      buttonTypeStyles = styles.royal;
      buttonTypeTextStyles = styles.royalText;
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

  return (
    <View
      style={{
        ...styles.nixButton,
        ...buttonTypeStyles,
        ...disabledStyles,
        ...widthStyles,
        ...style,
      }}>
      <TouchableOpacity
        style={styles.contentWrapper}
        onPress={onTap || onPress}
        disabled={disabled}>
        {iconName ? (
          <FontAwesome
            name={iconName}
            style={{...styles.icon, ...buttonTypeTextStyles}}
          />
        ) : null}
        <View style={styles.titleContainer}>
          <Text style={{...styles.title, ...buttonTypeTextStyles}}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
