import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
  },
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
    backgroundColor: '#f5f5f5',
  },
  excerciseModalButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  btnContainer: {
    flex: 1,
  },
  mr8: {
    marginRight: 8,
  },
  deleteBtn: {
    padding: 10,
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Delete,
    marginRight: 8,
  },
  recent: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  recentText: {
    color: '#666',
  },
});
