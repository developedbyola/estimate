import React from 'react';
import Options from '../constants/Options';
import { Border, Space } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { Blur, Box, Text } from '@/components';
import { TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRouter } from 'expo-router';

const Group = ({ group }: { group: keyof typeof Options }) => {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <Blur
      bg='bg.base'
      style={{ borderRadius: Border.radius.lg }}
    >
      {Options[group].map((option, index) => {
        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.6}
            style={{ height: 46 }}
            onPress={() => router.push(option.href as any)}
          >
            <Box
              style={{
                flex: 1,
                gap: Space['xl'],
                alignItems: 'center',
                flexDirection: 'row',
                paddingLeft: Space['xl'],
                paddingRight: Space['xl'],
              }}
            >
              <Ionicons
                size={24}
                name={option.icon}
                color={colors.getColor('text.strong')}
              />
              <Text
                size='lg'
                leading='base'
                color='text.strong'
                style={{ flex: 1 }}
              >
                {option.name}
              </Text>
              <Ionicons
                size={16}
                name={'chevron-forward'}
                color={colors.getColor('text.inactive')}
              />
            </Box>
          </TouchableOpacity>
        );
      })}
    </Blur>
  );
};

export const List = () => {
  return (
    <Box style={{ gap: Space['xl'] }}>
      {Object.keys(Options).map((group) => {
        return (
          <Group
            key={group}
            group={group as any}
          />
        );
      })}
    </Box>
  );
};
