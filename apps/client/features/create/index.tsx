import React from 'react';
import { Border } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Box, Heading, Overlay, Text } from '@/components';

type Props = {
  children: React.ReactNode;
};

const options = [
  {
    icon: 'barcode',
    title: 'Estimate',
    subTitle: 'Generate a new cost estimate for your farm',
    feature: React.Fragment,
  },
  {
    icon: 'sparkles',
    title: 'Category',
    subTitle: 'Organize all your farm estimates by category',
    feature: React.Fragment,
  },
  {
    icon: 'sunny',
    title: 'Farm',
    subTitle: 'Set up a new farm profile with location and crop info',
    feature: React.Fragment,
  },
] as const;

const CreateBottomSheet = ({ children }: Props) => {
  const Colors = useThemeColors();

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
          style={{ maxWidth: 360, width: '100%' }}
        >
          {options.map((option, index) => {
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
                      backgroundColor: Colors.primary.base,
                    }}
                  >
                    <Ionicons
                      size={20}
                      name={option.icon}
                      color={Colors.others.background}
                    />
                  </Box>
                  <Box
                    style={{
                      flex: 1,
                      gap: 12,
                      paddingBottom: 12,
                      borderBottomWidth: 1,
                      borderStyle: 'solid',
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderColor: Colors.others.foreground,
                    }}
                  >
                    <Box style={{ flex: 1 }}>
                      <Heading
                        size='lg'
                        leading='lg'
                        weight='medium'
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
                      bg='foreground'
                      style={{
                        width: 24,
                        aspectRatio: '1/1',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: Border.radius.full,
                      }}
                    >
                      <Ionicons
                        size={16}
                        name={'add'}
                        color={Colors.others.inverted}
                        style={{ alignSelf: 'center' }}
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

export default CreateBottomSheet;
