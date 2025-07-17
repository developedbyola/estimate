import React from 'react';
import { Border, Space } from '@/constants';
import { Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Action,
  Box,
  Gradient,
  Heading,
  Overlay,
  Text,
  useOverlay,
} from '@/components';
import { useThemeColors } from '@/hooks/useThemeColors';

type PopupAction = {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'destructive';
};

type Config = {
  title: string;
  message: string;
  actions: PopupAction[];
  onDismiss?: () => void;
  variant?: 'success' | 'error' | 'warning' | 'info';
};

const PopupComponent = ({
  config,
  close,
}: {
  config: Config;
  close: () => void;
}) => {
  const colors = useThemeColors();
  const iconName = {
    success: 'checkmark-circle-outline',
    error: 'alert-circle-outline',
    warning: 'alert-circle-outline',
    info: 'information-circle-outline',
  };

  const bgColors = {
    success: [
      colors.getColor('success.base'),
      colors.getColor('success.subtle'),
    ],
    error: [colors.getColor('error.base'), colors.getColor('error.subtle')],
    warning: [
      colors.getColor('warning.base'),
      colors.getColor('warning.subtle'),
    ],
    info: [colors.getColor('info.base'), colors.getColor('info.subtle')],
  };

  return (
    <Overlay.Sheet
      onDismiss={close}
      snapPoints={['45%']}
    >
      <Overlay.SheetContent
        mt='4xl'
        style={{
          flex: 1,
          gap: Space.base,
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Gradient
          colors={bgColors[config.variant || 'success'] as any}
          style={{
            width: 56,
            aspectRatio: 1,
            marginInline: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: Border.radius.full,
          }}
        >
          <Ionicons
            size={32}
            color={colors.getColor('icon.base')}
            name={iconName[config.variant || 'success'] as any}
          />
        </Gradient>
        <Heading
          size='2xl'
          leading='lg'
          align='center'
          weight='semibold'
          style={{ marginTop: 12, maxWidth: 280, marginInline: 'auto' }}
        >
          {config.title}
        </Heading>
        <Text
          size='lg'
          align='center'
          style={{ maxWidth: 320, marginInline: 'auto' }}
        >
          {config.message}
        </Text>
      </Overlay.SheetContent>
      <Overlay.SheetFooter>
        {config.actions.map((action, index) => (
          <Action.Root
            key={index}
            size='lg'
            onPress={() => {
              action.onPress();
              close();
            }}
            variant={action.variant}
          >
            <Action.Label>{action.text}</Action.Label>
          </Action.Root>
        ))}
      </Overlay.SheetFooter>
    </Overlay.Sheet>
  );
};

const usePopupConfig = () => {
  const [config, setConfig] = React.useState<
    Omit<Config, 'actions' | 'onDismiss'> & { actions: PopupAction[] }
  >({
    title: '',
    message: '',
    variant: 'success',
    actions: [{ text: 'Cancel', variant: 'primary', onPress: () => {} }],
  });

  const overlay = useOverlay({ open: true });

  const open = (newConfig: Config) => {
    Keyboard.dismiss();
    setConfig(newConfig);
    overlay.bottomSheet.open();
  };

  const close = () => {
    overlay.bottomSheet.close();
  };

  return { open, close, overlay, config };
};

type PopupContextType = ReturnType<typeof usePopupConfig>;
const popupContext = React.createContext<PopupContextType | null>(null);

const PopupProvider = ({ children }: { children: React.ReactNode }) => {
  const popup = usePopupConfig();

  return (
    <popupContext.Provider value={popup}>
      <Overlay.Provider value={popup.overlay}>
        <PopupComponent
          config={popup.config}
          close={popup.close}
        />
      </Overlay.Provider>
      {children}
    </popupContext.Provider>
  );
};

const usePopup = () => {
  const context = React.useContext(popupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

export const Popup = {
  Provider: PopupProvider,
  usePopup,
};
