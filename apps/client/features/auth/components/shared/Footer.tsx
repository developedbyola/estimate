import { Space } from '@/constants';
import { useFormContext } from 'react-hook-form';
import { Action, Box, useFlowContext, useOverlayContext } from '@/components';

const Footer = () => {
  const { onOpenChange } = useOverlayContext();
  const { onNextStep, setData } = useFlowContext();
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
          maxWidth: 320,
          gap: Space.base,
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
