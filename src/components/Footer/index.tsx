// utils
import React from 'react';
import {useRoute} from '@react-navigation/native';

// components
import {View, SafeAreaView} from 'react-native';
import FooterItem from './FooterItem';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {WithLocalSvg} from 'react-native-svg';
import MealBuilder from 'components/MealBuilder';
import TooltipView from 'components/TooltipView';

// styles
import {styles} from './Footer.styles';
import {styles as footerItemStyles} from './FooterItem/FooterItem.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';
import {useSelector} from 'hooks/useRedux';

interface FooterProps {
  hide: boolean;
  style?: {
    [key: string]: string | number;
  };
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Dashboard | Routes.Stats | Routes.Suggested | Routes.TrackFoods | Routes.Preferences
  >;
  withMealBuilder?: boolean;
}

const Footer: React.FC<FooterProps> = props => {
  const route = useRoute();
  const selectedDate = useSelector(state => state.userLog.selectedDate);
  let hideFooterStyle = {marginTop: 0};
  if (props.hide) {
    // hideFooterStyle = hideFooterStyle.marginTop = 50;
  }

  return (
    <SafeAreaView style={[styles.root, props.style]}>
      {props.withMealBuilder && <MealBuilder />}
      <View style={{...styles.footer, ...hideFooterStyle}}>
        <FooterItem
          activeTab={route.name === Routes.Dashboard}
          title="Dashboard"
          onPress={() => {
            props.navigation.replace(Routes.Dashboard);
          }}>
          <FontAwesome name="home" color="#fff" size={30} />
        </FooterItem>
        <FooterItem
          activeTab={route.name === Routes.Stats}
          title="Stats"
          onPress={() => {
            props.navigation.navigate(Routes.Stats, {
              selectedDate,
            });
          }}>
          <FontAwesome name="bar-chart" color="#fff" size={30} />
        </FooterItem>
        <TooltipView
          doNotDisplay={route.name !== Routes.Dashboard}
          placement="top"
          eventName="firstLogin"
          step={3}
          parentWrapperStyle={[
            footerItemStyles.footerItem,
            styles.parentWrapperStyle,
          ]}>
          <FooterItem
            title="Track"
            style={[
              styles.footerTrackItem,
              styles.footerTrackItemWithTooltip,
              route.name === Routes.TrackFoods ? styles.activeFooterTrackItem : {},
            ]}
            titleStyle={styles.foodTrackItemText}
            onPress={() => {
              props.navigation.navigate(Routes.TrackFoods);
            }}>
            <FontAwesome
              name="plus"
              color="#fff"
              size={32}
              style={{marginBottom: -5}}
            />
          </FooterItem>
        </TooltipView>
        <FooterItem
          activeTab={route.name === Routes.Suggested}
          title="Suggested"
          onPress={() => props.navigation.navigate(Routes.Suggested)}>
          <WithLocalSvg
            asset={require('assets/recommended.svg')}
            width="20"
            height="28"
            viewBox="0 0 10 16"
            preserveAspectRatio="none"
          />
        </FooterItem>
        <FooterItem
          activeTab={route.name === Routes.Menu}
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
