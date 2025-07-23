import React from 'react';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { excerpt } from '@/utils/excerpt';
import { Border, Space } from '@/constants';
import { useFarms } from './Provider';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useGetFarms } from '../hooks/useGetFarms';
import { useThemeColors } from '@/hooks/useThemeColors';
import Icons from '@/features/categories/constants/Icons';
import { Box, Heading, Text, ActivityIndicator, Action } from '@/components';
import { Farm } from '../types';

const Loader = () => {
  return (
    <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator />
    </Box>
  );
};

const DefaultEmpty = () => {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <Box style={{ flex: 1, justifyContent: 'center' }}>
      <Box
        bg='bg.subtle'
        style={{
          height: 64,
          aspectRatio: 1,
          alignItems: 'center',
          marginInline: 'auto',
          justifyContent: 'center',
          borderRadius: Border.radius['full'],
        }}
      >
        <Ionicons
          size={32}
          name='albums'
          color={colors.getColor('icon.strong')}
        />
      </Box>
      <Heading
        size='2xl'
        leading='base'
        align='center'
        color='text.strong'
        style={{
          marginTop: Space['2xl'],
        }}
      >
        It's Quite Here
      </Heading>
      <Text
        size='lg'
        leading='base'
        align='center'
        color='text.soft'
        style={{
          maxWidth: 280,
          marginInline: 'auto',
          marginTop: Space.base,
        }}
      >
        Create a farm record to start calculating your estimates
      </Text>
      <Action.Root
        size='lg'
        onPress={() => {
          router.push('/farms/create');
        }}
        variant='primary'
        style={{
          width: 144,
          marginInline: 'auto',
          marginTop: Space['2xl'],
          backgroundColor: colors.getColor('bg.strong'),
          borderRadius: Border.radius.full,
        }}
      >
        <Action.Label style={{ fontSize: 20 }}>Create Farm</Action.Label>
      </Action.Root>
    </Box>
  );
};

type ItemProps = { farm: Farm; index: number };

const Item = (props: ItemProps) => {
  const { farm, index } = props;

  const router = useRouter();
  const colors = useThemeColors();
  const { setFarms } = useFarms();

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        setFarms({ type: 'SET_FARM', payload: { farm } });
        router.push('/farms/create');
      }}
    >
      <MotiView
        animate={{ translateY: 0, opacity: 1 }}
        from={{ translateY: 12 * index, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 100, delay: 120 * index }}
        style={{
          gap: 12,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: Border.radius.lg,
          backgroundColor: colors.getColor('bg.base'),
        }}
      >
        <Box
          bg='bg.soft'
          style={{
            height: 48,
            aspectRatio: 1,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 32, lineHeight: 48 }}>
            {farm.category.icon}
          </Text>
        </Box>
        <Box style={{ gap: 2 }}>
          <Heading
            size='lg'
            leading='sm'
            weight='medium'
          >
            {excerpt(farm.name, 20)}
          </Heading>
          <Text
            size='sm'
            leading='xs'
          >{`${farm.size} ${farm.sizeUnit}`}</Text>
          <Text
            size='sm'
            leading='xs'
          >{`${farm.city}, ${farm.state}`}</Text>
        </Box>
      </MotiView>
    </TouchableOpacity>
  );
};

type ListProps = {
  Empty?: React.ReactNode;
};

export const List = ({ Empty }: ListProps) => {
  const _ = useGetFarms();
  const { farms, loading } = useFarms();

  if (loading) return <Loader />;
  if (farms.length === 0) return Empty ? Empty : <DefaultEmpty />;

  return (
    <Box
      style={{
        flex: 1,
        gap: Space.sm,
        flexWrap: 'wrap',
        flexDirection: 'row',
      }}
    >
      {farms.map((farm, index) => {
        return (
          <Item
            farm={farm}
            key={farm.id}
            index={index}
          />
        );
      })}
    </Box>
  );
};
