import React from 'react';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { excerpt } from '@/utils/excerpt';
import { Border, Space } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Farms, useFarms } from '@/features/farms';
import { useThemeColors } from '@/hooks/useThemeColors';
import Icons from '@/features/categories/constants/Icons';
import { Action, Box, Heading, Safe, Scroll, Text } from '@/components';
import Estimates from './Estimates';

export const Single = () => {
  const router = useRouter();
  const colors = useThemeColors();
  const { farm, setFarms } = useFarms();

  if (!farm) return null;

  const icon = Icons.find((icon) => icon.id === farm.category.icon);

  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          title: excerpt(farm.name, 12),
          headerStyle: {
            backgroundColor: colors.getColor('bg.base'),
          },
          headerTitleStyle: {
            color: colors.getColor('text.strong'),
          },
        }}
      />

      <Safe
        bg='bg.subtle'
        style={{ flex: 1 }}
      >
        <Scroll style={{ flex: 1 }}>
          <Box
            px='xl'
            mt='4xl'
          >
            <Box
              bg='bg.base'
              style={{
                width: 56,
                aspectRatio: '1/1',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: Border.radius['xl'],
                boxShadow: `0px 0px 0px 1px rgba(0, 0, 0, 0.04)`,
              }}
            >
              <Ionicons
                size={32}
                name={icon?.icon as any}
                color={icon?.normalColor}
              />
            </Box>

            <Heading
              size='2xl'
              leading='lg'
              style={{ maxWidth: 320, marginTop: Space['lg'] }}
            >
              {farm.name}
            </Heading>
            <Text
              leading='base'
              style={{ textTransform: 'capitalize', marginTop: Space['xs'] }}
            >{`${farm.size} ${farm.size_unit}`}</Text>
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
                onPress={() => {
                  setFarms({ type: 'UPDATE_FARM', payload: { farm } });
                  router.push('/add-farm');
                }}
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
                onPress={() => router.push('/add-estimate')}
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
            >
              <Estimates />
            </Box>
          </Box>
        </Scroll>
      </Safe>
    </React.Fragment>
  );
};
