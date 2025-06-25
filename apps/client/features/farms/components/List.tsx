import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Farm, useFarms } from './Provider';
import { excerpt } from '@/utils/excerpt';
import { Border, Space } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Box, Heading, Text, ActivityIndicator } from '@/components';
import Icons from '@/features/categories/constants/Icons';

const Loader = () => {
  return <ActivityIndicator />;
};

const Empty = () => {
  const colors = useThemeColors();

  return (
    <Box>
      <Ionicons
        size={56}
        style={{ marginInline: 'auto' }}
        name='notifications-off-circle-outline'
        color={colors.getColor('icon.inactive')}
      />
      <Heading
        size='2xl'
        leading='base'
        align='center'
        weight='medium'
        color='text.strong'
        style={{ marginTop: Space['2xl'], marginInline: 'auto', maxWidth: 240 }}
      >
        Let's get growing!
      </Heading>
      <Text
        size='lg'
        leading='base'
        align='center'
        color='text.subtle'
        style={{ marginTop: Space.base, marginInline: 'auto', maxWidth: 280 }}
      >
        Looks like no farms have been added — Create new farm and start tracking
        your farm's production
      </Text>
    </Box>
  );
};

type ItemProps = { farm: Farm };

const Item = (props: ItemProps) => {
  const { farm } = props;
  const colors = useThemeColors();

  const icon = Icons.find((icon) => icon.id === farm.category.icon);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={{
        height: 56,
        width: '100%',
        overflow: 'hidden',
        borderRadius: Border.radius.lg,
        backgroundColor: colors.getColor('bg.base'),
      }}
    >
      <Box
        px='lg'
        style={{
          flex: 1,
          gap: Space.xl,
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <Ionicons
          size={30}
          color={icon?.normalColor || ''}
          name={(icon?.icon || '') as any}
        />
        <Box>
          <Heading
            size='lg'
            leading='base'
            weight='medium'
          >
            {excerpt(farm.name, 20)}
          </Heading>

          <Text
            size='sm'
            leading='sm'
          >{`${farm.size} ${farm.size_unit} at ${excerpt(
            farm.address,
            20
          )}`}</Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export const List = () => {
  const { farms, loading, error, refetch } = useFarms();

  if (loading) return <Loader />;
  if (error) {
    Alert.alert('Server Error', error?.message || 'Failed to load farms', [
      { text: 'OK' },
      {
        text: 'Retry',
        onPress: () => refetch?.(),
      },
    ]);

    return <Empty />;
  }
  if (farms.length === 0) return <Empty />;

  return (
    <Box
      style={{
        flex: 1,
        gap: Space.sm,
        flexWrap: 'wrap',
        flexDirection: 'row',
      }}
    >
      {farms.map((farm) => {
        return (
          <Item
            farm={farm}
            key={farm.id}
          />
        );
      })}
    </Box>
  );
};
