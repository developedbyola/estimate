import React from 'react';
import { Keyboard } from 'react-native';
import { Action, Box, Heading, Overlay } from '@/components';
import { TouchableWithoutFeedback } from '@gorhom/bottom-sheet';

type Props = {
  content: React.ReactNode;
  children: React.ReactNode;
  snapPoints: string[];
  title: string;
};

const Modal = ({ content, children, title, snapPoints }: Props) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Overlay.Root>
        <Overlay.SheetTrigger>{children}</Overlay.SheetTrigger>
        <Overlay.Sheet snapPoints={snapPoints}>
          <Box
            my='lg'
            px='xl'
          >
            <Heading
              leading='xl'
              align='center'
              weight='medium'
              style={{ maxWidth: 200, marginInline: 'auto' }}
            >
              {title}
            </Heading>
          </Box>
          <Box
            px='xl'
            my='2xl'
            mx='auto'
            style={{ maxWidth: 340, width: '100%' }}
          >
            {content}
          </Box>
          <Box
            pt='xl'
            pb='6xl'
            bg='bg.base'
            style={{
              bottom: 0,
              width: '100%',
              position: 'absolute',
              boxShadow: '-2px 0px 0px 1px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box
              px='xl'
              mx='auto'
              style={{ maxWidth: 320, width: '100%' }}
            >
              <Overlay.SheetTrigger>
                <Action.Root>
                  <Action.Label>Continue</Action.Label>
                </Action.Root>
              </Overlay.SheetTrigger>
            </Box>
          </Box>
        </Overlay.Sheet>
      </Overlay.Root>
    </TouchableWithoutFeedback>
  );
};

export default Modal;
