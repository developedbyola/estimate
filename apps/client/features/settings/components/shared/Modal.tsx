import React from 'react';
import { Action, Box, Heading, Overlay } from '@/components';
import { Space } from '@/constants';

type Props = {
  title: string;
  snapPoints: string[];
  children: React.ReactNode;
  content: React.ReactNode;
};

const Modal = ({ title, children, snapPoints, content }: Props) => {
  return (
    <Overlay.Root>
      <Overlay.SheetTrigger>{children}</Overlay.SheetTrigger>
      <Overlay.Sheet snapPoints={snapPoints}>
        <Box>
          <Heading>{title}</Heading>
        </Box>

        <Box>{content}</Box>

        <Box
          pt='lg'
          px='xl'
          pb='6xl'
          style={{
            bottom: 0,
            width: '100%',
            position: 'absolute',
            boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Box
            style={{
              gap: Space.xs,
              maxWidth: 320,
              flexDirection: 'row',
            }}
          >
            <Action.Root
              variant='ghost'
              style={{ flex: 1 }}
            >
              <Action.Label>Cancel</Action.Label>
            </Action.Root>
            <Action.Root style={{ flex: 1 }}>
              <Action.Label>Save</Action.Label>
            </Action.Root>
          </Box>
        </Box>
      </Overlay.Sheet>
    </Overlay.Root>
  );
};

export default Modal;
