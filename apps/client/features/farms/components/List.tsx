import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Farm, useFarms } from './Provider';
import { excerpt } from '@/utils/excerpt';
import { Border, Space } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Box, Heading, Text, ActivityIndicator } from '@/components';
import Icons from '@/features/categories/constants/Icons';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { trpc } from '@/lib/trpc';

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

type ItemProps = { farm: Farm; index: number };

const Item = (props: ItemProps) => {
  const { farm, index } = props;

  const router = useRouter();
  const colors = useThemeColors();
  const { setFarms } = useFarms();
  const icon = Icons.find((icon) => icon.id === farm.category.icon);

  return (
    <MotiView
      animate={{ translateY: 0, opacity: 1 }}
      from={{ translateY: 12 * index, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 100, delay: 120 * index }}
      style={{
        height: 56,
        width: '100%',
        overflow: 'hidden',
        borderRadius: Border.radius.lg,
        backgroundColor: colors.getColor('bg.base'),
      }}
    >
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          setFarms({ type: 'SET_FARM', payload: { farm } });
          router.push('/farm');
        }}
        style={{
          flex: 1,
          gap: Space.lg,
          alignItems: 'center',
          flexDirection: 'row',
          paddingInline: Space.lg,
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
      </TouchableOpacity>
    </MotiView>
  );
};

const useFarmList = () => {
  const { setFarms } = useFarms();
  const list = trpc.userFarms.list.useQuery();

  React.useEffect(() => {
    if (list.status === 'error') {
      Alert.alert('Unable to fetch farms', list.error.message, [
        { text: 'Cancel' },
        {
          text: 'Retry',
          onPress: () => list.refetch().catch(console.error),
        },
      ]);
    }

    if (list.status === 'success') {
      const data = list.data as any;
      if (!data) return;

      setFarms({
        type: 'SET_FARMS',
        payload: {
          farms: (list.data as any)?.farms || [],
        },
      });
    }
  }, [list.status]);

  return { isLoading: list.isLoading };
};

export const List = () => {
  const { farms } = useFarms();

  const { isLoading } = useFarmList();

  if (isLoading) return <Loader />;
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
