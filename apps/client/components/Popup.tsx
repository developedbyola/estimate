import React from 'react';
import { Space } from '@/constants';
import { Keyboard } from 'react-native';
import { Action, Heading, Overlay, Text, useOverlay } from '@/components';
import { Ionicons } from '@expo/vector-icons';

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

const Component = ({
  config,
  close,
}: {
  config: Config;
  close: () => void;
}) => {
  const iconName = {
    success: 'checkmark-circle-outline',
    error: 'alert-circle-outline',
    warning: 'alert-circle-outline',
    info: 'information-circle-outline',
  };
  return (
    <Overlay.Sheet
      onDismiss={close}
      snapPoints={['32%']}
    >
      <Ionicons
        size={24}
        color='text.strong'
        name={iconName[config.variant || 'success'] as any}
      />
      <Overlay.SheetContent
        mt='2xl'
        style={{ gap: Space.base, alignItems: 'center' }}
      >
        <Heading
          size='2xl'
          leading='lg'
          align='center'
          weight='medium'
          style={{ maxWidth: 280, marginInline: 'auto' }}
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

const usePopup = () => {
  const [config, setConfig] = React.useState<
    Omit<Config, 'actions' | 'onDismiss'> & { actions: PopupAction[] }
  >({
    title: '',
    message: '',
    variant: 'success',
    actions: [{ text: 'Cancel', variant: 'primary', onPress: () => {} }],
  });

  const overlay = useOverlay();

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

type Context = ReturnType<typeof usePopup>;

const PopupContext = React.createContext<Context | null>(null);

type ProviderProps = {
  children: React.ReactNode;
};

const Provider = ({ children }: ProviderProps) => {
  const context = usePopup();

  return (
    <PopupContext.Provider value={context}>
      {children}
      <Overlay.Provider value={context.overlay}>
        <Component
          config={context.config}
          close={context.close}
        />
      </Overlay.Provider>
    </PopupContext.Provider>
  );
};

export const usePopupContext = () => {
  const context = React.useContext(PopupContext);
  if (!context) {
    throw new Error('usePopupContext must be used within a Popup.Provider');
  }
  return context;
};

export default {
  Provider,
};
