import Box from './Box';
import React from 'react';
import { AnimatePresence, MotiView } from 'moti';

type Context = {
  count: number;
  isLastStep: boolean;
  currentStep: number;
  previous: () => void;
  onSubmit?: () => Promise<void>;
  next: (options?: {
    onValidate?: () => Promise<boolean> | boolean;
  }) => Promise<void>;
};

const flowContext = React.createContext<Context | null>(null);

export const useFlowContext = () => {
  const context = React.useContext(flowContext);
  if (!context) {
    throw new Error('useFlowContext must be used within a Flow.Provider');
  }
  return context;
};

export const useFlow = (values?: {
  count: number;
  onSubmit?: () => Promise<void>;
}): Context => {
  const { count = 1, onSubmit } = values || {};

  const [currentStep, setCurrentStep] = React.useState(1);

  const next = async (options?: {
    onValidate?: () => Promise<boolean> | boolean;
  }) => {
    const { onValidate } = options || {};
    const isValid = (await onValidate?.()) ?? true;
    if (!isValid) return;

    if (currentStep === count) {
      await onSubmit?.();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previous = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return {
    next,
    previous,
    count,
    isLastStep: currentStep === count,
    onSubmit,
    currentStep,
  };
};

type ProviderRef = React.ComponentRef<typeof Box>;
type ProviderProps = React.ComponentProps<typeof Box> &
  React.ComponentProps<typeof flowContext.Provider>;

const Provider = React.forwardRef<ProviderRef, ProviderProps>((props, ref) => {
  const { children, value, ...restProps } = props;

  return (
    <flowContext.Provider value={value}>
      <Box
        ref={ref}
        {...restProps}
      >
        {children}
      </Box>
    </flowContext.Provider>
  );
});

type RootRef = React.ComponentRef<typeof Box>;
type RootProps = React.ComponentProps<typeof Box> &
  Parameters<typeof useFlow>[0];
const Root = React.forwardRef<RootRef, RootProps>((props, ref) => {
  const { children, count, onSubmit, style, ...restProps } = props;

  const value = useFlow({ count, onSubmit });

  return (
    <Provider
      ref={ref}
      {...restProps}
      value={value}
      style={[{ overflow: 'hidden' }, style]}
    >
      {children}
    </Provider>
  );
});

type StepRef = React.ComponentRef<typeof MotiView>;
type StepProps = React.ComponentProps<typeof MotiView> & { index: number };
const Step = React.forwardRef<StepRef, StepProps>((props, ref) => {
  const { index, style, ...restProps } = props;
  const { currentStep } = useFlowContext();

  const isActive = index === currentStep;

  return (
    <AnimatePresence>
      {isActive && (
        <MotiView
          ref={ref}
          style={[{ flex: 1 }, style]}
          animate={{ opacity: 1, translateX: 0 }}
          from={{ opacity: 0, translateX: '100%' }}
          exit={{ opacity: 0, translateX: '-100%' }}
          transition={{ type: 'timing', duration: 400 }}
          {...restProps}
        />
      )}
    </AnimatePresence>
  );
});

type SuccessRef = React.ComponentRef<typeof MotiView>;
type SuccessProps = React.ComponentProps<typeof MotiView>;
const Success = React.forwardRef<SuccessRef, SuccessProps>((props, ref) => {
  const { style, ...restProps } = props;
  const { currentStep, count } = useFlowContext();

  const isActive = currentStep > count;

  return (
    <AnimatePresence>
      {isActive && (
        <MotiView
          ref={ref}
          style={[{ flex: 1 }, style]}
          animate={{ opacity: 1 }}
          from={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'timing', duration: 400 }}
          {...restProps}
        />
      )}
    </AnimatePresence>
  );
});

const Flow = {
  Root,
  Step,
  Success,
  Provider,
};

export default Flow;
