import React from 'react';
import { Stack } from 'expo-router';
import { Categories } from '@/features/categories';
import { Box, Heading, Safe, Scroll } from '@/components';

const CategoriesPage = () => {
  return (
    <React.Fragment>
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
          mt='5xl'
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Categories.List />
        </Scroll>
      </Safe>
    </React.Fragment>
  );
};

export default CategoriesPage;
