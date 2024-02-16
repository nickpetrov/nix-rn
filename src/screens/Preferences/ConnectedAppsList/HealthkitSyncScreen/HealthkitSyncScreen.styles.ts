import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.LightGray,
    borderRadius: 4,
  },
  footer: {
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden',
    borderColor: Colors.LightGray,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    backgroundColor: '#fff',
    elevation: 2,
  },
  footerHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Colors.BgGray,
  },
  footerContent: {
    padding: 10,
    paddingBottom: 15,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    fontWeight: 'bold',
  },
  webView: {
    width: '100%',
    flex: 1,
  },
  selectIcon: {
    color: Colors.Secondary,
    alignSelf: 'center',
    marginLeft: 10,
    top: -2,
  },
  labelContainerStyle: {
    paddingHorizontal: 0,
  },
  mt20: {
    marginTop: 20,
  },
  initValueTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  selectedItemTextStyle: {
    fontSize: 16,
    color: Colors.Info,
    fontWeight: '500',
  }
});
