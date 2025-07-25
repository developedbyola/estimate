import React from 'react';
import { MotiImage } from 'moti';
import { Button } from 'react-native';
import { useRouter } from 'expo-router';
import { Border, Space } from '@/constants';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Action, Heading, Box, Text, Safe, Overlay } from '@/components';
// import { useDeleteAccessToken } from '@/hooks/useTokens';

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

const Index = () => {
  const router = useRouter();
  const colors = useThemeColors();

  // useDeleteAccessToken();

  return (
    <Box
      bg='bg.base'
      style={{ flex: 1 }}
    >
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
                  backgroundColor: colors.getColor('bg.subtle'),
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

        <Box
          px='xl'
          style={{ gap: Space.xs }}
        >
          <Action.Root
            size='lg'
            onPress={() => router.push('/register')}
          >
            <Action.Label>Become a member</Action.Label>
          </Action.Root>
          <Action.Root
            size='lg'
            variant='ghost'
            onPress={() => router.push('/login')}
          >
            <Action.Label>Access your account</Action.Label>
          </Action.Root>
        </Box>
      </Safe>
    </Box>
  );
};

export default Index;
