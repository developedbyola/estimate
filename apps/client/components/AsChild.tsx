// components/AsChild.tsx
import React from "react";
import { Pressable } from "react-native";

type AsChildRef = React.ComponentRef<typeof Pressable>;
type AsChildProps = React.ComponentProps<typeof Pressable> & {
  asChild?: boolean;
};

const AsChild = React.forwardRef<AsChildRef, AsChildProps>((props, ref) => {
  const { children, asChild, ...restProps } = props;
  if (!React.isValidElement(children)) {
    console.warn("AsChild expects a single valid React element as its child.");
    return null;
  }

  if (asChild) {
    return React.cloneElement(children, {
      ...restProps,
    });
  }

  return (
    <Pressable ref={ref} {...props}>
      {children}
    </Pressable>
  );
});

export default AsChild;
