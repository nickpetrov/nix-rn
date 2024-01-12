import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  keyboardView: {
    flexGrow: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  loginWrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  logo: {
    width: '60%',
    height: 100,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 18,
    color: '#999',
    marginBottom: 10,
    marginTop: 10,
  },
  formikRoot: {
    flex: 1,
  },
  inputs: {
    borderWidth: 1,
    borderColor: Colors.LightGray,
  },
  inputRoot: {
    paddingHorizontal: 10,
  },
  inputRootWithoutBorder: {
    borderBottomWidth: 0,
  },
  validationError: {
    color: 'red',
    marginVertical: 15,
  },
  emailField: {
    marginRight: 15,
    marginBottom: 2,
    color: '#666',
  },
  passField: {
    marginRight: 17,
    marginBottom: 2,
    marginLeft: 6,
    color: '#666',
  },
  btns: {
    flex: 1,
  },
  forgotContainer: {
    flex: 1,
    width: '100%',
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  forgotText: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
  webViewContainer: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  webView: {
    flex: 1,
    // says it's prevent crush when navigate from page with webview
    opacity: 0.99,
    overflow: 'hidden',
  },
  backBtn: {
    backgroundColor: Colors.BgGray,
    paddingVertical: 5,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
  },
  backBtnIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  testView: {
    padding: 10,
  },
  testInput: {
    borderWidth: 1,
    borderColor: Colors.LightGray,
  },
});
