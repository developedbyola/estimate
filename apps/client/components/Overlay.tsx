import React from 'react';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
  GestureResponderEvent,
  Modal as NativeModal,
  useColorScheme,
} from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { FullWindowOverlay } from 'react-native-screens';
import { StatusBar } from 'expo-status-bar';
import { Border } from '@/constants';
import Box from './Box';
import Blur from './Blur';
import AsChild from './AsChild';
import Scroll from './Scroll';

type OverlayContext = {
  open: boolean;
  bottomSheet: {
    open: () => void;
    close: () => void;
    ref: React.RefObject<BottomSheet | null>;
  };
  onToggle: (open: boolean) => void;
};

export const overlayContext = React.createContext<OverlayContext | null>(null);

export const useOverlay = (value?: Partial<OverlayContext>): OverlayContext => {
  const { open: externalOpen = false, onToggle: setExternalOpen } = value || {};

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = setExternalOpen !== undefined;

  const open = isControlled ? externalOpen : internalOpen;

  const onToggle = React.useCallback(
    (open: boolean) => {
      if (isControlled) {
        setExternalOpen?.(open);
      } else {
        setInternalOpen(open);
      }
    },
    [isControlled, setExternalOpen]
  );

  const close = React.useCallback(() => {
    onToggle(false);
  }, [onToggle]);

  const closeBottomSheet = React.useCallback(() => {
    onToggle(false);
    bottomSheetRef.current?.collapse();
  }, [onToggle]);

  const openBottomSheet = React.useCallback(() => {
    onToggle(true);
    bottomSheetRef.current?.expand();
  }, [onToggle]);

  return {
    open, // Ensure open is never undefined
    onToggle,
    bottomSheet: {
      ref: bottomSheetRef,
      open: openBottomSheet,
      close: closeBottomSheet,
    },
  };
};

export const useOverlayContext = () => {
  const context = React.useContext(overlayContext);
  if (!context) {
    throw new Error('useOverlayContext must be used within an Overlay.Root');
  }
  return context;
};

type ProviderRef = React.ComponentRef<typeof Box>;
type ProviderProps = React.ComponentProps<typeof Box> &
  React.ComponentProps<typeof overlayContext.Provider>;

const Provider = React.forwardRef<ProviderRef, ProviderProps>((props, ref) => {
  const { value, ...restProps } = props;

  return (
    <overlayContext.Provider value={value}>
      <Box
        ref={ref}
        {...restProps}
      />
    </overlayContext.Provider>
  );
});

type RootRef = React.ComponentRef<typeof Box>;
type RootProps = React.ComponentProps<typeof Box> & {
  open?: boolean;
  onToggle?: (open: boolean) => void;
};
const Root = React.forwardRef<RootRef, RootProps>((props, ref) => {
  const { style, open = false, ...restProps } = props;
  const context = useOverlay({ open });

  return (
    <Provider value={context}>
      <Box
        ref={ref}
        style={[style]}
        {...restProps}
      />
    </Provider>
  );
});

type TriggerRef = React.ComponentRef<typeof AsChild>;
type TriggerProps = React.ComponentProps<typeof AsChild>;
const Trigger = React.forwardRef<TriggerRef, TriggerProps>((props, ref) => {
  const { asChild = true, onPress, ...restProps } = props;
  const { open, onToggle } = useOverlayContext();

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.(event);
    onToggle(!open);
  };

  return (
    <AsChild
      ref={ref}
      asChild={asChild}
      onPress={handlePress}
      {...restProps}
    />
  );
});

type SheetTriggerRef = React.ComponentRef<typeof AsChild>;
type SheetTriggerProps = React.ComponentProps<typeof AsChild>;
const SheetTrigger = React.forwardRef<SheetTriggerRef, SheetTriggerProps>(
  (props, ref) => {
    const { asChild = true, onPress, ...restProps } = props;
    const { open, bottomSheet } = useOverlayContext();

    const handlePress = (event: GestureResponderEvent) => {
      if (open) {
        bottomSheet.close();
        return;
      }
      bottomSheet.open();
      onPress?.(event);
    };

    return (
      <AsChild
        ref={ref}
        asChild={asChild}
        onPress={handlePress}
        {...restProps}
      />
    );
  }
);

