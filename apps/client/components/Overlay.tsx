import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';

import React from 'react';
import AsChild from './AsChild';
import { MotiView } from 'moti';
import { Border } from '@/constants';
import { StatusBar } from 'expo-status-bar';
import { useThemeColors } from '@/hooks/useThemeColors';
import { FullWindowOverlay } from 'react-native-screens';
import { GestureResponderEvent, Modal as NativeModal } from 'react-native';

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
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const useConfig = (params?: UseConfigParams): OverlayContext => {
  const {
    defaultOpen = false,
    open: externalOpen = false,
    onOpenChange: setExternalOpen,
  } = params || {};

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  const isControlled =
    externalOpen !== undefined && setExternalOpen !== undefined;

  const open = isControlled ? externalOpen : internalOpen;

  const onToggle = (open: boolean) => {
    if (isControlled) {
      setExternalOpen?.(open);
    } else {
      setInternalOpen(open);
    }
  };

  const bottomSheet = {
    ref: bottomSheetRef,
    open: React.useCallback(() => {
      onToggle(true);
      bottomSheetRef.current?.expand();
    }, [onToggle, bottomSheetRef]),
    close: React.useCallback(() => {
      onToggle(false);
      bottomSheetRef.current?.collapse();
    }, [onToggle, bottomSheetRef]),
  };

  return {
    open,
    onToggle,
    bottomSheet,
  };
};

const use = () => {
  const context = React.useContext(overlayContext);
  if (!context) {
    throw new Error('use must be used within an Overlay.Provider');
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
  const {
    style,
    open = false,
    defaultOpen = false,
    onOpenChange,
    ...restProps
  } = props;
  const context = useConfig({ open, defaultOpen, onOpenChange });

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
        {children}
      </NativeModal>
    </React.Fragment>
  );
});

type SheetRef = React.ComponentRef<typeof BottomSheetView>;
type SheetProps = React.ComponentProps<typeof BottomSheetView> & {
  snapPoints?: string[];
  onDismiss?: () => void;
};
const Sheet = React.forwardRef<SheetRef, SheetProps>((props, _) => {
  const {
    style,
    children,
    onDismiss,
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

export const Overlay = {
  use,
  Root,
  Modal,
  Sheet,
  Trigger,
  Provider,
  useConfig,
  SheetTrigger,
};
