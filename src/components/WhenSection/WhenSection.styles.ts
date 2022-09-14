import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    width: '100%',
    flexGrow: 1,
    backgroundColor: '#fff',
    borderColor: '#bbb',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  date: {
    fontSize: 16,
  },
  controlsWrapper: {
    marginTop: 16,
  },
  mealTypeWrapper: {
    borderRadius: 8,
    borderColor: '#bbb',
    borderWidth: 1,
    backgroundColor: '#eee',
  },
  controlsRow: {
    flexDirection: 'row',
  },
  mealTypeButton: {
    width: '33.33333%',
    borderRightWidth: 1,
    borderColor: '#bbb',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateWrapper: {
    marginTop: 16,
    borderRadius: 8,
    borderColor: '#bbb',
    borderWidth: 1,
    flexDirection: 'row',
    backgroundColor: '#eee',
  },
  dateButton: {
    padding: 8,
    width: '33.3333333%',
    borderRightWidth: 1,
    borderColor: '#bbb',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
