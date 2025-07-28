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
import Blur from './Blur';
import AsChild from './AsChild';
import { MotiView } from 'moti';

type OverlayContext = {
  open: boolean;
  bottomSheet: {
    open: () => void;
    close: () => void;
    ref: React.RefObject<BottomSheet | null>;
  };
  onToggle: (open: boolean) => void;
};

const overlayContext = React.createContext<OverlayContext | null>(null);

type UseConfigParams = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const useConfig = (params: UseConfigParams): OverlayContext => {
  const { open: externalOpen = false, onOpenChange: setExternalOpen } =
    params || {};

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = externalOpen !== undefined;

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

const use = () => {
  const context = React.useContext(overlayContext);
  if (!context) {
    throw new Error('useOverlayContext must be used within an Overlay.Root');
  }
  return context;
};

type ProviderRef = React.ComponentRef<typeof MotiView>;
type ProviderProps = React.ComponentProps<typeof MotiView> &
  React.ComponentProps<typeof overlayContext.Provider>;

const Provider = React.forwardRef<ProviderRef, ProviderProps>((props, ref) => {
  const { value, ...restProps } = props;

  return (
    <overlayContext.Provider value={value}>
      <MotiView
        ref={ref}
        {...restProps}
      />
    </overlayContext.Provider>
  );
});

type RootRef = React.ComponentRef<typeof MotiView>;
type RootProps = React.ComponentProps<typeof MotiView> & UseConfigParams;
const Root = React.forwardRef<RootRef, RootProps>((props, ref) => {
  const { style, open = false, onOpenChange, ...restProps } = props;
  const context = useConfig({ open, onOpenChange });

  return (
    <Provider value={context}>
      <MotiView
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
  const { open, onToggle } = use();

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
    const { open, bottomSheet } = use();

    const handlePress = (event: GestureResponderEvent) => {
      onPress?.(event);
      if (open) {
        bottomSheet.close();
        return;
      }
      bottomSheet.open();
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
  const { open } = use();

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
  const { bottomSheet, open } = use();

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
            overflow: 'hidden',
            borderRadius: Border.radius['3xl'],
            backgroundColor: colors.getColor('bg.base'),
          }}
          index={memoizedSnapPoints.length - 1}
          handleIndicatorStyle={{
            height: 6,
            width: 64,
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
  Provider,
  Root,
  Trigger,
  Modal,
  useConfig,
  use,
  Sheet,
  SheetTrigger,
};

export default Overlay;
