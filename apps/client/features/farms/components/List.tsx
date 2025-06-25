import React from 'react';
import { Alert } from 'react-native';
import { useFarms } from './Provider';
import { excerpt } from '@/utils/excerpt';
import { Border, Space } from '@/constants';
import { FarmSchemaType } from '../schemas';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Box, Heading, Text, ActivityIndicator } from '@/components';
import { useCategories } from '@/features/categories';
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

type FarmProps = { farm: FarmSchemaType & { id: string } };

const Farm = (props: FarmProps) => {
  const { farm } = props;

  return (
    <Box
      py='xs'
      px='xs'
      bg='bg.base'
      style={{ width: '100%', flexDirection: 'row', height: 48 }}
    >
      <Ionicons name={'' as any} />
      <Box>
        <Heading
          size='lg'
          leading='lg'
        >
          {excerpt(farm.name, 12)}
        </Heading>
      </Box>
    </Box>
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
        flexWrap: 'wrap',
        flexDirection: 'row',
      }}
    >
      {farms.map((farm) => {
        return (
          <Farm
            farm={farm}
            key={farm.id}
          />
        );
      })}
    </Box>
  );
};
