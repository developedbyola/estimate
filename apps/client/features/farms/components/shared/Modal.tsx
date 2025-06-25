import React from 'react';
import { Keyboard } from 'react-native';
import { Action, Heading, Overlay } from '@/components';
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
          <Overlay.SheetHeader>
            <Heading
              leading='xl'
              align='center'
              weight='medium'
              style={{ maxWidth: 200, marginInline: 'auto' }}
            >
              {title}
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
