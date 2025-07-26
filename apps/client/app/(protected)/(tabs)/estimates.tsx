import React from 'react';
import { Box, Heading, Safe, Text } from '@/components';

const EstimatesPage = () => {
  return (
    <React.Fragment>
      <Safe
        bg='bg.base'
        style={{ flex: 1 }}
      >
        <Box
          px='xl'
          mt='5xl'
          style={{ gap: 8 }}
        >
          <Heading
            style={{ fontSize: 40, fontWeight: '600', letterSpacing: -0.5 }}
          >
            Estimates
          </Heading>
          <Text
            color='text.soft'
            style={{ fontSize: 18, fontWeight: '500' }}
          >
            Track your farm expenses and income with ease.
          </Text>
        </Box>

        <Box px='xl'></Box>
      </Safe>
    </React.Fragment>
  );
};

export default EstimatesPage;
