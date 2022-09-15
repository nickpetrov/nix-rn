import {StyleSheet} from 'react-native';
import {Colors} from 'constants/Colors';

export const styles = StyleSheet.create({
  mealTitle: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTitleText: {
    fontSize: 12,
    color: '#222',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginRight: 5,
  },
  mealTitleIconWrapper: {
    width: 16,
    height: 16,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  mealTitleIcon: {
    marginTop: -1,
    marginLeft: 1,
  },
  mealDetailsWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 10,
  },
  increasedTouchableArea: {
    marginVertical: -8,
    paddingVertical: 8,
  },
  mealTotalsTouchable: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTotalCalories: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 13,
    minWidth: 40,
    marginLeft: 5,
    textAlign: 'right',
  },
});
