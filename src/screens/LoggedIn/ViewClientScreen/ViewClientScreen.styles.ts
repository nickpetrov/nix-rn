import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mail: {
    height: 40,
    width: 40,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  months: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  monthText: {
    paddingHorizontal: 10,
    color: '#bbb',
  },
  activeMonth: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeMonthText: {
    marginHorizontal: 10,
  },
  empty: {
    padding: 15,
    textAlign: 'center',
    borderTopColor: Colors.LightGray,
    borderTopWidth: 1,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
  },
  totalItem: {
    marginBottom: 10,
  },
  totalItemTitle: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  stats: {
    backgroundColor: Colors.Highlight,
  },
});
