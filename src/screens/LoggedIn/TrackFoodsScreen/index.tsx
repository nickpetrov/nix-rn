// utils
import React, {useState} from 'react';

// components
import {View, Text, TouchableWithoutFeedback} from 'react-native';

import Footer from 'components/Footer';
import Grocery from 'components/TrackFoods/Grocery';
import NaturalForm from 'components/TrackFoods/NaturalForm';
import Restaurants from 'components/TrackFoods/Restaurants/intex';
import History from 'components/TrackFoods/History';

// styles
import {styles} from './TrackFoodsScreen.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

interface TrackFoodsScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.TrackFoods
  >;
}

export const TrackFoodsScreen: React.FC<TrackFoodsScreenProps> = ({
  navigation,
}) => {
  const [activeTab, setActiveTab] = useState('Freeform');

  const changeActiveTab = (tabName: string) => {
    if (activeTab !== tabName) {
      setActiveTab(tabName);
    }
  };

  const getActiveTabColor = (tabToCheck: string) => {
    return activeTab === tabToCheck ? '#fff' : '#eee';
  };

  return (
    <View style={styles.layout}>
      <View style={styles.container}>
        <View style={styles.tabs}>
          <TouchableWithoutFeedback
            onPress={() => {
              changeActiveTab('Freeform');
            }}>
            <View
              style={{
                ...styles.tab,
                backgroundColor: getActiveTabColor('Freeform'),
              }}>
              <Text>Freeform</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              changeActiveTab('Restaurants');
            }}>
            <View
              style={{
                ...styles.tab,
                backgroundColor: getActiveTabColor('Restaurants'),
              }}>
              <Text>Restaurants</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              changeActiveTab('Grocery');
            }}>
            <View
              style={{
                ...styles.tab,
                backgroundColor: getActiveTabColor('Grocery'),
              }}>
              <Text>Grocery</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              changeActiveTab('History');
            }}>
            <View
              style={{
                ...styles.tab,
                backgroundColor: getActiveTabColor('History'),
              }}>
              <Text>History</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {activeTab === 'Freeform' ? (
          <NaturalForm navigation={navigation} />
        ) : activeTab === 'Restaurants' ? (
          <Restaurants navigation={navigation} />
        ) : activeTab === 'Grocery' ? (
          <Grocery navigation={navigation} />
        ) : (
          <History navigation={navigation} />
        )}
      </View>
      <Footer hide={false} navigation={navigation} style={styles.footer} />
    </View>
  );
};
