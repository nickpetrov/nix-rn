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
    padding: 16,
    margin: 10,
    borderRadius: 10,
  },
  picker: {
    width: '100%',
    minWidth: '100%',
  },
  label: {
    flex: 1,
  },
  footer: {
    padding: 10,
    marginTop: 20,
  },
  footerText: {
    fontWeight: 'bold',
  },
});
