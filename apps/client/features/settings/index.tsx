import React from 'react';
import { Box, Heading } from '@/components';
import Options from './constants/Options';
import Modal from './components/shared/Modal';
import { Ionicons } from '@expo/vector-icons';
import { Border, Space } from '@/constants';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TouchableHighlight } from 'react-native';

const SettingsFeature = () => {
  const Colors = useThemeColors();

  return (
    <Box style={{ gap: Space['xs'] }}>
      {Options.map((option, index) => {
        return (
          <Modal
            key={index}
            title={option.title}
            content={option.content}
            snapPoints={option.snapPoints}
          >
            <TouchableHighlight
              underlayColor={Colors.others.foreground}
              style={{
                height: 44,
                overflow: 'hidden',
                paddingInline: Space.sm,
                justifyContent: 'center',
                borderRadius: Border.radius.full,
              }}
            >
              <Box
                style={{
                  gap: Space.xl,
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <Box
                  bg='foreground'
                  style={{
                    width: 32,
                    aspectRatio: '1/1',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: Border.radius.full,
                  }}
                >
                  <Ionicons
                    size={20}
                    color={Colors.text.muted}
                    name={option.icon as any}
                  />
                </Box>
                <Heading
                  size='xl'
                  leading='sm'
                  weight='medium'
                >
                  {option.name}
                </Heading>
              </Box>
            </TouchableHighlight>
          </Modal>
        );
      })}
    </Box>
  );
};

export default SettingsFeature;
