import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: Colors.LightGray,
  },
  progressBarContainer: {
    padding: 10,
  },
  progressBarTitle: {
    textAlign: 'right',
    fontSize: 12,
    marginBottom: 10,
  },
  progressBarItem: {},
  progressBarItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  redText: {
    color: Colors.Red,
  },
  redBg: {
    backgroundColor: Colors.Red,
  },
  progressbar: {
    height: 8,
    width: '100%',
    backgroundColor: '#f5f5f5',
    shadowColor: 'rgba(0,0,0,.1)',
    shadowOffset: {width: -1, height: 0},
    elevation: 4,
    marginVertical: 5,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  itemLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemLabelSquare: {
    width: 12,
    height: 10,
    marginRight: 5,
  },
  itemLabelList: {
    marginTop: 10,
  },
  itemLabelText: {
    fontSize: 13,
  },
});
