import React from 'react';
import Text from './Text';
import Action from './Action';
import { Border, Space } from '@/constants';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { useThemeColors } from '@/hooks/useThemeColors';

type Banner = {
  message: string;
  variant: 'success' | 'destructive' | 'warning' | 'info';
  actions?: { label: string; onPress?: () => void }[];
};

const useBannerConfig = () => {
  const [visible, setVisible] = React.useState(false);
  const [Banner, setBanner] = React.useState<Banner>({
    message: '',
    variant: 'success',
    actions: [],
  });

  const close = () => {
    setVisible(false);
    Banner.actions?.[0]?.onPress?.();
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
            transition={{
              delay: 50,
              type: 'spring',
              duration: 300,
            }}
            style={{
              top: 0,
              gap: 16,
              left: 0,
              right: 0,
              zIndex: 9999,
              elevation: 9999,
              paddingTop: 48,
              paddingInline: 16,
              paddingBottom: 16,
              position: 'absolute',
              alignItems: 'center',
              flexDirection: 'row',
              borderBottomLeftRadius: Border.radius['3xl'],
              borderBottomRightRadius: Border.radius['3xl'],
              backgroundColor: backgroundColorMap[Banner.variant],
            }}
          >
            <Text
              weight='medium'
              color='text.base'
              style={{ flex: 1, fontSize: 14, lineHeight: 18 }}
            >
              {Banner.message}
            </Text>
            <MotiView style={{ gap: Space.sm }}>
              {Banner.actions?.map((action, index) => (
                <Action.Root
                  size='2xs'
                  key={index}
                  hitSlop={20}
                  onPress={() => {
                    action.onPress?.();
                    close();
                  }}
                  style={{
                    paddingInline: Space.lg,
                    borderRadius: Border.radius['full'],
                    backgroundColor: colors.getColor('bg.base'),
                  }}
                >
                  <Action.Label
                    size='xs'
                    style={{ color: colors.getColor('text.strong') }}
                  >
                    {action.label}
                  </Action.Label>
                </Action.Root>
              ))}
            </MotiView>
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
