import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
  },
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
    marginTop: 10,
  },
  units: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingBottom: 5,
  },
  flex1: {
    flex: 1,
  },
  mr8: {
    marginRight: 8,
  },
  note: {
    marginHorizontal: 20,
  },
  noteText: {
    fontSize: 10,
    textAlign: 'center',
  },
});
