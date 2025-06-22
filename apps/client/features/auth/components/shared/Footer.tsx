import { useFormContext } from 'react-hook-form';
import { Action, Box, useFlowContext, useOverlayContext } from '@/components';
import { Space } from '@/constants';

const Footer = () => {
  const { onNextStep, setData } = useFlowContext();
  const { onOpenChange } = useOverlayContext();
  const { reset, handleSubmit } = useFormContext();

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
          gap: Space.xs,
          maxWidth: 320,
        }}
      >
        <Action.Root
          onPress={handleSubmit((values) => {
            setData(values);
            onNextStep();
          })}
        >
          <Action.Label>Continue</Action.Label>
        </Action.Root>
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
