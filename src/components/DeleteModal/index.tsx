// utils
import React from 'react';

// components
import {Modal, Text, View} from 'react-native';
import {NixButton} from 'components/NixButton';

// styles
import {styles} from './DeleteModal.styles';

interface DeleteModalProps {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  title?: string;
  text?: string;
  delete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = props => {
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
          {props.title && <Text style={styles.modalTitle}>{props.title}</Text>}
          {props.text && <Text style={styles.modalText}>{props.text}</Text>}
          <View style={styles.footer}>
            <View style={[styles.btnContainer, styles.mr10]}>
              <NixButton
                buttonTextStyles={styles.btnText}
                title="Cancel"
                type="gray"
                onPress={() => props.setModalVisible(false)}
              />
            </View>
            <View style={styles.btnContainer}>
              <NixButton
                buttonTextStyles={styles.btnText}
                title="Yes"
                type="primary"
                onPress={() => props.delete()}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;
