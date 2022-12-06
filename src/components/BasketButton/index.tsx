// utils
import React from 'react';

// components
import {View, Text, TouchableOpacity} from 'react-native';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// styles
import {styles} from './BasketButton.styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import TooltipView from 'components/TooltipView';
import {
  setCheckedEvents,
  setWalkthroughTooltip,
} from 'store/walkthrough/walkthrough.actions';

interface BasketButtonProps {
  withCount?: boolean;
  onPress: () => void;
  icon: string;
}

const BasketButton: React.FC<BasketButtonProps> = props => {
  const foods = useSelector(state => state.basket.foods);
  const dispatch = useDispatch();
  const {checkedEvents, currentTooltip} = useSelector(
    state => state.walkthrough,
  );
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.container}>
      <TooltipView
        isVisible={
          !checkedEvents.firstLogin.value &&
          currentTooltip?.eventName === 'firstLogin' &&
          currentTooltip?.step === 2
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
        prevAction={() => {
          dispatch(setWalkthroughTooltip('firstLogin', 1));
        }}
        nextAction={() => {
          dispatch(setWalkthroughTooltip('firstLogin', 3));
        }}
        finishAction={() => {
          dispatch(setCheckedEvents('firstLogin', true));
        }}
        parentWrapperStyle={styles.root}>
        {/* used without tooltip */}
        {/* <View style={styles.root}> */}
        {foods.length > 0 && props.withCount && (
          <View style={styles.badge}>
            <Text style={styles.text}>{foods.length}</Text>
          </View>
        )}
        <FontAwesome size={26} color={'white'} name={props.icon} />
        {/* </View> */}
      </TooltipView>
    </TouchableOpacity>
  );
};

export default BasketButton;
