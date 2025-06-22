import { Typography } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { Heading, Box } from '@/components';
import { useThemeColors } from '@/hooks/useThemeColors';

const Success = () => {
  const Colors = useThemeColors();

  return (
    <Box
      px='xl'
      py='4xl'
    >
      <Ionicons
        size={80}
        name='checkmark-circle'
        color={Colors.success.base}
        style={{ marginInline: 'auto' }}
      />
      <Box py='xl' />
      <Heading
        size='2xl'
        style={{
          maxWidth: 240,
          marginInline: 'auto',
          textAlign: 'center',
          fontSize: Typography.size['3xl'],
        }}
      >
        Welcome aboard! Your account is ready.
      </Heading>
      <Box py='sm' />
    </Box>
  );
};

export default Success;
