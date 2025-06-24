import React from 'react';
import { Keyboard } from 'react-native';
import { Action, Heading, Overlay } from '@/components';
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
          <Overlay.SheetHeader>
            <Heading
              size='2xl'
              leading='xl'
              align='center'
              weight='medium'
              style={{ maxWidth: 240, marginHorizontal: 'auto' }}
            >
              {headingText}
            </Heading>
          </Overlay.SheetHeader>
          <Overlay.SheetContent mt='3xl'>{content}</Overlay.SheetContent>
          <Overlay.SheetFooter>
            <Overlay.SheetTrigger>
              <Action.Root>
                <Action.Label>Continue</Action.Label>
              </Action.Root>
            </Overlay.SheetTrigger>
          </Overlay.SheetFooter>
        </Overlay.Sheet>
      </Overlay.Root>
    </TouchableWithoutFeedback>
  );
};

export default Modal;
