import React from 'react';
import { useRouter } from 'expo-router';
import { Farms } from '@/features/farms';
import { Border, Space } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
  Box,
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
    <Scroll contentContainerStyle={{ flex: 1 }}>
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
            style={{ lineHeight: 56 }}
          >
            {farm.category.icon}
          </Text>
        </Box>

        <Heading
          size='2xl'
          align='center'
          leading='base'
          style={{
            maxWidth: 280,
            marginInline: 'auto',
            marginTop: Space['xl'],
          }}
        >
          {farm.name}
        </Heading>

        <Text
          align='center'
          leading='base'
          style={{ textTransform: 'capitalize', marginTop: Space['xs'] }}
        >{`${farm.size} ${farm.sizeUnit}`}</Text>

        <Box
          style={{
            gap: 8,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: Space['3xl'],
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: '/farms/update',
                params: { farmId: farm.id },
              })
            }
            style={{
              gap: 2,
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingInline: Space['xl'],
              paddingVertical: Space['base'],
              borderRadius: Border.radius['lg'],
              backgroundColor: colors.getColor('bg.strong'),
            }}
          >
            <Text
              size='sm'
              align='center'
              color='text.base'
              weight='semibold'
            >
              Update
            </Text>
          </TouchableOpacity>

          <Pressable
            style={{
              gap: 2,
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingInline: Space['xl'],
              paddingVertical: Space['base'],
              borderRadius: Border.radius['lg'],
              backgroundColor: colors.getColor('bg.soft'),
            }}
          >
            <Farms.Delete>
              <Text
                size='sm'
                align='center'
                color='text.strong'
                weight='semibold'
              >
                Delete
              </Text>
            </Farms.Delete>
          </Pressable>
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
