# rn-ime

[中文](./README.zh.md)

A reference Expo native module that surfaces iOS IME composition events to React Native.

## What this fixes

React Native's built-in `<TextInput>` does not expose IME (input method editor) composition lifecycle events on iOS. Apps only see `onChangeText`, which fires for committed text. There is no way to know whether the user is mid-composition (e.g. typing `ni` to select `你`) or what the in-flight marked text is.

This matters for:

- Search-as-you-type that should wait for the composition to commit before firing a request
- Length validation that shouldn't count uncommitted marked text
- Autocomplete that should suppress matches while the user is still composing

`TextInputIME` wraps `UITextField` and exposes four events that mirror the W3C `CompositionEvent` API:

| Event | When it fires |
| --- | --- |
| `onCompositionStart()` | User begins composing |
| `onCompositionUpdate(text)` | Marked text changes during composition |
| `onCompositionEnd(text)` | Composition is committed or aborted |
| `onChangeText(text)` | Final committed text — does not fire during composition |

## Implementation notes

The non-obvious part is detecting composition end reliably. iOS commits IME input through one of three paths:

1. `unmarkText` — the documented signal
2. `setMarkedText("", ...)` followed by `insertText(...)` — common in practice
3. `insertText(...)` directly, which internally calls `unmarkText`

A naive override of only `unmarkText` misses path (2) and the `composing` flag gets stuck at `true`. The fix in `modules/text-input-ime/ios/TextInputIMEView.swift` routes all three paths through a single `syncComposing()` that is **edge-triggered** on `markedTextRange != nil`, so start and end fire exactly once per composition regardless of how the IME chooses to commit. A `lastMarked` cache dedupes `onCompositionUpdate` because the same keystroke triggers both `setMarkedText` (overridden) and the `editingChanged` control event.

## Status: reference implementation

This is a minimal, illustrative implementation — **not** a drop-in replacement for `<TextInput>`:

- **iOS only.** No Android implementation.
- **The standard IME underline under marked text is lost.** UITextField normally renders the in-progress marked text with a dotted underline; this implementation does not preserve that styling. The marked text is still visible inline, but without the underline cue.
- **Minimal style support.** The wrapper forwards `ViewStyle` as-is. RN's `TextInput` treats `padding` as `textContainerInset` on `RCTUITextField`; this wrapper does not. Use `height` instead of `padding` if you want to match RN's visual sizing (see `app.tsx`).
- **No prop forwarding** for `fontSize`, `color`, `keyboardType`, `secureTextEntry`, `placeholder`, `multiline`, accessibility, etc.

For production use, extend `TextInputIMEView.swift` with the properties you need and register them in `TextInputIMEModule.swift`.

## Demo

```sh
bun install
bun run ios
```

Switch to a Chinese / Japanese / Korean keyboard and start typing — the demo shows composition state and marked text alongside a baseline RN `TextInput` for comparison.
