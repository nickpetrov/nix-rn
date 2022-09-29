import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  loginWrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flexGrow: 1,
    width: '100%',
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
    color: '#000',
    marginBottom: 30,
    marginTop: 10,
  },
  inputWrapper: {
    marginHorizontal: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  input: {},
  validationError: {
    color: 'red',
    marginVertical: 15,
  },
  link: {
    color: Colors.Info,
  },
});
