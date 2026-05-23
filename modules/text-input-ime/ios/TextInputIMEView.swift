import ExpoModulesCore
import UIKit

class IMEAwareTextField: UITextField {
  weak var owner: TextInputIMEView?
  private var isComposing = false

  override func setMarkedText(_ markedText: String?, selectedRange: NSRange) {
    super.setMarkedText(markedText, selectedRange: selectedRange)
    let text = markedText ?? ""
    if markedTextRange != nil && !isComposing {
      isComposing = true
      owner?.onCompositionStart([:])
    }
    if isComposing {
      owner?.onCompositionUpdate(["text": text])
    }
  }

  override func unmarkText() {
    let wasComposing = isComposing
    super.unmarkText()
    if wasComposing {
      isComposing = false
      owner?.onCompositionEnd(["text": self.text ?? ""])
    }
  }
}

class TextInputIMEView: ExpoView {
  let textField = IMEAwareTextField()
  let onChangeText = EventDispatcher()
  let onCompositionStart = EventDispatcher()
  let onCompositionUpdate = EventDispatcher()
  let onCompositionEnd = EventDispatcher()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    textField.owner = self
    textField.borderStyle = .roundedRect
    textField.addTarget(self, action: #selector(handleEditingChanged), for: .editingChanged)
    addSubview(textField)
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    textField.frame = bounds
  }

  func setValue(_ text: String) {
    if textField.markedTextRange != nil { return }
    if textField.text != text {
      textField.text = text
    }
  }

  @objc private func handleEditingChanged() {
    if textField.markedTextRange != nil { return }
    onChangeText(["text": textField.text ?? ""])
  }
}
