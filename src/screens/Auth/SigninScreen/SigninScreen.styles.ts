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
    marginBottom: 30,
    marginTop: 10,
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
    width: '100%',
  },
  forgotContainer: {
    flex: 1,
    width: '100%',
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  forgotText: {
    fontSize: 14,
    textAlign: 'right',
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
    width: '100%',
  },
});
