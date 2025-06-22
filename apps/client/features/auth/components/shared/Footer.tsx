import { Space } from '@/constants';
import { useFormContext } from 'react-hook-form';
import { Action, Box, useOverlayContext } from '@/components';

type Props = {
  children?: React.ReactNode;
};

const Footer = ({ children }: Props) => {
  const { reset } = useFormContext();
  const { onOpenChange } = useOverlayContext();

  return (
    <Box
      pt='lg'
      pb='6xl'
      style={{ position: 'absolute', bottom: 0, width: '100%' }}
    >
      <Box
        px='xl'
        mx='auto'
        style={{
          width: '100%',
          maxWidth: 320,
          gap: Space.base,
        }}
      >
        {children}
        <Action.Root
          variant='surface'
          onPress={() => {
            reset();
            onOpenChange(false);
          }}
        >
          <Action.Label>Cancel</Action.Label>
        </Action.Root>
      </Box>
    </Box>
  );
};

export default Footer;
