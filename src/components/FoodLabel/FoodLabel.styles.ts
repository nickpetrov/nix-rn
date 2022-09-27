import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: '#666',
    padding: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  topRow: {
    borderTopWidth: 10,
    borderBottomWidth: 5,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  column: {
    paddingVertical: 2,
    flexDirection: 'row',
  },
  text: {
    fontSize: 12,
  },
  textItalic: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  textBold: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  ml10: {
    marginLeft: 10,
  },
  info: {
    fontSize: 12,
    paddingTop: 5,
    color: '#666',
  },
  borderBotW: {
    borderBottomWidth: 10,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
});
