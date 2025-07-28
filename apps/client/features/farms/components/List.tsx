import React from 'react';
import { MotiView } from 'moti';
import { Farm } from '../types';
import { useFarms } from './Provider';
import { useRouter } from 'expo-router';
import { excerpt } from '@/utils/excerpt';
import { Border, Space } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { useGetFarms } from '../hooks/useGetFarms';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
  Box,
  Heading,
  Text,
  ActivityIndicator,
  Action,
  RadioGroup,
} from '@/components';

const Select = () => {
  const { farms } = useFarms();
  const form = useFormContext();
  const colors = useThemeColors();

  return (
    <Controller
      name='farmId'
      control={form.control}
      render={({ field }) => {
        return (
          <RadioGroup.Root
            value={field.value}
            onValueChange={({ value }) => field.onChange(value)}
            style={{ flexDirection: 'row', flexWrap: 'wrap' }}
          >
            {farms.map((farm) => {
              return (
                <Box
                  key={farm.id}
                  style={{ width: '50%', padding: Space['2xs'] }}
                >
                  <RadioGroup.Item
                    bg='bg.subtle'
                    value={farm.id}
                    style={{
                      padding: 16,
                      height: 120,
                      borderRadius: 20,
                      overflow: 'hidden',
                      position: 'relative',
                      justifyContent: 'space-between',
                    }}
                  >
                    <RadioGroup.Indicator
                      value={farm.id}
                      style={{
                        top: 14,
                        right: 14,
                        height: 16,
                        aspectRatio: 1,
                        borderRadius: 999,
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colors.getColor('bg.strong'),
                      }}
                    >
                      <Ionicons
                        size={12}
                        name='checkmark'
                        color={colors.getColor('icon.base')}
                      />
                    </RadioGroup.Indicator>
                    <Text style={{ fontSize: 24 }}>{farm.category.icon}</Text>
                    <Text
                      color='text.strong'
                      style={{
                        fontSize: 14,
                        lineHeight: 16,
                        fontWeight: '600',
                      }}
                    >
                      {farm.name}
                    </Text>
                  </RadioGroup.Item>
                </Box>
              );
            })}
          </RadioGroup.Root>
        );
      }}
    />
  );
};

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

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={{ width: '100%' }}
      onPress={() => {
        router.push({
          pathname: '/farms/view',
          params: { farmId: farm.id },
        });
      }}
    >
      <MotiView
        animate={{ translateY: 0, opacity: 1 }}
        from={{ translateY: 12 * (index + 1), opacity: 0 }}
        transition={{
          type: 'timing',
          delay: 120 * (index + 1),
        }}
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
            size='base'
            leading='sm'
          >{`${farm.city}, ${farm.state}`}</Text>
        </Box>
      </MotiView>
    </TouchableOpacity>
  );
};

type ListProps = {
  isSelect?: boolean;
  Empty?: React.ReactNode;
};

export const List = ({ isSelect, Empty }: ListProps) => {
  const _ = useGetFarms();
  const { farms, loading } = useFarms();

  if (loading) return <Loader />;
  if (farms.length === 0) return Empty ? Empty : <DefaultEmpty />;

  return isSelect ? (
    <Select />
  ) : (
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
