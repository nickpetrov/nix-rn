import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    padding: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pickerContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#666',
    margin: 10,
    padding: 5,
    borderRadius: 10,
  },
  picker: {
    flex: 1,
  },
  label: {
    marginHorizontal: 10,
  },
  footer: {
    padding: 10,
    marginTop: 20,
  },
  footerText: {
    fontWeight: 'bold',
  },
  webView: {
    width: '100%',
    flex: 1,
  },
});
