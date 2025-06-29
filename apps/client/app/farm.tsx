import React from 'react';
import { router, Stack } from 'expo-router';
import { Button } from 'react-native';
import { excerpt } from '@/utils/excerpt';
import { Border, Space } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { Farms, useFarms } from '@/features/farms';
import { useThemeColors } from '@/hooks/useThemeColors';
import Icons from '@/features/categories/constants/Icons';
import { Action, Box, Heading, Safe, Text } from '@/components';

const FarmPage = () => {
  const { farm } = useFarms();
  const colors = useThemeColors();

  if (!farm) {
    return null;
  }

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
        <Box
          px='xl'
          mt='4xl'
          style={{
            gap: Space['xl'],
            flexDirection: 'row',
          }}
        >
          <Box
            bg='bg.base'
            style={{
              width: 120,
              aspectRatio: '1/1',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: Border.radius['2xl'],
              boxShadow: `0px 0px 0px 1px rgba(0, 0, 0, 0.04)`,
            }}
          >
            <Ionicons
              size={56}
              name={icon?.icon as any}
              color={icon?.normalColor}
            />
          </Box>
          <Box style={{ flex: 1, alignItems: 'flex-start' }}>
            <Box style={{ gap: Space['2xs'] }}>
              <Heading
                size='2xl'
                leading='lg'
                weight='medium'
                style={{ maxWidth: 160 }}
              >
                {farm.name}
              </Heading>
              <Text
                leading='base'
                style={{ textTransform: 'capitalize' }}
              >{`${farm.size} ${farm.size_unit}`}</Text>
            </Box>
            <Box
              mt='xl'
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Farms.Add farm={farm}>
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
              </Farms.Add>

              <Farms.Delete>
                <Ionicons
                  size={26}
                  name='close-circle'
                  color={colors.getColor('icon.inactive')}
                />
              </Farms.Delete>
            </Box>
          </Box>
        </Box>

        <Box
          my='2xl'
          bg='bg.inactive'
          style={{ height: 1 }}
        />

        <Box px='xl'>
          <Box
            style={{
              gap: Space['xs'],
            }}
          >
            <Heading
              size='lg'
              leading='base'
              weight='normal'
              color='text.soft'
            >
              Location
            </Heading>
            <Text
              size='sm'
              leading='base'
              color='text.strong'
            >{`${farm.address}, ${farm.city}, ${farm.state}`}</Text>
          </Box>
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
              weight='medium'
              leading='lg'
            >
              Estimates
            </Heading>
            <Button
              title='Add estimate'
              onPress={() => router.push('/estimate')}
            />
          </Box>
        </Box>
      </Safe>
    </React.Fragment>
  );
};

export default FarmPage;
