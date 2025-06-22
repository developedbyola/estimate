import React from 'react';
import { Space } from '@/constants';
import { Keyboard } from 'react-native';
import { Action, Box, Heading, Overlay } from '@/components';
import { TouchableWithoutFeedback } from '@gorhom/bottom-sheet';

type Props = {
  children: React.ReactNode;
  content: React.ReactNode;
  headingText: string;
  snapPoints: string[];
};

const Modal = ({ children, content, snapPoints, headingText }: Props) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Overlay.Root>
        <Overlay.SheetTrigger>{children}</Overlay.SheetTrigger>
        <Overlay.Sheet snapPoints={snapPoints}>
          <Box
            px='xl'
            my='lg'
            mx='auto'
            style={{ gap: 4, maxWidth: 320, width: '100%' }}
          >
            <Heading
              size='2xl'
              leading='xl'
              align='center'
              weight='medium'
              style={{ maxWidth: 240, marginHorizontal: 'auto' }}
            >
              {headingText}
            </Heading>
          </Box>
          <Box
            px='xl'
            my='2xl'
            mx='auto'
            style={{ flex: 1, maxWidth: 320, width: '100%' }}
          >
            {content}
          </Box>
          <Box
            pt='xl'
            pb='6xl'
            bg='background'
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
