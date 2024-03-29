// utils
import React from 'react';

// components
import {Modal, Text, View} from 'react-native';
import {NixButton} from 'components/NixButton';
import {styles} from './InfoModal.styles';

interface InfoModalProps {
  modalVisible: boolean;
  setModalVisible: () => void;
  text?: string;
  title?: string;
  subtitle?: string;
  btn?: {
    title: string;
    type: 'blue' | 'positive' | 'gray' | 'primary';
  };
  children?: React.ReactNode;
  loadingType?: boolean;
}

const InfoModal: React.FC<InfoModalProps> = ({
  modalVisible,
  setModalVisible,
  text,
  title,
  subtitle,
  btn,
  children,
  loadingType,
}) => {
  return (
    <>
      {loadingType ? (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible();
          }}>
          <View style={styles.loadingRoot}>
            <View style={styles.loadingView}>
              {text && <Text style={styles.loadingText}>{text}</Text>}
              {children && children}
            </View>
          </View>
        </Modal>
      ) : (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible();
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {title && (
                <View style={styles.header}>
                  <Text style={styles.title}>{title}</Text>
                  {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
              )}
              <View style={styles.content}>
                {text && <Text style={styles.modalText}>{text}</Text>}
                {children && children}
                <View style={styles.btnContainer}>
                  <NixButton
                    title={btn?.title ? btn.title : 'Ok'}
                    type={btn?.type ? btn.type : 'primary'}
                    onPress={() => setModalVisible()}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default InfoModal;
