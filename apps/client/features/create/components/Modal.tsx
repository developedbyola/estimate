import React from 'react';
import { Border } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Box, Heading, Overlay, Text } from '@/components';
import Options from '../constants/Options';

type Props = {
  children: React.ReactNode;
};

export const Sheet = ({ children }: Props) => {
  const colors = useThemeColors();

  return (
    <Overlay.Root>
      <Overlay.SheetTrigger>{children}</Overlay.SheetTrigger>

      <Overlay.Sheet snapPoints={['50%']}>
        <Box
          px='xl'
          my='lg'
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Heading
            size='2xl'
            leading='xl'
            align='center'
            weight='medium'
            style={{ flex: 1, maxWidth: 200, marginHorizontal: 'auto' }}
          >
            Create and manage all your data
          </Heading>
        </Box>

        <Box
          px='xl'
          mx='auto'
          style={{ width: '100%' }}
        >
          {Options.map((option, index) => {
            return (
              <option.feature key={index}>
                <TouchableOpacity
                  key={index}
                  style={{
                    gap: 16,
                    paddingTop: 12,
                    flexDirection: 'row',
                  }}
                >
                  <Box
                    style={{
                      width: 36,
                      aspectRatio: '1/1',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: Border.radius.full,
                      backgroundColor: colors.getColor('primary.base'),
                    }}
                  >
                    <Ionicons
                      size={20}
                      name={option.icon}
                      color={colors.getColor('bg.base')}
                    />
                  </Box>
                  <Box
                    style={{
                      flex: 1,
                      gap: 20,
                      paddingBottom: 12,
                      borderStyle: 'solid',
                      flexDirection: 'row',
                      borderColor: colors.getColor('border.soft'),
                      borderBottomWidth: index === Options.length - 1 ? 0 : 1,
                    }}
                  >
                    <Box style={{ flex: 1 }}>
                      <Heading
                        size='xl'
                        leading='lg'
                        weight='normal'
                      >
                        {option.title}
                      </Heading>
                      <Text
                        size='sm'
                        leading='sm'
                      >
                        {option.subTitle}
                      </Text>
                    </Box>
                    <Box
                      bg='bg.subtle'
                      style={{
                        width: 24,
                        aspectRatio: '1/1',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: Border.radius.full,
                      }}
                    >
                      <Ionicons
                        size={18}
                        name={'add'}
                        style={{ alignSelf: 'center' }}
                        color={colors.getColor('icon.strong')}
                      />
                    </Box>
                  </Box>
                </TouchableOpacity>
              </option.feature>
            );
          })}
        </Box>
      </Overlay.Sheet>
    </Overlay.Root>
  );
};
