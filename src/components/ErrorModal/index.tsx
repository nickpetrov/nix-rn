// utils
import React from 'react';

// components
import {Modal, Text, View} from 'react-native';
import {NixButton} from 'components/NixButton';
import {styles} from './ErrorModal.styles';

interface ErrorModalProps {
  modalVisible: boolean;
  setModalVisible: (v: false) => void;
  text: string;
}

const ErrorModal: React.FC<ErrorModalProps> = props => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        props.setModalVisible(false);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{props.text}</Text>
          <View style={styles.btnContainer}>
            <NixButton
              title="Ok"
              type="primary"
              onPress={() => props.setModalVisible(false)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ErrorModal;
