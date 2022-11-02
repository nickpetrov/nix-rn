import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    borderWidth: 1,
    borderColor: Colors.LightGray,
    borderRadius: 10,
    overflow: 'hidden',
  },
  titleContainer: {
    backgroundColor: Colors.Highlight,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 2,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
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
    borderColor: Colors.LightGray,
    borderWidth: 1,
    borderTopWidth: 0,
  },
  chartContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderColor: Colors.LightGray,
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
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
  },
  labelTitle: {
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '800',
  },
  labelNote: {
    textAlign: 'center',
    fontSize: 10,
    textTransform: 'uppercase',
    color: Colors.Secondary,
  },
  labelIcon: {
    fontSize: 12,
  },
});
