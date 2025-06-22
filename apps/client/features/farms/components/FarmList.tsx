import React from 'react';
import { FlatList } from 'react-native';
import Farms from '../constants/Farms';
import Farm from './Farm';

const FarmList = () => {
  return (
    <FlatList
      data={Farms}
      scrollEnabled
      numColumns={2}
      style={{ gap: 12 }}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <Farm
          farm={item}
          key={item.id}
        />
      )}
    >
      {Farms.map((farm, index) => {
        return (
          <Farm
            farm={farm}
            key={index}
          />
        );
      })}
    </FlatList>
  );
};

export default FarmList;
