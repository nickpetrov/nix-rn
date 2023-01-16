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
  withoutBorder: {
    borderBottomWidth: 0,
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
    alignItems: 'center',
    marginVertical: 6,
    flex: 1,
  },
  qty_input: {
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 38,
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
  foodBrandName: {
    textTransform: 'capitalize',
    fontSize: 12,
    color: Colors.Secondary,
    fontFamily: 'System',
  },
  main: {
    flexGrow: 1,
    marginRight: 10,
  },
  pickerContainer: {
    flexGrow: 1,
    flex: 1,
    justifyContent: 'center',
  },
  pickerText: {
    color: Colors.Gray8,
  },
  picker: {
    flex: 1,
    flexGrow: 1,
  },
  footer: {
    minWidth: '20%',
    width: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  calories: {},
  cal: {
    textAlign: 'right',
    fontSize: 12,
    color: Colors.Gray8,
  },
  between: {
    justifyContent: 'space-between',
  },
});
