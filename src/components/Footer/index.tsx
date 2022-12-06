// utils
import React from 'react';

// components
import {View, SafeAreaView} from 'react-native';
import FooterItem from './FooterItem';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {WithLocalSvg} from 'react-native-svg';
import MealBuilder from 'components/MealBuilder';
import TooltipView from 'components/TooltipView';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import {
  setCheckedEvents,
  setWalkthroughTooltip,
} from 'store/walkthrough/walkthrough.actions';

// styles
import {styles} from './Footer.styles';
import {styles as footerItemStyles} from './FooterItem/FooterItem.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';

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
  const dispatch = useDispatch();
  const {checkedEvents, currentTooltip} = useSelector(
    state => state.walkthrough,
  );
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
        <TooltipView
          isVisible={
            !checkedEvents.firstLogin.value &&
            currentTooltip?.eventName === 'firstLogin' &&
            currentTooltip?.step === 3
          }
          title={
            currentTooltip
              ? checkedEvents[currentTooltip?.eventName].steps[
                  currentTooltip?.step
                ].title
              : ''
          }
          text={
            currentTooltip
              ? checkedEvents[currentTooltip?.eventName].steps[
                  currentTooltip?.step
                ].text
              : ''
          }
          placement="top"
          prevAction={() => {
            dispatch(setWalkthroughTooltip('firstLogin', 2));
          }}
          finishAction={() => {
            dispatch(setCheckedEvents('firstLogin', true));
          }}
          parentWrapperStyle={[
            footerItemStyles.footerItem,
            styles.parentWrapperStyle,
          ]}>
          <FooterItem
            title="Track"
            style={{
              ...styles.footerTrackItem,
              ...styles.footerTrackItemWithTooltip,
            }}
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
