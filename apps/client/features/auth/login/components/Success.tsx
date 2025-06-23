import React from 'react';
import { useRedirect } from '@/hooks/useRedirect';
import { ActivityIndicator, Box, Text, useOverlayContext } from '@/components';

const Success = () => {
  const overlayContext = useOverlayContext();

  useRedirect('/app', {
    delay: 3000,
    condition: true,
    onComplete: () => overlayContext.onOpenChange(false),
  });

  return (
    <React.Fragment>
      <Box
        px='xl'
        my='5xl'
        style={{ justifyContent: 'center', flex: 1 }}
      >
        <ActivityIndicator />
      </Box>
      <Box
        px='lg'
        pb='6xl'
        mx='auto'
        style={{ maxWidth: 320, width: '100%' }}
      >
        <Text
          size='sm'
          leading='sm'
          align='center'
        >
          We’ve verified it’s really you. Everything’s locked down tight, so you
          can browse with peace of mind. Happy exploring!
        </Text>
      </Box>
    </React.Fragment>
  );
};

export default Success;
