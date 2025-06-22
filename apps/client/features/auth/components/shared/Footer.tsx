import { Space } from '@/constants';
import { useFormContext } from 'react-hook-form';
import { Action, Box, useFlowContext, useOverlayContext } from '@/components';

type Props = {
  authType?: 'login' | 'register';
};

const Footer = ({ authType }: Props) => {
  const { onOpenChange } = useOverlayContext();
  const { reset, handleSubmit } = useFormContext();
  const { onNextStep, isLastStep, setData } = useFlowContext();

  const submissionType = authType === 'login' ? 'login' : 'register';

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
            if (submissionType === 'login') {
            }
          })}
        >
          <Action.Label>Continue</Action.Label>
          <Action.Loader />
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
