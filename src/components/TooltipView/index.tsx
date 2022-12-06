import React from 'react';
import {Text, View, Platform, StatusBar} from 'react-native';
import Tooltip, {TooltipProps as Props} from 'react-native-walkthrough-tooltip';
import {ReactNode} from 'react';
import {styles} from './TooltipView.styles';
import {NixButton} from 'components/NixButton';

declare module 'react-native-walkthrough-tooltip' {
  export interface TooltipProps {
    children: ReactNode;
  }
}

interface TooltipViewProps extends Props {
  children: React.ReactNode;
  onClose?: () => void;
  placement?: 'bottom' | 'top' | 'left' | 'right' | 'center';
  isVisible: boolean;
  title: string;
  text: string;
  prevAction?: () => void;
  nextAction?: () => void;
  finishAction: () => void;
}

const TooltipView: React.FC<TooltipViewProps> = ({
  isVisible,
  placement,
  onClose,
  title,
  prevAction,
  nextAction,
  finishAction,
  text,
  children,
  ...props
}) => {
  return (
    <Tooltip
      isVisible={isVisible}
      topAdjustment={
        Platform.OS === 'android' ? -(StatusBar?.currentHeight || 0) : 0
      }
      contentStyle={styles.tooltip}
      content={
        <View>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.content}>
            <Text style={styles.text}>{text}</Text>
            <View style={styles.btns}>
              {prevAction && (
                <NixButton
                  style={styles.btn}
                  title="< Prev"
                  type="gray"
                  onPress={prevAction}
                />
              )}
              {nextAction && (
                <NixButton
                  style={styles.btn}
                  title="Next >"
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
