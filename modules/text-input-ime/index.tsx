import { requireNativeView } from "expo";
import type { ComponentType } from "react";
import type { StyleProp, ViewStyle } from "react-native";

const DEFAULT_STYLE: ViewStyle = { minHeight: 36 };

type NativeEvent<T> = { nativeEvent: T };
type NativeProps = {
  value?: string;
  style?: StyleProp<ViewStyle>;
  onChangeText?: (e: NativeEvent<{ text: string }>) => void;
  onCompositionStart?: () => void;
  onCompositionUpdate?: (e: NativeEvent<{ text: string }>) => void;
  onCompositionEnd?: (e: NativeEvent<{ text: string }>) => void;
};

const NativeView: ComponentType<NativeProps> =
  requireNativeView("TextInputIME");

export type TextInputIMEProps = {
  value?: string;
  style?: StyleProp<ViewStyle>;
  onChangeText?: (text: string) => void;
  onCompositionStart?: () => void;
  onCompositionUpdate?: (text: string) => void;
  onCompositionEnd?: (text: string) => void;
};

export default function TextInputIME(props: TextInputIMEProps) {
  return (
    <NativeView
      value={props.value}
      style={[DEFAULT_STYLE, props.style]}
      onChangeText={(e) => props.onChangeText?.(e.nativeEvent.text)}
      onCompositionStart={props.onCompositionStart}
      onCompositionUpdate={(e) =>
        props.onCompositionUpdate?.(e.nativeEvent.text)
      }
      onCompositionEnd={(e) => props.onCompositionEnd?.(e.nativeEvent.text)}
    />
  );
}