type ModalRef = React.ComponentRef<typeof NativeModal>;
type ModalProps = React.ComponentProps<typeof NativeModal> & {
  statusBarStyle?: 'dark' | 'light';
};
const Modal = React.forwardRef<ModalRef, ModalProps>((props, ref) => {
  const {
    style,
    children,
    animationType = 'slide',
    statusBarStyle = 'light',
    statusBarTranslucent = true,
    presentationStyle = 'formSheet',
    ...restProps
  } = props;

  const colors = useThemeColors();
  const theme = useColorScheme() ?? 'light';
  const { open } = useOverlayContext();

  return (
    <React.Fragment>
      <StatusBar style={statusBarStyle} />
      <NativeModal
        ref={ref}
        visible={open}
        animationType={animationType}
        presentationStyle={presentationStyle}
        statusBarTranslucent={statusBarTranslucent}
        backdropColor={colors.getColor('bg.overlay')}
        {...restProps}
      >
        <Blur
          tint={theme}
          intensity={100}
          style={[{ flex: 1 }]}
        >
          {children}
        </Blur>
      </NativeModal>
    </React.Fragment>
  );
});

type SheetRef = React.ComponentRef<typeof BottomSheetView>;
type SheetProps = React.ComponentProps<typeof BottomSheetView> & {
  snapPoints?: string[];
  onDismiss?: () => void;
  statusBarStyle?: 'dark' | 'light';
};
const Sheet = React.forwardRef<SheetRef, SheetProps>((props, _) => {
  const {
    style,
    children,
    onDismiss,
    statusBarStyle = 'light',
    snapPoints = ['25%', '50%', '75%'],
    ...restProps
  } = props;
  const { bottomSheet, open } = useOverlayContext();

  const colors = useThemeColors();

  const memoizedSnapPoints = React.useMemo(() => snapPoints, []);

  const backdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={'none'}
      />
    ),
    []
  );

  if (!open) return null;

  return (
    <React.Fragment>
      <StatusBar style={statusBarStyle} />

      <FullWindowOverlay>
        <BottomSheet
          enablePanDownToClose
          ref={bottomSheet.ref}
          enableDynamicSizing={false}
          keyboardBehavior='fillParent'
          backgroundStyle={{
            padding: 20,
            backgroundColor: 'transparent',
          }}
          index={memoizedSnapPoints.length - 1}
          handleIndicatorStyle={{
            height: 6,
            width: 64,
            marginTop: 24,
            borderRadius: Border.radius.full,
            backgroundColor: colors.getColor('border.soft'),
          }}
          backdropComponent={backdrop}
          snapPoints={memoizedSnapPoints}
          onClose={() => bottomSheet.close()}
          onChange={(index) => {
            if (index === -1) {
              onDismiss?.();
            }
          }}
          {...restProps}
        >
          <BottomSheetView
            style={[
              {
                flex: 1,
                height: '100%',
                borderRadius: Border.radius['3xl'],
                backgroundColor: colors.getColor('bg.base'),
              },
              style,
            ]}
            {...restProps}
          >
            {children}
          </BottomSheetView>
        </BottomSheet>
      </FullWindowOverlay>
    </React.Fragment>
  );
});

type SheetHeaderRef = React.ComponentRef<typeof Box>;
type SheetHeaderProps = React.ComponentProps<typeof Box>;
const SheetHeader = React.forwardRef<SheetHeaderRef, SheetHeaderProps>(
  (props, ref) => {
    const { style, px = 'xl', py = 'sm', ...restProps } = props;
    return (
      <Box
        ref={ref}
        px={px}
        py={py}
        style={[style]}
        {...restProps}
      />
    );
  }
);

type SheetContentRef = React.ComponentRef<typeof Scroll>;
type SheetContentProps = React.ComponentProps<typeof Scroll>;
const SheetContent = React.forwardRef<SheetContentRef, SheetContentProps>(
  (props, ref) => {
    const { style, contentContainerStyle, px = 'xl', ...restProps } = props;
    return (
      <Scroll
        ref={ref}
        px={px}
        contentContainerStyle={[style]}
        {...restProps}
      />
    );
  }
);

type SheetFooterRef = React.ComponentRef<typeof Box>;
type SheetFooterProps = React.ComponentProps<typeof Box>;
const SheetFooter = React.forwardRef<SheetFooterRef, SheetFooterProps>(
  (props, ref) => {
    const {
      style,
      px = 'xl',
      pt = 'base',
      pb = '4xl',
      bg = 'bg.soft',
      ...restProps
    } = props;

    const colors = useThemeColors();
    return (
      <Box
        ref={ref}
        px={px}
        pt={pt}
        pb={pb}
        bg={bg}
        style={[
          {
            position: 'absolute',
            borderTopWidth: 1,
            borderTopColor: colors.getColor('border.soft'),
            bottom: 0,
            width: '100%',
          },
          style,
        ]}
        {...restProps}
      />
    );
  }
);

const Overlay = {
  Provider,
  Root,
  Trigger,
  Modal,
  Sheet,
  SheetTrigger,
  SheetHeader,
  SheetContent,
  SheetFooter,
};

export default Overlay;
