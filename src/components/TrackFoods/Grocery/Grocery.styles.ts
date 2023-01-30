import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 8,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
  },
  input: {
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginBottom: 8,
    height: 34,
  },
  rootModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalText: {
    padding: 20,
    borderRadius: 5,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
});
