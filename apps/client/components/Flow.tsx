import Box from './Box';
import React from 'react';
import AsChild from './AsChild';
import { GestureResponderEvent } from 'react-native';

type FlowContext<T extends object> = {
  data: T;
  count: number;
  value: number;
  isLastStep: boolean;
  onNextStep: () => void;
  canGoToNextStep: boolean;
  onPreviousStep: () => void;
  canGoToPreviousStep: boolean;
  setStep: (newStep: number) => void;
  skipToStep: (step: number) => void;
  setData: (newData: T) => void;
  reset: () => void;
  percent: number;
  isCompleted: boolean;
};

export const flowContext = React.createContext<FlowContext<any> | null>(null);

export const useFlow = <T extends object>(
  value?: Partial<FlowContext<T>>
): FlowContext<T> => {
  const [step, setStep] = React.useState(value?.value ?? 0);
  const [data, setData] = React.useState<T>(value?.data ?? ({} as T));
  const count = value?.count ?? 0;

  const isLastStep = step === count - 1;
  const canGoToNextStep = step < count - 1;
  const canGoToPreviousStep = step > 0;
  const percent = count > 0 ? (step + 1) / count : 0;
  const isCompleted = step > count - 1;

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    if (!canGoToPreviousStep) return;
    setStep((prev) => prev - 1);
  };

  const handleSkipToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < count) {
      setStep(stepIndex);
    }
  };

  const handleSetData = (newData: Partial<T>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const handleSetStep = (newStep: number) => {
    setStep(newStep);
  };

  const reset = () => {
    setData({} as T);
    setStep(value?.value || 0);
  };

  return {
    data,
    count,
    reset,
    percent,
    value: step,
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
    throw new Error('useStep must be used within a StepProvider');
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
    value: initialStep,
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
Root.displayName = 'Step.Root';

type ContentRef = React.ComponentRef<typeof Box>;
type ContentProps = Omit<React.ComponentProps<typeof Box>, 'index'> & {
  index: number;
};
const Content = React.forwardRef<ContentRef, ContentProps>((props, ref) => {
  const { index, style, ...restProps } = props;
  const { value } = useFlowContext();

  if (value !== index) return null;

  return (
    <Box
      style={[{ flex: 1 }, style]}
      ref={ref}
      {...restProps}
    />
  );
});
Content.displayName = 'Step.Content';

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
Success.displayName = 'Step.Success';

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
PreviousButton.displayName = 'Step.PreviousButton';

type NextButtonRef = React.ComponentRef<typeof AsChild>;
type NextButtonProps = React.ComponentProps<typeof AsChild>;
const NextButton = React.forwardRef<NextButtonRef, NextButtonProps>(
  (props, ref) => {
    const { onPress, ...restProps } = props;
    const { onNextStep, canGoToNextStep } = useFlowContext();

    const handlePress = (event: GestureResponderEvent) => {
      onPress?.(event);
      onNextStep();
    };

    return (
      <AsChild
        ref={ref}
        asChild={true}
        onPress={handlePress}
        disabled={!canGoToNextStep}
        {...restProps}
      />
    );
  }
);
NextButton.displayName = 'Step.NextButton';

const Flow = {
  Root,
  Content,
  Provider,
  Success,
  NextButton,
  PreviousButton,
};

export default Flow;
