import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  voiceContainer: {
    position: 'relative',
  },
  input: {
    height: 120,
    textAlignVertical: 'top',
  },
  voiceRecognitionControls: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderColor: '#666',
    borderWidth: 1,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceRecognitionControlsIconView: {
    width: 35,
    height: 35,
    padding: 5,
    backgroundColor: Colors.Primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
