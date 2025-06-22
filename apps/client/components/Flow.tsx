import Box from './Box';
import React from 'react';
import AsChild from './AsChild';
import { GestureResponderEvent } from 'react-native';

type FlowContext<T extends object> = {
  data: T;
  count: number;
  currentStep: number;
  isLastStep: boolean;
  onNextStep: () => void;
  canGoToNextStep: boolean;
  onPreviousStep: () => void;
  canGoToPreviousStep: boolean;
  setStep: (newStep: number) => void;
  skipToStep: (step: number) => void;
  setData: (newData: T) => void;
  reset: () => void;
  progress: number;
  isCompleted: boolean;
};

export const flowContext = React.createContext<FlowContext<any> | null>(null);

export const useFlow = <T extends object>(
  value?: Partial<FlowContext<T>>
): FlowContext<T> => {
  const [currentStep, setCurrentStep] = React.useState(value?.currentStep ?? 0);
  const [data, setData] = React.useState<T>(value?.data ?? ({} as T));
  const [showSuccess, setShowSuccess] = React.useState(false);
  const count = value?.count ?? 0;

  const isLastStep = currentStep === count - 1;
  const canGoToNextStep = currentStep < count - 1;
  const canGoToPreviousStep = currentStep > 0;
  const progress = count > 0 ? (currentStep + 1) / count : 0;
  const isCompleted = showSuccess;

  const handleNextStep = () => {
    if (isLastStep) {
      setShowSuccess(true);
    } else if (canGoToNextStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (canGoToPreviousStep) {
      setCurrentStep((prev) => prev - 1);
    }
    setShowSuccess(false);
  };

  const handleSkipToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < count) {
      setCurrentStep(stepIndex);
      setShowSuccess(false);
    }
  };

  const handleSetData = (newData: Partial<T>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const handleSetStep = (newStep: number) => {
    setCurrentStep(newStep);
    setShowSuccess(false);
  };

  const reset = () => {
    setData({} as T);
    setCurrentStep(value?.currentStep || 0);
    setShowSuccess(false);
  };

  return {
    data,
    count,
    reset,
    progress,
    currentStep,
    isCompleted,
    isLastStep,
    canGoToNextStep,
    canGoToPreviousStep,
    setStep: handleSetStep,
    setData: handleSetData,
    onNextStep: handleNextStep,
    onPreviousStep: handlePreviousStep,
    skipToStep: handleSkipToStep,
  };
};

export const useFlowContext = <T extends object>() => {
  const context = React.useContext(flowContext);

  if (!context) {
    throw new Error('useFlow must be used within a FlowProvider');
  }

  return context as FlowContext<T>;
};

type ProviderRef = React.ComponentRef<typeof AsChild>;
type ProviderProps = Omit<
  React.ComponentProps<typeof AsChild>,
  keyof React.ComponentProps<typeof flowContext.Provider>
> &
  React.ComponentProps<typeof flowContext.Provider>;
const Provider = React.forwardRef<ProviderRef, ProviderProps>((props, ref) => {
  const { value, asChild = false, ...restProps } = props;
  const context = useFlow(value ? value : undefined);

  return (
    <flowContext.Provider value={context}>
      <AsChild
        ref={ref}
        asChild={asChild}
        {...restProps}
      />
    </flowContext.Provider>
  );
});

type RootRef = React.ComponentRef<typeof Box>;
type RootProps = Omit<
  React.ComponentProps<typeof Box>,
  'initialData' | 'initialStep' | 'count'
> & {
  count: number;
  initialStep?: number;
  initialData?: object;
};
const Root = React.forwardRef<RootRef, RootProps>((props, ref) => {
  const {
    style,
    count,
    initialStep = 0,
    initialData = {},
    ...restProps
  } = props;

  const context = useFlow({
    count,
    currentStep: initialStep,
    data: initialData,
  });

  return (
    <Provider
      asChild
      value={context}
    >
      <Box
        style={[{ flex: 1 }, style]}
        ref={ref}
        {...restProps}
      />
    </Provider>
  );
});
Root.displayName = 'Flow.Root';

type ContentRef = React.ComponentRef<typeof Box>;
type ContentProps = Omit<React.ComponentProps<typeof Box>, 'index'> & {
  index: number;
};
const Content = React.forwardRef<ContentRef, ContentProps>((props, ref) => {
  const { index, style, ...restProps } = props;
  const { currentStep, isCompleted } = useFlowContext();

  if (currentStep !== index || isCompleted) return null;

  return (
    <Box
      style={[{ flex: 1 }, style]}
      ref={ref}
      {...restProps}
    />
  );
});
Content.displayName = 'Flow.Content';

type SuccessRef = React.ComponentRef<typeof Box>;
type SuccessProps = React.ComponentProps<typeof Box>;
const Success = React.forwardRef<SuccessRef, SuccessProps>((props, ref) => {
  const { style, ...restProps } = props;
  const { isCompleted } = useFlowContext();

  if (!isCompleted) return null;

  return (
    <Box
      ref={ref}
      style={[{ flex: 1 }, style]}
      {...restProps}
    />
  );
});
Success.displayName = 'Flow.Success';

type PreviousButtonRef = React.ComponentRef<typeof AsChild>;
type PreviousButtonProps = React.ComponentProps<typeof AsChild>;
const PreviousButton = React.forwardRef<PreviousButtonRef, PreviousButtonProps>(
  (props, ref) => {
    const { onPress, ...restProps } = props;
    const { onPreviousStep, canGoToPreviousStep } = useFlowContext();

    const handlePress = (event: GestureResponderEvent) => {
      onPress?.(event);
      onPreviousStep();
    };

    return (
      <AsChild
        ref={ref}
        asChild={true}
        onPress={handlePress}
        disabled={!canGoToPreviousStep}
        {...restProps}
      />
    );
  }
);
PreviousButton.displayName = 'Flow.PreviousButton';

type NextButtonRef = React.ComponentRef<typeof AsChild>;
type NextButtonProps = React.ComponentProps<typeof AsChild> & {
  onComplete?: () => void | Promise<void>;
};
const NextButton = React.forwardRef<NextButtonRef, NextButtonProps>(
  (props, ref) => {
    const { onPress, onComplete, ...restProps } = props;
    const { onNextStep, canGoToNextStep, isCompleted, isLastStep } =
      useFlowContext();

    const handlePress = async (event: GestureResponderEvent) => {
      onPress?.(event);

      if (isLastStep && !isCompleted) {
        await Promise.resolve(onComplete?.());
      } else {
        onNextStep();
      }
    };

    return (
      <AsChild
        ref={ref}
        asChild={true}
        onPress={handlePress}
        disabled={!canGoToNextStep && !isLastStep}
        {...restProps}
      />
    );
  }
);
NextButton.displayName = 'Flow.NextButton';

const Flow = {
  Root,
  Content,
  Provider,
  Success,
  NextButton,
  PreviousButton,
};

export default Flow;
