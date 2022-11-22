import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  loginWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  scrollView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 0,
    padding: 16,
  },
  logo: {
    width: '50%',
    height: 200,
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
  fbDisclamer: {
    color: '#aaa',
    marginBottom: 12,
    marginTop: 5,
  },
  disclaimerWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  noteText: {
    fontSize: 10,
    color: '#888',
    marginTop: 5,
  },
  highlightText: {
    color: '#68b500',
  },
  appleButton: {
    width: '100%',
    height: 40,
  },
});
