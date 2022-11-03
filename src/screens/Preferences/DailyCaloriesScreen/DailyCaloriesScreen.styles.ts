import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    marginVertical: 5,
    padding: 10,
  },
  fields: {
    borderRadius: 10,
    borderColor: Colors.LightGray,
    borderWidth: 1,
  },
  panel: {
    margin: 10,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 10,
  },
  panelHeader: {
    padding: 10,
    borderBottomWidth: 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomColor: '#666',
    backgroundColor: '#eee',
  },
  panelBody: {
    padding: 10,
  },
  recommendedKcal: {
    fontSize: 20,
    marginHorizontal: 20,
    width: '20%',
  },
  hyperlink: {
    marginVertical: 3,
    color: '#00f',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    textDecorationColor: '#0000ff',
  },
  input: {},
  question: {
    padding: 5,
  },
});
