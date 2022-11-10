// utils
import React from 'react';

// components
import {View, SafeAreaView, Image} from 'react-native';
import FooterItem from './FooterItem';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {SvgUri} from 'react-native-svg';
import MealBuilder from 'components/MealBuilder';

// styles
import {styles} from './Footer.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';

const {uri} = Image.resolveAssetSource(require('assets/recommended.svg'));

interface FooterProps {
  hide: boolean;
  style?: {
    [key: string]: string | number;
  };
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Dashboard | Routes.Stats | Routes.Suggested | Routes.TrackFoods
  >;
  withMealBuilder?: boolean;
}

const Footer: React.FC<FooterProps> = props => {
  let hideFooterStyle = {marginTop: 0};

  if (props.hide) {
    // hideFooterStyle = hideFooterStyle.marginTop = 50;
  }

  return (
    <SafeAreaView style={[styles.root, props.style]}>
      {props.withMealBuilder && <MealBuilder />}
      <View style={{...styles.footer, ...hideFooterStyle}}>
        <FooterItem
          title="Dashboard"
          onPress={() => {
            props.navigation.replace(Routes.Dashboard);
          }}>
          <FontAwesome name="home" color="#fff" size={30} />
        </FooterItem>
        <FooterItem
          title="Stats"
          onPress={() => {
            props.navigation.navigate(Routes.Stats);
          }}>
          <FontAwesome name="bar-chart" color="#fff" size={30} />
        </FooterItem>
        <FooterItem
          title="Track"
          style={styles.footerTrackItem}
          titleStyle={styles.foodTrackItemText}
          onPress={() => {
            props.navigation.navigate(Routes.TrackFoods);
          }}>
          <FontAwesome
            name="plus"
            color="#fff"
            size={36}
            style={{marginBottom: -7}}
          />
        </FooterItem>
        <FooterItem
          title="Suggested"
          onPress={() => props.navigation.navigate(Routes.Suggested)}>
          <SvgUri
            uri={uri}
            width="20"
            height="28"
            viewBox="0 0 10 16"
            preserveAspectRatio="none"
          />
        </FooterItem>
        <FooterItem
          title="Preferences"
          onPress={() => {
            props.navigation.navigate(Routes.Preferences);
          }}>
          <FontAwesome name="gear" color="#fff" size={30} />
        </FooterItem>
      </View>
    </SafeAreaView>
  );
};

export default Footer;
