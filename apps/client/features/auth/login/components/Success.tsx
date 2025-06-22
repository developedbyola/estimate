import React from 'react';
import { trpc } from '@/lib/trpc';
import { Alert } from 'react-native';
import { useRedirect } from '@/hooks/useRedirect';
import { ActivityIndicator, Box, Text, useOverlayContext } from '@/components';

const Success = () => {
  const me = trpc.auth.me.useQuery();
  const overlayContext = useOverlayContext();

  const addDevice = trpc.sessions.addDevice.useMutation({
    onError: (error) => {
      Alert.alert('Error adding device', error.message, [
        { text: 'Cancel' },
        {
          text: 'Retry',
          isPreferred: true,
          onPress: () => addDevice.mutate(),
        },
      ]);
    },
  });

  useRedirect('/app', {
    condition: me.isSuccess && addDevice.isSuccess,
    onComplete: () => overlayContext.onOpenChange(false),
  });

  React.useEffect(() => {
    if (me.isSuccess) {
      addDevice.mutate();
    }
    if (me.isError) {
      Alert.alert('Error loading profile', me.error.message, [
        { text: 'Cancel' },
        { text: 'Retry', isPreferred: true, onPress: () => me.refetch() },
      ]);
    }
  }, [me.isSuccess, me.isError]);

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
