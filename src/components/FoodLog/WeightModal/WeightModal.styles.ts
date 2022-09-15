import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  weightModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  weightContainer: {
    width: '60%',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  weightModalHeader: {
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    backgroundColor: '#fff',
  },
  weightModalMain: {
    backgroundColor: '#fff',
    padding: 10,
  },
  weightModalInput: {
    width: '100%',
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginBottom: 8,
    color: '#444',
  },
  weightModalButtons: {
    flexDirection: 'row',
  },
});
