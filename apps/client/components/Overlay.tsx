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
import { Box, Blur, AsChild } from '@/components';

type OverlayContext = {
  open: boolean;
  close: () => void;
  openBottomSheet?: () => void;
  bottomSheet: {
    ref: React.RefObject<BottomSheet | null>;
    open: () => void;
    close: () => void;
  };
  onOpenChange: (open: boolean) => void;
};

export const overlayContext = React.createContext<OverlayContext | null>(null);

export const useOverlay = (value?: Partial<OverlayContext>): OverlayContext => {
  const { open: externalOpen = false, onOpenChange: setExternalOpen } =
    value || {};

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = setExternalOpen !== undefined;

  const open = isControlled ? externalOpen : internalOpen;

  const onOpenChange = React.useCallback(
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
    onOpenChange(false);
  }, [onOpenChange]);

  const closeBottomSheet = React.useCallback(() => {
    onOpenChange(false);
    bottomSheetRef.current?.collapse();
  }, [onOpenChange]);

  const openBottomSheet = React.useCallback(() => {
    onOpenChange(true);
    bottomSheetRef.current?.expand();
  }, [onOpenChange]);

  return {
    open, // Ensure open is never undefined
    close,
    onOpenChange,
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

type ProviderRef = React.ComponentRef<typeof AsChild>;
type ProviderProps = React.ComponentProps<typeof AsChild> &
  React.ComponentProps<typeof overlayContext.Provider>;

const Provider = React.forwardRef<ProviderRef, ProviderProps>((props, ref) => {
  const { value, asChild = true, ...restProps } = props;

  return (
    <overlayContext.Provider value={value}>
      <AsChild
        ref={ref}
        asChild={asChild}
        {...restProps}
      />
    </overlayContext.Provider>
  );
});

type RootRef = React.ComponentRef<typeof Box>;
type RootProps = React.ComponentProps<typeof Box>;
const Root = React.forwardRef<RootRef, RootProps>((props, ref) => {
  const { style, ...restProps } = props;
  const context = useOverlay();

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
  const { open, onOpenChange } = useOverlayContext();

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.(event);
    onOpenChange(!open);
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
  statusBarStyle?: 'dark' | 'light';
};
const Sheet = React.forwardRef<SheetRef, SheetProps>((props, _) => {
  const {
    style,
    children,
    statusBarStyle = 'light',
    snapPoints = ['25%', '50%', '75%'],
    ...restProps
  } = props;
  const { bottomSheet, open } = useOverlayContext();

  const colors = useThemeColors();
  const theme = useColorScheme() ?? 'light';

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
          index={memoizedSnapPoints.length - 1}
          style={{
            overflow: 'hidden',
            borderRadius: Border.radius['3xl'],
            backgroundColor: colors.getColor('bg.soft'),
          }}
          handleIndicatorStyle={{
            height: 6,
            width: 64,
            borderRadius: Border.radius.full,
            backgroundColor: colors.getColor('border.subtle'),
          }}
          backdropComponent={backdrop}
          snapPoints={memoizedSnapPoints}
          onClose={() => bottomSheet.close()}
          {...restProps}
        >
          <BottomSheetView
            style={[
              {
                flex: 1,
                height: '100%',
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

const Overlay = {
  Root,
  Trigger,
  Modal,
  Sheet,
  SheetTrigger,
};

export default Overlay;
