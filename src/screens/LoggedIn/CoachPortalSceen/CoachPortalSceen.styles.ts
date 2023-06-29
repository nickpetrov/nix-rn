import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#fff',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  code: {},
  codeStrong: {
    fontWeight: 'bold',
  },
  disclaimer: {
    color: Colors.Primary,
    fontSize: 10,
  },
  share: {
    borderLeftColor: Colors.Gray4,
    borderLeftWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
  },
  shareIcon: {
    marginRight: 5,
  },
  shareText: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGray,
  },
  input: {
    flex: 6,
    paddingHorizontal: 8,
    paddingVertical: 0,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginRight: 5,
    height: 30,
  },
  patient: {
    padding: 10,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnContainer: {
    paddingHorizontal: 10,
    marginVertical: 50,
  },
});
