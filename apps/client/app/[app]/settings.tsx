import { Box, Heading, Logo, Safe, Text } from '@/components';
import { Border, Space } from '@/constants';
import { Currency, useCurrencyContext } from '@/features/currency';
import SettingsFeature from '@/features/settings';
import { Stack } from 'expo-router';
import React from 'react';
import { Button, ImageBackground } from 'react-native';

const Settings = () => {
  const { currency } = useCurrencyContext();

  return (
    <React.Fragment>
      <Stack.Screen options={{ title: 'Settings', headerShown: false }} />
      <Safe
        bg='background'
        style={{ flex: 1 }}
      >
        <Box
          px='xl'
          py='5xl'
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Heading
            size='3xl'
            leading='xl'
          >
            Settings
          </Heading>
          <Currency.Switch>
            <Button title={`${currency.name} ${currency.symbol}`} />
          </Currency.Switch>
        </Box>

        <Box
          px='xl'
          style={{ gap: Space.lg, flexDirection: 'row', alignItems: 'center' }}
        >
          <ImageBackground
            style={{
              width: 48,
              aspectRatio: '1/1',
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: Border.radius.full,
            }}
            source={{
              uri: 'https://cdn.pixabay.com/photo/2016/11/05/12/38/fuzzy-1800136_640.jpg',
            }}
          >
            <Heading
              size='2xl'
              leading='lg'
              color='inverted'
              weight='medium'
            >
              Ae
            </Heading>
          </ImageBackground>
          <Heading
            size='2xl'
            leading='xl'
            align='center'
            weight='medium'
          >
            Adeleke Esther
          </Heading>
        </Box>

        <Box
          px='xl'
          my='2xl'
          style={{ flex: 1 }}
        >
          <SettingsFeature />
        </Box>

        <Box
          pb='9xl'
          style={{ gap: Space['2xl'] }}
        >
          <Logo
            style={{ marginInline: 'auto' }}
            type='full'
            ext='svg'
          />
          <Text
            size='lg'
            align='center'
            color={'muted'}
            leading='base'
            style={{ maxWidth: 200, marginInline: 'auto' }}
          >
            Estimate is a platform for agricultural cost estimation
          </Text>
        </Box>
      </Safe>
    </React.Fragment>
  );
};

export default Settings;
