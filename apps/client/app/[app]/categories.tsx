import React from 'react';
import { Stack } from 'expo-router';
import { Categories } from '@/features/categories';
import { Box, Heading, Safe, Scroll } from '@/components';

const CategoriesPage = () => {
  return (
    <React.Fragment>
      <Stack.Screen options={{ title: 'Categories', headerShown: false }} />
      <Safe
        bg='bg.soft'
        style={{ flex: 1 }}
      >
        <Box
          px='xl'
          mt='5xl'
        >
          <Heading size='4xl'>Categories</Heading>
        </Box>

        <Scroll
          px='xl'
          style={{ flex: 1, overflow: 'hidden' }}
        >
          <Box py='xl' />
          <Categories.List />
        </Scroll>
      </Safe>
    </React.Fragment>
  );
};

export default CategoriesPage;
