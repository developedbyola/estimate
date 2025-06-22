import React from 'react';
import { Overlay } from '@/components';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

type Props = {
  trigger: React.ReactNode;
  flow: React.ReactNode;
};

const AuthModal = ({ trigger, flow }: Props) => {
  return (
    <Overlay.Root>
      <Overlay.Trigger>{trigger}</Overlay.Trigger>
      <Overlay.Modal>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          {flow}
        </TouchableWithoutFeedback>
      </Overlay.Modal>
    </Overlay.Root>
  );
};

export default AuthModal;
