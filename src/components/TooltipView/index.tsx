import React from 'react';
import {Text, View, Platform, StatusBar} from 'react-native';
import Tooltip, {TooltipProps as Props} from 'react-native-walkthrough-tooltip';
import {ReactNode} from 'react';
import {styles} from './TooltipView.styles';
import {NixButton} from 'components/NixButton';
import {CheckedEventsType} from 'store/walkthrough/walkthrough.types';
import {useDispatch, useSelector} from 'hooks/useRedux';
import {
  setCheckedEvents,
  setWalkthroughTooltip,
} from 'store/walkthrough/walkthrough.actions';

declare module 'react-native-walkthrough-tooltip' {
  export interface TooltipProps {
    children: ReactNode;
  }
}

interface TooltipViewProps extends Props {
  children: React.ReactNode;
  onClose?: () => void;
  placement?: 'bottom' | 'top' | 'left' | 'right' | 'center';
  step: number;
  eventName: keyof CheckedEventsType;
}

const TooltipView: React.FC<TooltipViewProps> = ({
  step,
  placement,
  eventName,
  onClose,
  children,
  ...props
}) => {
  const dispatch = useDispatch();
  const {checkedEvents, currentTooltip} = useSelector(
    state => state.walkthrough,
  );
  const prevAction =
    step > 0 && !currentTooltip?.forbidBack
      ? () => {
          dispatch(setWalkthroughTooltip(eventName, step - 1));
        }
      : undefined;
  const nextAction =
    checkedEvents[eventName].steps.length - 1 > step
      ? () => {
          dispatch(setWalkthroughTooltip(eventName, step + 1));
        }
      : undefined;
  const finishAction = () => {
    dispatch(setCheckedEvents(eventName, true));
  };

  return (
    <Tooltip
      topAdjustment={
        Platform.OS === 'android' ? -(StatusBar?.currentHeight || 0) : 0
      }
      contentStyle={styles.tooltip}
      content={
        <View>
          <Text style={styles.title}>
            {currentTooltip
              ? checkedEvents[currentTooltip?.eventName].steps[
                  currentTooltip?.step
                ].title
              : ''}
          </Text>
          <View style={styles.content}>
            <Text style={styles.text}>
              {currentTooltip
                ? checkedEvents[currentTooltip?.eventName].steps[
                    currentTooltip?.step
                  ].text
                : ''}
            </Text>
            <View style={styles.btns}>
              {prevAction && (
                <NixButton
                  style={styles.btn}
                  title="Prev"
                  type="gray"
                  onPress={prevAction}
                />
              )}
              {nextAction && (
                <NixButton
                  style={styles.btn}
                  title="Next"
                  type="gray"
                  onPress={nextAction}
                />
              )}
              <NixButton
                style={styles.btn}
                title="Finish"
                type="gray"
                onPress={finishAction}
              />
            </View>
          </View>
        </View>
      }
      isVisible={
        !checkedEvents[eventName].value &&
        currentTooltip?.eventName === eventName &&
        currentTooltip?.step === step
      }
      placement={placement || 'bottom'}
      onClose={() => {
        if (onClose) {
          onClose();
        }
      }}
      {...props}>
      {children}
    </Tooltip>
  );
};

export default TooltipView;
