// utils
import React from 'react';

// components
import {View, SafeAreaView} from 'react-native';
import FooterItem from './FooterItem';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// import ImageSVG from 'expo-svg-uri';

// styles
import {styles} from './Footer.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// constants
import {Routes} from 'navigation/Routes';

interface FooterProps {
  hide: boolean;
  style?: any;
  navigation: NativeStackNavigationProp<any>;
}

const Footer: React.FC<FooterProps> = props => {
  let hideFooterStyle = {marginTop: 0};

  if (props.hide) {
    // hideFooterStyle = hideFooterStyle.marginTop = 50;
  }

  return (
    <SafeAreaView style={[{backgroundColor: '#444'}, props.style]}>
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
            props.navigation.replace(Routes.Stats);
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
          {/* <ImageSVG
            source={require('assets/recommended.svg')}
            width="50"
            height="28"
            viewBox="0 0 10 16"
            preserveAspectRatio="none"
          /> */}
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
