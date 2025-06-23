import React from 'react';
import { Blur, Box, Text } from '@/components';
import Options from './constants/Options';
import { Border, Space } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TouchableHighlight } from 'react-native';

const Group = ({ group }: { group: keyof typeof Options }) => {
  const colors = useThemeColors();

  return (
    <Blur
      bg='background'
      style={{ borderRadius: Border.radius.lg }}
    >
      {Options[group].map((option, index) => {
        return (
          <TouchableHighlight
            key={index}
            style={{ height: 46 }}
            underlayColor={'red'}
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
                color={colors.text.muted}
              />
              <Text
                size='lg'
                leading='base'
                color='base'
                style={{ flex: 1 }}
              >
                {option.name}
              </Text>
              <Ionicons
                size={16}
                name={'chevron-forward'}
                color={colors.text.muted}
              />
            </Box>
          </TouchableHighlight>
        );
      })}
    </Blur>
  );
};
6;

const SettingsFeature = () => {
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

export default SettingsFeature;
