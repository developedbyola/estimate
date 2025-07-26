import { Box, Heading, Safe } from '@/components';
import React from 'react';

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
        >
          <Heading
            style={{ fontSize: 40, fontWeight: '600', letterSpacing: -0.5 }}
          >
            Estimates
          </Heading>
        </Box>
      </Safe>
    </React.Fragment>
  );
};

export default EstimatesPage;
