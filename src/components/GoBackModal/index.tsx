// utils
import React from 'react';

// components
import {Modal, Text, View} from 'react-native';
import {NixButton} from 'components/NixButton';

// styles
import {styles} from './GoBackModal.styles';

interface GoBackModalProps {
  show: boolean;
  goBack: () => void;
  save: () => void;
  disabled: boolean;
}

const GoBackModal: React.FC<GoBackModalProps> = props => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.show}
      onRequestClose={() => {
        props.save();
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Attention</Text>
            <Text style={styles.modalText}>You have unsaved changes</Text>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Do yoy want to save changes</Text>
            <View style={styles.btns}>
              <View style={[styles.btnContainer, styles.mr10]}>
                <NixButton
                  buttonTextStyles={styles.btnText}
                  title="Save"
                  type="primary"
                  onPress={() => props.save()}
                  disabled={props.disabled}
                />
              </View>
              <View style={styles.btnContainer}>
                <NixButton
                  buttonTextStyles={styles.btnText}
                  title="Discard"
                  type="red"
                  onPress={() => props.goBack()}
                  disabled={props.disabled}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GoBackModal;
