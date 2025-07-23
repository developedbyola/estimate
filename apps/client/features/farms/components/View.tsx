import React from 'react';
import { useRouter } from 'expo-router';
import { Farms } from '@/features/farms';
import { Border, Space } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
  Box,
  Safe,
  Text,
  Action,
  Scroll,
  Heading,
  ActivityIndicator,
} from '@/components';
import { useGetFarm } from '../hooks/useGetFarm';

export const View = () => {
  const router = useRouter();
  const colors = useThemeColors();
  const { status, data: farm } = useGetFarm();

  if (status === 'pending')
    return (
      <Box style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </Box>
    );
  if (!farm) return null;

  return (
    <Scroll style={{ flex: 1 }}>
      <Box px='xl'>
        <Box
          bg='bg.subtle'
          style={{
            height: 88,
            aspectRatio: 1,
            marginInline: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: Border.radius['3xl'],
          }}
        >
          <Text
            size='6xl'
            weight='bold'
            style={{ lineHeight: 56 }}
          >
            {farm.category.icon}
          </Text>
        </Box>

        <Heading
          size='2xl'
          align='center'
          leading='base'
          style={{ maxWidth: 320, marginTop: Space['lg'] }}
        >
          {farm.name}
        </Heading>
        <Text
          align='center'
          leading='base'
          style={{ textTransform: 'capitalize', marginTop: Space['xs'] }}
        >{`${farm.size} ${farm.sizeUnit}`}</Text>
        <Box
          mt='xl'
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: Space['2xl'],
            justifyContent: 'space-between',
          }}
        >
          <Action.Root
            size='2xs'
            hitSlop={24}
            style={{ paddingInline: Space['lg'] }}
          >
            <Action.Label
              size='sm'
              weight='semibold'
              style={{ textTransform: 'uppercase' }}
            >
              update
            </Action.Label>
          </Action.Root>

          <Farms.Delete>
            <Ionicons
              size={26}
              name='close-circle'
              color={colors.getColor('icon.inactive')}
            />
          </Farms.Delete>
        </Box>
      </Box>

      <Box
        my='2xl'
        bg='bg.inactive'
        style={{ height: 1 }}
      />

      <Box px='xl'>
        <Heading
          size='base'
          leading='sm'
          weight='normal'
          color='text.soft'
        >
          Location
        </Heading>
        <Text
          color='text.strong'
          style={{ marginTop: Space['xs'] }}
        >{`${farm.address}, ${farm.city}, ${farm.state}`}</Text>
      </Box>

      <Box
        my='2xl'
        bg='bg.inactive'
        style={{ height: 1 }}
      />

      <Box px='xl'>
        <Box
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Heading
            size='xl'
            leading='base'
            weight='medium'
          >
            Estimates
          </Heading>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              padding: Space['2xs'],
              borderRadius: Border.radius.full,
              backgroundColor: colors.getColor('bg.base'),
            }}
            onPress={() => {
              router.push('/add-estimate');
            }}
          >
            <Ionicons
              size={20}
              name='add'
              color={colors.getColor('icon.inactive')}
            />
          </TouchableOpacity>
        </Box>
        <Box
          mt='xl'
          style={{ gap: Space['xs'] }}
        ></Box>
      </Box>
    </Scroll>
  );
};
