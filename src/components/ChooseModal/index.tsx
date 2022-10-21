// utils
import React from 'react';

// components
import {Modal, Text, View} from 'react-native';
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
  }>;
}

const ChooseModal: React.FC<ChooseModalProps> = ({
  modalVisible,
  hideModal,
  title,
  subtitle,
  text,
  btns,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        hideModal();
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {title && (
            <View style={styles.header}>
              <Text>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          )}
          <View style={styles.content}>
            {text && <Text style={styles.modalText}>{text}</Text>}
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
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChooseModal;
