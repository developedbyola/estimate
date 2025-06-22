import React from 'react';
import { Border } from '@/constants';
import Name from './components/Name';
import { farmSchema } from './schemas';
import { Ionicons } from '@expo/vector-icons';
import { TouchableHighlight } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useThemeColors } from '@/hooks/useThemeColors';
import { FormProvider, useForm } from 'react-hook-form';
import { Action, Box, Heading, Overlay } from '@/components';
import Modal from './components/shared/Modal';
import Size from './components/Size';
import SizeUnit from './components/SizeUnit';
import Location from './components/Location';
import Category from './components/Category';

const options = [
  {
    name: 'Name',
    content: Name,
    snapPoints: ['36%'],
    title: 'What would you call this farmland?',
  },
  {
    name: 'Choose size unit',
    content: SizeUnit,
    snapPoints: ['54%'],
    title: 'What unit is your farm size calculated?',
  },
  {
    name: 'Size',
    content: Size,
    snapPoints: ['36%'],
    title: 'How large is your farmland?',
  },
  {
    name: 'Location',
    content: Location,
    snapPoints: ['42%'],
    title: 'Specify where your farm is located',
  },
  {
    name: 'Category',
    content: Category,
    snapPoints: ['54%'],
    title: "What kind of farm you're running?",
  },
];

type Props = {
  children: React.ReactNode;
};

const CreateFarmFeature = ({ children }: Props) => {
  const Colors = useThemeColors();
  const form = useForm({
    mode: 'all',
    resolver: zodResolver(farmSchema),
    defaultValues: {
      name: 'My farm',
      city: '',
      state: '',
      address: '',
      categoryId: '',
      size: '1',
      size_unit: 'acre',
    },
  });

  return (
    <Overlay.Root>
      <Overlay.SheetTrigger>{children}</Overlay.SheetTrigger>
      <Overlay.Sheet snapPoints={['56%']}>
        <Box
          px='xl'
          my='lg'
        >
          <Heading
            size='2xl'
            leading='lg'
            align='center'
            weight='medium'
            style={{ maxWidth: 200, marginHorizontal: 'auto' }}
          >
            Add new farm to your record
          </Heading>
        </Box>

        <FormProvider {...form}>
          <Box
            my='xl'
            px='xl'
            mx='auto'
            style={{
              flex: 1,
              width: '100%',
              maxWidth: 320,
            }}
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
                    title={option.title}
                    content={<option.content />}
                    snapPoints={option.snapPoints}
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
                        <Box
                          style={{
                            width: 20,
                            aspectRatio: '1/1',
                            alignItems: 'center',
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
            <Action.Label>Create new farm</Action.Label>
          </Action.Root>
        </Box>
      </Overlay.Sheet>
    </Overlay.Root>
  );
};

export default CreateFarmFeature;
