import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
  },
  title: {
    fontWeight: 'bold',
  },
  section: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#ccc',
    borderWidth: 1,
    borderTopWidth: 0,
  },
  textEmphasized: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  picker: {
    width: '100%',
    minWidth: '100%',
  },
  lineChart: {
    marginVertical: 8,
    borderRadius: 16,
    marginLeft: -10,
  },
  footer: {
    justifyContent: 'center',
    flex: 1,
    paddingBottom: 10,
  },
  footerText: {
    textAlign: 'center',
  },
});
