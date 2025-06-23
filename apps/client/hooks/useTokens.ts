import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useDeleteAccessToken = () => {
  React.useEffect(() => {
    const deleteAccessToken = async () => {
      await AsyncStorage.removeItem('access_token');
    };

    deleteAccessToken();
  }, []);
};
