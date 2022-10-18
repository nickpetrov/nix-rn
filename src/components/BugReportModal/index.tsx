// utils
import React, {useState} from 'react';

// api
import baseService from 'api/baseService';

// components
import {Modal, Text, View, TextInput} from 'react-native';
import {NixButton} from 'components/NixButton';

// hooks
import {useSelector} from 'hooks/useRedux';

// styles
import {styles} from './BugReportModal.styles';
import InfoModal from 'components/InfoModal';

interface BugReportModalProps {
  modalVisible: boolean;
  setModalVisible: () => void;
}

const BugReportModal: React.FC<BugReportModalProps> = ({
  modalVisible,
  setModalVisible,
}) => {
  const foods = useSelector(state => state.basket.foods);
  const deviceInfo = useSelector(state => state.base.deviceInfo);
  const [value, setValue] = useState('');
  const [alert, setAlert] = useState('');

  const handleSendBugReport = () => {
    if (value) {
      setModalVisible();
      const bugReportData = {
        payload: JSON.stringify({foods}),
        metadata:
          '{"version": ' +
          deviceInfo.version +
          ', "device": ' +
          deviceInfo.manufacturer +
          ' ' +
          deviceInfo.model +
          `, "track_version": ${deviceInfo}}`,
        feedback: value,
        type: 1,
      };
      baseService.sendBugReport(bugReportData).then(() => {
        setAlert('success');
        setValue('');
      });
    } else {
      setAlert('error');
      setModalVisible();
    }
  };
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={setModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.header}>
              <Text style={styles.title}>Report a problem</Text>
              <Text style={styles.subtitle}>
                Please describe the issue you are experiencing below
              </Text>
            </View>
            <View style={styles.content}>
              <TextInput
                multiline
                numberOfLines={4}
                value={value}
                style={styles.input}
                onChangeText={setValue}
              />
              <View style={styles.footer}>
                <View style={[styles.btnContainer, styles.mr10]}>
                  <NixButton
                    buttonTextStyles={styles.btnText}
                    title="Cancel"
                    type="gray"
                    onPress={setModalVisible}
                  />
                </View>
                <View style={styles.btnContainer}>
                  <NixButton
                    buttonTextStyles={styles.btnText}
                    title="Send"
                    type="primary"
                    onPress={handleSendBugReport}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <InfoModal
        modalVisible={!!alert}
        setModalVisible={() => {
          setAlert('');
        }}
        text={
          alert === 'success'
            ? 'Thank you for submitting this feedback, we review each and every submission, and we will get back to you if we have any further questions.'
            : 'Unfortunately the message you are trying to submit is empty. Please describe the problem that you want to report.'
        }
        btn={{
          type: 'positive',
          title: alert === 'success' ? 'Close' : 'Ok',
        }}
      />
    </>
  );
};

export default BugReportModal;
