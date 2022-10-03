import {StyleSheet} from 'react-native';
import {Colors} from 'constants/Colors';

export const styles = StyleSheet.create({
  foodItem: {
    width: '100%',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  caloriesValue: {
    color: Colors.Primary,
    fontSize: 18,
  },
  caloriesLabel: {
    color: '#aaa',
  },
  foodThumb: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  servingWrapper: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  qty_input: {
    marginRight: 10,
    paddingVertical: 1,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    width: 40,
    maxWidth: 40,
    textAlign: 'center',
  },
  serving_select: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flexGrow: 2,
    width: '100%',
  },
  foodName: {
    textTransform: 'capitalize',
  },
  main: {
    flex: 5,
    marginRight: 10,
  },
  pickerContainer: {
    flexGrow: 1,
  },
  picker: {
    flex: 1,
  },
  footer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  calories: {
    alignItems: 'center',
    marginLeft: 10,
  },
});
