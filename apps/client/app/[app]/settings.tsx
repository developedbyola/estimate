import React from 'react';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { excerpt } from '@/utils/excerpt';
import { Border, Space } from '@/constants';
import SettingsFeature from '@/features/settings';
import { Box, Heading, Safe, Text, useUser } from '@/components';

const Settings = () => {
  const { user } = useUser();

  return (
    <React.Fragment>
      <Stack.Screen options={{ title: 'Settings', headerShown: false }} />
      <Safe
        bg='bg.subtle'
        style={{ flex: 1 }}
      >
        <Box
          mt='6xl'
          px='xl'
          style={{
            gap: Space.xl,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            style={{
              width: 56,
              aspectRatio: '1/1',
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: Border.radius.full,
            }}
            source={require('@/assets/images/avatars/default.png')}
          />

          <Heading
            size='2xl'
            leading='xl'
            align='left'
            weight='medium'
            style={{ flex: 1, textTransform: 'capitalize' }}
          >
            {excerpt(user?.name || 'Guest', 5)}
          </Heading>
        </Box>

        <Box
          px='xl'
          my='4xl'
          style={{ flex: 1 }}
        >
          <SettingsFeature />
        </Box>
      </Safe>
    </React.Fragment>
  );
};

export default Settings;
