import {StyleSheet} from 'react-native';
import {Colors} from 'constants/Colors';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
  },
  waterModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  waterContainer: {
    width: '60%',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  content: {
    justifyContent: 'space-between',
    padding: 10,
  },
  waterModalHeader: {
    alignItems: 'center',
    borderTopEndRadius: 10,
    borderTopLeftRadius: 10,
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    backgroundColor: '#fff',
  },
  common: {
    paddingVertical: 10,
  },
  commonTitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  commonList: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commonBuble: {
    padding: 5,
    backgroundColor: Colors.LightGray,
    borderRadius: 20,
    width: '22%',
  },
  commonBubleText: {
    textAlign: 'center',
    fontSize: 12,
  },
  column: {
    // width: '100%',
    paddingTop: 10,
  },
  row: {
    // width: '100%',
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  input: {
    textAlign: 'center',
    width: 60,
    height: 40,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: Colors.LightGray,
  },
  totalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  borderTop: {
    borderTopColor: '#000',
    borderTopWidth: 1,
  },
  mt20: {
    marginTop: 20,
  },
  footer: {
    height: 40,
  },
});
