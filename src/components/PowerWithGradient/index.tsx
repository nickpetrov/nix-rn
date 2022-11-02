import {View, ViewProps} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import {styles} from './PowerWithGradient.styles';

interface PowerWithGradientProps extends ViewProps {
  style?: {
    [key: string]: string | number;
  };
  maskStyle?: {
    [key: string]: string | number;
  };
  gradient?: string[];
}

const PowerWithGradient: React.FC<PowerWithGradientProps> = ({
  style,
  maskStyle,
  children,
  gradient,
  ...rest
}) => {
  return (
    <View style={[styles.root, style && style]} {...rest}>
      <MaskedView
        style={[{flex: 1, flexDirection: 'row'}, maskStyle && maskStyle]}
        maskElement={
          <View
            style={{
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {children}
          </View>
        }>
        <LinearGradient
          colors={gradient || ['#F7C650', 'rgba(247, 198, 80, 0.71)']}
          style={{flex: 1}}
        />
      </MaskedView>
    </View>
  );
};

export default PowerWithGradient;
