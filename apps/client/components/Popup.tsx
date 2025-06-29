import React from 'react';
import { Space } from '@/constants';
import { Keyboard } from 'react-native';
import { Action, Heading, Overlay, Text, useOverlay } from '@/components';

type Action = {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'destructive';
};

type Config = {
  title: string;
  message: string;
  onDismiss?: () => void;
  actions: Action[];
};

const usePopup = () => {
  const [config, setConfig] = React.useState<Config>({
    title: '',
    message: '',
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
    config.onDismiss?.();
  };

  const Component = () => (
    <Overlay.Sheet
      onDismiss={close}
      snapPoints={['32%']}
    >
      <Overlay.SheetContent
        mt='2xl'
        style={{ gap: Space.base, alignItems: 'center' }}
      >
        <Heading
          size='2xl'
          leading='lg'
          align='center'
          weight='medium'
          style={{ maxWidth: 200, marginInline: 'auto' }}
        >
          {config.title}
        </Heading>
        <Text
          size='lg'
          align='center'
          style={{ maxWidth: 300, marginInline: 'auto' }}
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

  return { open, close, overlay, Component };
};

type Context = ReturnType<typeof usePopup>;

const popupContext = React.createContext<Context | null>(null);

type ProviderProps = {
  children: React.ReactNode;
};

const Provider = ({ children }: ProviderProps) => {
  const context = usePopup();

  return (
    <popupContext.Provider value={context}>
      {children}
      <Overlay.Provider value={context.overlay}>
        <context.Component />
      </Overlay.Provider>
    </popupContext.Provider>
  );
};

export const usePopupContext = () => {
  const context = React.useContext(popupContext);
  if (!context) {
    throw new Error('usePopupContext must be used within a Popup.Provider');
  }
  return context;
};

export default {
  Provider,
};
