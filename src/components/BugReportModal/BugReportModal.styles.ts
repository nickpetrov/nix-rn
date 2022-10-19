import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    maxWidth: '70%',
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  content: {
    padding: 15,
  },
  header: {
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGray,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  btnContainer: {
    flex: 1,
  },
  btnText: {
    fontSize: 18,
  },
  mr10: {
    marginRight: 10,
  },
  input: {
    backgroundColor: '#f5f5f5',
    height: 100,
    textAlignVertical: 'top',
  },
});
