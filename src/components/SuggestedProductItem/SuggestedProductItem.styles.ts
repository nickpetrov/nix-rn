import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGray,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  imageContainer: {
    height: '100%',
    marginRight: 20,
  },
  image: {
    width: 80,
    height: 80,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    marginRight: 10,
  },
  header: {
    fontWeight: 'bold',
  },
  brand: {
    marginBottom: 10,
    color: Colors.Gray8,
    fontSize: 12,
  },
  icon: {
    // width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    lineHeight: 14,
  },
});
