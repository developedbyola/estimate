import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Box, Heading, Text } from '@/components';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Space } from '@/constants';

export const Empty = () => {
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
