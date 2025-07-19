import React from 'react';
import Text from './Text';
import { Button, useColorScheme } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Border } from '@/constants';
import Action from './Action';
import { StatusBar } from 'expo-status-bar';

type Banner = {
  message: string;
  variant: 'success' | 'destructive' | 'warning' | 'info';
  action?: { label: string; onPress?: () => void };
};

const useBannerConfig = () => {
  const [visible, setVisible] = React.useState(false);
  const [Banner, setBanner] = React.useState<Banner>({
    message: '',
    variant: 'success',
    action: {
      label: '',
      onPress: undefined,
    },
  });

  const close = () => {
    setVisible(false);
    Banner.action?.onPress?.();
  };

  const open = (newBanner: Banner) => {
    setBanner(newBanner);
    setVisible(true);
  };

  return {
    open,
    Banner,
    close,
    visible,
  };
};

type BannerContext = ReturnType<typeof useBannerConfig>;

const BannerContext = React.createContext<BannerContext | null>(null);

const BannerProvider = ({ children }: { children: React.ReactNode }) => {
  const BannerConfig = useBannerConfig();
  const colors = useThemeColors();

  return (
    <BannerContext.Provider value={BannerConfig}>
      {children}
      {BannerConfig.visible && (
        <BannerComponent
          visible={BannerConfig.visible}
          Banner={BannerConfig.Banner}
          close={BannerConfig.close}
        />
      )}
    </BannerContext.Provider>
  );
};

const BannerComponent = ({
  visible,
  Banner,
  close,
}: {
  visible: boolean;
  Banner: Banner;
  close: () => void;
}) => {
  const theme = useColorScheme();
  const colors = useThemeColors();

  const backgroundColorMap = {
    success: colors.getColor('success.base'),
    destructive: colors.getColor('error.base'),
    warning: colors.getColor('warning.base'),
    info: colors.getColor('info.base'),
  };

  return (
    <React.Fragment>
      <StatusBar style={theme === 'dark' ? 'dark' : 'light'} />
      <AnimatePresence>
        {visible && (
          <MotiView
            key='Banner'
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -10 }}
            style={{
              top: 0,
              gap: 16,
              left: 0,
              right: 0,
              paddingTop: 48,
              paddingInline: 16,
              paddingBottom: 16,
              alignItems: 'center',
              position: 'absolute',
              flexDirection: 'row',
              borderBottomLeftRadius: Border.radius['3xl'],
              borderBottomRightRadius: Border.radius['3xl'],
              backgroundColor: backgroundColorMap[Banner.variant],
            }}
          >
            <Text
              size='sm'
              leading='xs'
              weight='medium'
              color='text.base'
              style={{ flex: 1 }}
            >
              {Banner.message}
            </Text>
            {Banner.action && (
              <Action.Root
                size='xs'
                onPress={close}
                style={{
                  borderRadius: 8,
                  backgroundColor: colors.getColor('bg.base'),
                }}
              >
                <Action.Label
                  size='xs'
                  style={{ color: colors.getColor('text.strong') }}
                >
                  {Banner.action.label}
                </Action.Label>
              </Action.Root>
            )}
          </MotiView>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

const useBanner = () => {
  const context = React.useContext(BannerContext);
  if (!context) {
    throw new Error('useBanner must be used within an Banner.Provider');
  }
  return context;
};

export const Banner = {
  useBanner,
  Provider: BannerProvider,
};
