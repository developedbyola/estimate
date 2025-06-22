import React from 'react';
import { useRedirect } from '@/hooks/useRedirect';
import {
  ActivityIndicator,
  Box,
  Text,
  useOverlayContext,
  // useFlowContext,
} from '@/components';
import { trpc } from '@/lib/trpc';

const Success = () => {
  const overlayContext = useOverlayContext();
  // const flowContext = useFlowContext();
  const login = trpc.auth.login.useMutation();

  useRedirect('/app', {
    delay: 2000,
    condition: true,
    onComplete: () => {
      overlayContext.onOpenChange(false);
    },
  });

  return (
    <Box
      px='xl'
      my='5xl'
      style={{ justifyContent: 'space-between', flex: 1 }}
    >
      <ActivityIndicator size={'large'} />
      <Box py='xl' />
      <Box py='sm' />
      <Text
        size='sm'
        align='center'
        leading='sm'
        style={{
          maxWidth: 320,
          marginInline: 'auto',
        }}
      >
        You're in! Getting your estimates ready. You’ll be redirected to your
        dashboard shortly.
      </Text>
    </Box>
  );
};

export default Success;
