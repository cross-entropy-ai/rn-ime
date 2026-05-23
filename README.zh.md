# rn-ime

[English](./README.md)

一份把 iOS IME 合成事件暴露给 React Native 的 Expo 原生模块**参考实现**。

## 修了什么

React Native 自带的 `<TextInput>` 在 iOS 上不暴露 IME 合成的生命周期事件。App 只能拿到 `onChangeText`（提交后的文本），没办法知道用户当前是不是正在合成（比如打 `ni` 等着选 `你`），也拿不到合成中的 marked text。

这会影响以下场景：

- search-as-you-type 想等合成提交后再发请求
- 长度校验不希望把未提交的 marked text 算进去
- 自动补全在合成中希望先不触发匹配

`TextInputIME` 包了 `UITextField`，暴露 4 个事件，对应 W3C `CompositionEvent`：

| 事件 | 触发时机 |
| --- | --- |
| `onCompositionStart()` | 开始合成 |
| `onCompositionUpdate(text)` | 合成中 marked text 变化 |
| `onCompositionEnd(text)` | 合成提交或终止 |
| `onChangeText(text)` | 最终提交的文本 —— 合成期间不触发 |

## 实现要点

关键在于**可靠地检测合成结束**。iOS 提交 IME 输入有三条路径：

1. `unmarkText` —— 文档里的标准信号
2. `setMarkedText("", ...)` 后接 `insertText(...)` —— 实际很常见
3. 直接 `insertText(...)`，内部隐式调 `unmarkText`

只 override `unmarkText` 会漏掉路径 (2)，`composing` 状态会卡在 true。`modules/text-input-ime/ios/TextInputIMEView.swift` 里的做法是把三条路径都汇到 `syncComposing()`，用 `markedTextRange != nil` 的**边沿**驱动 start/end —— 不管 IME 走哪条路径，每次合成 start 和 end 都各只发一次。`lastMarked` 缓存用来给 `onCompositionUpdate` 去重，因为同一次按键会同时触发 `setMarkedText`（已 override）和 `editingChanged` 控件事件，不去重会发两次重复事件。

## 状态：参考实现

这是一份最小、示意性的实现，**不是** `<TextInput>` 的替代品：

- **仅 iOS**，没有 Android 实现。
- **会丢失 IME 合成的下划线**。UITextField 正常情况下会在合成中的 marked text 下方显示点状下划线，本实现没有保留这个样式。marked text 仍然会显示在输入框里，但少了下划线提示。
- **样式支持有限**。wrapper 直接透传 `ViewStyle`。RN 的 `TextInput` 把 `padding` 解释成 `RCTUITextField` 的 `textContainerInset`，这里没做这层映射。想跟 RN 的视觉尺寸对齐，请用 `height` 而不是 `padding`（见 `app.tsx`）。
- **未转发** `fontSize`、`color`、`keyboardType`、`secureTextEntry`、`placeholder`、`multiline`、无障碍属性等。

要用到生产环境，请按需在 `TextInputIMEView.swift` 里加属性，并在 `TextInputIMEModule.swift` 里注册。

## Demo

```sh
bun install
bun run ios
```

切到中 / 日 / 韩输入法开始输入 —— demo 会显示合成状态和 marked text，旁边有一个 RN 原生 `TextInput` 作为对照。
