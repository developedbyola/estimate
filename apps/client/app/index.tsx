import React from 'react';
import { MotiImage } from 'moti';
import { trpc } from '@/lib/trpc';
import { Button } from 'react-native';
import { Auth } from '@/features/auth';
import { Border, Space } from '@/constants';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
  Action,
  Heading,
  Box,
  Text,
  Safe,
  Overlay,
  useAuth,
  Blur,
} from '@/components';

const images = [
  {
    uri: 'https://cdn.pixabay.com/photo/2017/03/31/07/09/wheat-2190554_640.jpg',
    rotate: -16,
    y: 16,
  },
  {
    uri: 'https://cdn.pixabay.com/photo/2021/11/04/18/26/smartphone-6769019_640.jpg',
    rotate: 0,
    y: 0,
  },
  {
    uri: 'https://cdn.pixabay.com/photo/2013/06/10/16/04/parsley-126155_640.jpg',
    rotate: 16,
    y: 16,
  },
];

const Footer = () => {
  const router = useRouter();
  const { auth } = useAuth();

  if (auth.isAuthenticated) {
    return (
      <Box px='xl'>
        <Blur
          px='lg'
          py='base'
          bg='foreground'
          style={{
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: Border.radius.xl,
          }}
        >
          <Box style={{ flex: 1 }}>
            <Heading
              size='base'
              leading='base'
            >
              You're signed in
            </Heading>
            <Text
              size='sm'
              leading='sm'
            >
              You can now explore the app
            </Text>
          </Box>
          <Action.Root
            size='sm'
            onPress={() => router.push('/[app]')}
          >
            <Action.Label>Explore</Action.Label>
          </Action.Root>
        </Blur>
      </Box>
    );
  }

  return (
    <Box
      px='xl'
      mx='auto'
      style={{ gap: Space.xs, width: '100%', maxWidth: 320 }}
    >
      <Action.Root>
        <Action.Label>Create account</Action.Label>
      </Action.Root>
      <Action.Root variant='ghost'>
        <Action.Label>Sign in</Action.Label>
      </Action.Root>
    </Box>
  );
};

const Index = () => {
  const Colors = useThemeColors();
  const healthQuery = trpc.system.health.useQuery();

  return (
    <Box
      bg='background'
      style={{ flex: 1 }}
    >
      <Stack.Screen
        name='index'
        options={{
          title: 'Onboard',
          headerShown: false,
        }}
      />

      {/* status bar */}
      <StatusBar style='dark' />
      <Safe style={{ flex: 1 }}>
        <Box
          my='xl'
          px='xl'
        >
          <Overlay.Root>
            <Overlay.Trigger>
              <Button title='Sign in as Guest' />
            </Overlay.Trigger>
            <Overlay.Modal>
              <Heading>Hello world</Heading>
            </Overlay.Modal>
          </Overlay.Root>
        </Box>

        <Box
          px='xl'
          my='5xl'
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          {images.map((image, index) => {
            return (
              <MotiImage
                key={index}
                delay={index + 1 * 100}
                from={{ scale: 0, translateY: 0, rotate: '0deg' }}
                animate={{
                  scale: 1,
                  translateY: image.y,
                  rotate: `${image.rotate}deg`,
                }}
                transition={{
                  duration: 500,
                }}
                source={{ uri: image.uri }}
                style={{
                  width: 96,
                  zIndex: index,
                  aspectRatio: '3/4',
                  borderRadius: Border.radius['2xl'],
                  backgroundColor: Colors.others.foreground,
                }}
              />
            );
          })}
        </Box>

        <Box
          px='xl'
          style={{ gap: Space.lg, flex: 1 }}
        >
          <Heading
            size='4xl'
            leading='2xl'
            weight='bold'
            align='center'
            style={{
              maxWidth: 240,
              marginInline: 'auto',
            }}
          >
            Farm better. Estimate smart.
          </Heading>
          <Text
            size='xl'
            leading='lg'
            style={{
              maxWidth: 320,
              textAlign: 'center',
              marginInline: 'auto',
            }}
          >
            Every stage of your farming journey, calculated — plan smarter,
            spend wiser, earn more.
          </Text>
        </Box>

        <Footer />
      </Safe>
    </Box>
  );
};

export default Index;
