import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  excerciseModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  excerciseContainer: {
    width: '60%',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  excerciseModalHeader: {
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    backgroundColor: '#fff',
  },
  excerciseModalMain: {
    backgroundColor: '#fff',
    padding: 10,
  },
  excerciseModalInput: {
    backgroundColor: '#ccc',
  },
  excerciseModalButtons: {
    flexDirection: 'row',
  },
});
