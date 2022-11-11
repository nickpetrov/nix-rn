// utils
import React from 'react';

// components
import {Modal, Text, View, KeyboardAvoidingView, Platform} from 'react-native';
import {NixButton} from 'components/NixButton';

// styles
import {styles} from './ChooseModal.styles';

interface ChooseModalProps {
  modalVisible: boolean;
  hideModal: () => void;
  title?: string;
  text?: string;
  subtitle?: string;
  btns: Array<{
    type: 'gray' | 'primary';
    title: string;
    onPress: () => void;
    disabled?: boolean;
  }>;
  children?: React.ReactNode;
}

const ChooseModal: React.FC<ChooseModalProps> = ({
  modalVisible,
  hideModal,
  title,
  subtitle,
  text,
  btns,
  children,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        hideModal();
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}>
        <View style={styles.modalView}>
          {title && (
            <View style={styles.header}>
              <Text>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          )}
          <View style={styles.content}>
            {text && <Text style={styles.modalText}>{text}</Text>}
            {children && <View>{children}</View>}
            <View style={styles.footer}>
              {btns.map((btn, index: number) => {
                return (
                  <View
                    key={btn.title}
                    style={[styles.btnContainer, index === 0 && styles.mr10]}>
                    <NixButton
                      buttonTextStyles={styles.btnText}
                      title={btn.title}
                      type={btn.type}
                      onPress={btn.onPress}
                      disabled={btn.disabled}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ChooseModal;
