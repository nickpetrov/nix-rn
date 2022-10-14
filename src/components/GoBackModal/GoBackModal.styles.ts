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
    width: '60%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    padding: 15,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
  },
  modalTitle: {
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 12,
  },
  footer: {
    padding: 15,
  },
  footerText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  btns: {
    flexDirection: 'row',
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
});
