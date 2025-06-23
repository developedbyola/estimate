import { Box, Heading, Safe } from '@/components';
import { Stack } from 'expo-router';
import React from 'react';

const Search = () => {
  return (
    <React.Fragment>
      <Stack.Screen options={{ title: 'Search', headerShown: false }} />
      <Box bg='bg.subtle'>
        <Safe>
          <Box
            px='xl'
            py='3xl'
          >
            <Heading size='4xl'>Search</Heading>
          </Box>
        </Safe>
      </Box>
    </React.Fragment>
  );
};

export default Search;
