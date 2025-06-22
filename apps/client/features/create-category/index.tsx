import React from 'react';
import { Border, Space } from '@/constants';
import Icon from './components/Icon';
import Icons from './constants/Icons';
import Title from './components/Title';
import { excerpt } from '@/utils/excerpt';
import { categorySchema } from './schemas';
import { Ionicons } from '@expo/vector-icons';
import Modal from './components/shared/Modal';
import { TouchableHighlight } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useThemeColors } from '@/hooks/useThemeColors';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Box, Action, Heading, Overlay, Text } from '@/components';

type Props = {
  children: React.ReactNode;
};

const options = [
  {
    name: 'Title',
    content: Title,
    snapPoints: ['36%'],
    headingText: 'What would you like to call this category?',
  },
  {
    content: Icon,
    snapPoints: ['80%'],
    name: 'Express with icon',
    headingText: 'Express your farm category with an icon',
  },
];

const CreateCategoryFeature = ({ children }: Props) => {
  const Colors = useThemeColors();
  const form = useForm({
    mode: 'all',
    resolver: zodResolver(categorySchema),
    defaultValues: { title: '', icon: Icons[0].id },
  });

  const values = useWatch({ control: form.control });
  const icon = Icons.find((icon) => icon.id === values.icon);

  return (
    <Overlay.Root>
      <Overlay.SheetTrigger>{children}</Overlay.SheetTrigger>
      <Overlay.Sheet
        snapPoints={['40%']}
        style={{ justifyContent: 'space-between' }}
      >
        <Box
          my='lg'
          px='xl'
        >
          <Heading
            size='2xl'
            align='center'
            leading='xl'
            weight='medium'
            style={{ maxWidth: 240, marginHorizontal: 'auto' }}
          >
            Sort your farms meaningfully.
          </Heading>
        </Box>

        <FormProvider {...form}>
          <Box
            my='2xl'
            px='xl'
            mx='auto'
            style={{ maxWidth: 320, width: '100%' }}
          >
            <Box
              bg='foreground'
              style={{
                overflow: 'hidden',
                borderRadius: Border.radius.xl,
              }}
            >
              {options.map((option, index) => {
                return (
                  <Modal
                    key={index}
                    content={<option.content />}
                    snapPoints={option.snapPoints}
                    headingText={option.headingText}
                  >
                    <TouchableHighlight underlayColor={Colors.others.surface}>
                      <Box
                        px='lg'
                        style={{
                          height: 44,
                          alignItems: 'center',
                          flexDirection: 'row',
                          borderColor: 'white',
                          borderBottomWidth:
                            options.length - 1 === index ? 0 : 1.5,
                        }}
                      >
                        <Heading
                          size='lg'
                          leading='sm'
                          weight='normal'
                          style={{ flex: 1 }}
                        >
                          {option.name}
                        </Heading>
                        {index === 1 ? (
                          <Box
                            style={{
                              width: 24,
                              aspectRatio: '1/1',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: Border.radius.base,
                              backgroundColor: icon?.lightColor,
                            }}
                          >
                            <Ionicons
                              size={16}
                              color={icon?.normalColor}
                              name={icon?.icon || ('' as any)}
                            />
                          </Box>
                        ) : null}
                        {index === 0 ? (
                          <Text
                            size='lg'
                            color='muted'
                            leading='sm'
                          >
                            {excerpt(values.title || 'No title', 12)}
                          </Text>
                        ) : null}

                        <Box
                          style={{
                            width: 20,
                            aspectRatio: '1/1',
                            alignItems: 'center',
                            marginLeft: Space.lg,
                            justifyContent: 'center',
                            borderRadius: Border.radius.xl,
                            backgroundColor: Colors.others.surface,
                          }}
                        >
                          <Ionicons
                            size={16}
                            name='add'
                            color={Colors.others.inverted}
                          />
                        </Box>
                      </Box>
                    </TouchableHighlight>
                  </Modal>
                );
              })}
            </Box>
          </Box>
        </FormProvider>

        <Box
          px='xl'
          pb='5xl'
          mx='auto'
          style={{ maxWidth: 320, width: '100%' }}
        >
          <Action.Root>
            <Action.Label>Create</Action.Label>
          </Action.Root>
        </Box>
      </Overlay.Sheet>
    </Overlay.Root>
  );
};

export default CreateCategoryFeature;
