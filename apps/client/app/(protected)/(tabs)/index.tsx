import React from 'react';
import { Border, Space } from '@/constants';
import { useRouter } from 'expo-router';
import { Farms } from '@/features/farms';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useCurrency } from '@/features/currency';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Heading, Box, Text, Safe } from '@/components';

const HomePage = () => {
  const router = useRouter();
  const colors = useThemeColors();
  const { currency } = useCurrency();

  return (
    <Safe
      bg='bg.subtle'
      style={{ flex: 1 }}
    >
      <Box
        mt='3xl'
        px='xl'
        style={{
          gap: Space['xl'],
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity
          hitSlop={20}
          onPress={() => {
            router.push('/(protected)/(settings)');
          }}
        >
          <Ionicons
            size={24}
            name='cog-outline'
            color={colors.getColor('icon.strong')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={20}
          onPress={() => {
            router.push('/farms/create');
          }}
        >
          <Box
            bg='primary.base'
            style={{
              height: 36,
              aspectRatio: 1,
              alignItems: 'center',
              borderRadius: Border.radius.full,
              justifyContent: 'center',
            }}
          >
            <Ionicons
              size={24}
              name='add-sharp'
              color={colors.getColor('icon.base')}
            />
          </Box>
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={20}
          onPress={() => {
            router.push('/(protected)/(settings)');
          }}
        >
          <Ionicons
            size={24}
            name='information-circle-outline'
            color={colors.getColor('icon.strong')}
          />
        </TouchableOpacity>
      </Box>

      <Box
        px='xl'
        mb='4xl'
        mt='5xl'
      >
        <Text
          size='base'
          leading='xs'
          align='center'
        >
          Total Estimates
        </Text>
        <Box
          mt='lg'
          style={{
            gap: 2,
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'center',
          }}
        >
          <Text
            size='xl'
            style={{ lineHeight: 18 }}
          >
            {currency.symbol}
          </Text>
          <Heading
            size='3xl'
            style={{ lineHeight: 32 }}
          >
            00.00
          </Heading>
        </Box>
      </Box>

      <Box
        px='xl'
        pt='xl'
        bg='bg.base'
        style={{
          flex: 1,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
        }}
      >
        <Farms.List />
      </Box>
    </Safe>
  );
};

export default HomePage;
