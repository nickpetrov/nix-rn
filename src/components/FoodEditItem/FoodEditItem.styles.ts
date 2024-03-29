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
    textAlign: 'right',
  },
  caloriesLabel: {
    color: '#aaa',
  },
  imageContainer: {
    flexGrow: 1,
    maxWidth: 45,
  },
  foodThumb: {
    width: 40,
    height: 40,
    marginRight: 5,
  },
  servingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    flexGrow: 1,
  },
  qty_input: {
    marginRight: 5,
    paddingVertical: 5,
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 40,
    width: 40,
    maxWidth: 40,
    textAlign: 'center',
  },
  serving_select: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nameContainer: {},
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
    maxWidth: '80%',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginRight: 10,
  },
  pickerContainer: {
    flexBasis: 'auto',
    flexGrow: 1,
    flexShrink: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerText: {
    width: '100%',
    paddingLeft: 5,
    alignSelf: 'flex-start',
    textAlign: 'left',
    color: Colors.Gray8,
  },
  picker: {
    flexGrow: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: 40,
  },
  footer: {
    minWidth: '20%',
    maxWidth: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  info: {
    position: 'absolute',
    left: 0,
  },
  calories: {
    flex: 1,
  },
  cal: {
    textAlign: 'right',
    fontSize: 12,
    color: Colors.Gray8,
  },
});
