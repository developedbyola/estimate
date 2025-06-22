import {
  Box,
  Text,
  Action,
  Heading,
  useFlowContext,
  useOverlayContext,
} from '@/components';
import React from 'react';
import LoginFeature from '../../login';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Space } from '@/constants';
import { excerpt } from '@/utils/excerpt';

const Success = () => {
  const Colors = useThemeColors();
  const { onOpenChange } = useOverlayContext();
  const { data } = useFlowContext<{ name?: string }>();

  return (
    <React.Fragment>
      <Box
        px='xl'
        py='4xl'
        mx='auto'
        style={{ flex: 1, maxWidth: 320, width: '100%' }}
      >
        <Ionicons
          size={64}
          name='checkmark-circle'
          color={Colors.success.base}
          style={{ marginInline: 'auto' }}
        />
        <Box py='xl' />
        <Heading
          size='2xl'
          leading='lg'
          align='center'
          weight='medium'
          style={{ maxWidth: 200, marginInline: 'auto' }}
        >
          High five! ✋ {`${excerpt(data.name || '', 12)}`}
        </Heading>
        <Box py='sm' />
        <Text
          size='xl'
          leading='lg'
          align='center'
        >
          We are thrilled to have you join our community. Your account is all
          set up and ready to grow with us!
        </Text>
      </Box>

      <Box
        px='lg'
        pb='6xl'
        mx='auto'
        style={{ width: '100%', maxWidth: 320, gap: Space.base }}
      >
        <LoginFeature>
          <Action.Root onPress={() => onOpenChange(false)}>
            <Action.Label>Get started</Action.Label>
          </Action.Root>
        </LoginFeature>
        <Action.Root
          variant='surface'
          onPress={() => onOpenChange(false)}
        >
          <Action.Label>Close</Action.Label>
        </Action.Root>
      </Box>
    </React.Fragment>
  );
};

export default Success;
