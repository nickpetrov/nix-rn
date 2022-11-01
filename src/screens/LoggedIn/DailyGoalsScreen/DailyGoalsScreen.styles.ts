import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
  },
  item: {
    height: 60,
  },
  input: {
    borderColor: '#d7d7d7',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    height: 40,
    width: 150,
    maxWidth: 150,
  },
  itemValue: {
    width: '20%',
    textAlign: 'right',
  },
  unit: {
    width: '30%',
    color: '#000',
  },
  smallUnit: {
    width: '10%',
  },
  labelContainerStyle: {
    width: '50%',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    textAlign: 'right',
    fontWeight: '500',
    fontSize: 16,
  },
  icon: {
    marginRight: 15,
    marginBottom: 2,
    color: '#666',
  },
  footer: {
    marginVertical: 10,
    marginHorizontal: 8,
  },
  question: {
    padding: 5,
  },
  errorView: {
    padding: 10,
  },
  error: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: Colors.Red,
  },
});
