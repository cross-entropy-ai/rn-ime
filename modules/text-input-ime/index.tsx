import { requireNativeView } from "expo";
import type * as React from "react";
import type { StyleProp, ViewStyle } from "react-native";

type NativeProps = {
  value?: string;
  onChangeText?: (e: { nativeEvent: { text: string } }) => void;
  onCompositionStart?: (e: { nativeEvent: Record<string, never> }) => void;
  onCompositionUpdate?: (e: { nativeEvent: { text: string } }) => void;
  onCompositionEnd?: (e: { nativeEvent: { text: string } }) => void;
  style?: StyleProp<ViewStyle>;
};

const NativeView: React.ComponentType<NativeProps> =
  requireNativeView("TextInputIME");

export type TextInputIMEProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  onCompositionStart?: () => void;
  onCompositionUpdate?: (text: string) => void;
  onCompositionEnd?: (text: string) => void;
  style?: StyleProp<ViewStyle>;
};

export default function TextInputIME({
  value,
  onChangeText,
  onCompositionStart,
  onCompositionUpdate,
  onCompositionEnd,
  style,
}: TextInputIMEProps) {
  return (
    <NativeView
      value={value}
      onChangeText={onChangeText && ((e) => onChangeText(e.nativeEvent.text))}
      onCompositionStart={onCompositionStart && (() => onCompositionStart())}
      onCompositionUpdate={
        onCompositionUpdate && ((e) => onCompositionUpdate(e.nativeEvent.text))
      }
      onCompositionEnd={
        onCompositionEnd && ((e) => onCompositionEnd(e.nativeEvent.text))
      }
      style={style}
    />
  );
}
