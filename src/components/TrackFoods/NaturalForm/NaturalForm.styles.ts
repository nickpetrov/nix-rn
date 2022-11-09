import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 8,
  },
  voiceInput: {
    borderWidth: 1,
    borderColor: Colors.LightGray,
    borderRadius: 4,
    minHeight: 100,
  },
  btnContainer: {
    marginBottom: 8,
    marginTop: 10,
  },
  footer: {
    marginTop: 20,
    marginLeft: 10,
  },
  footerTitle: {
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 10,
  },
  footerText: {
    marginBottom: 8,
  },
  addIcon: {
    position: 'relative',
    fontSize: 18,
    alignSelf: 'center',
    marginRight: 5,
  },
  disclaymore: {
    padding: 8,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  },
  disclaymoreText: {
    fontSize: 10,
    color: '#444',
    lineHeight: 18,
  },
  disclaymoreLink: {
    color: Colors.Info,
    textDecorationLine: 'underline',
  },
  disclaymoreFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disclaymoreCheckbox: {
    marginTop: 5,
  },
  disclaymoreClose: {
    color: Colors.Red,
  },
});
