import ExpoModulesCore
import UIKit

class TextInputIMEView: ExpoView {
  let onChangeText = EventDispatcher()
  let onCompositionStart = EventDispatcher()
  let onCompositionUpdate = EventDispatcher()
  let onCompositionEnd = EventDispatcher()

  private let textField = IMEAwareTextField()
  private var composing = false
  private var lastMarked: String?

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    textField.onMarkedTextChange = { [weak self] in self?.syncComposing() }
    textField.addTarget(self, action: #selector(editingChanged), for: .editingChanged)
    addSubview(textField)
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    textField.frame = bounds
  }

  func setValue(_ text: String) {
    guard textField.markedTextRange == nil, textField.text != text else { return }
    textField.text = text
  }

  @objc private func editingChanged() {
    syncComposing()
    if textField.markedTextRange == nil {
      onChangeText(["text": textField.text ?? ""])
    }
  }

  private func syncComposing() {
    let range = textField.markedTextRange
    if range != nil, !composing {
      composing = true
      lastMarked = nil
      onCompositionStart()
    }
    if let range {
      let marked = textField.text(in: range) ?? ""
      if marked != lastMarked {
        lastMarked = marked
        onCompositionUpdate(["text": marked])
      }
    } else if composing {
      composing = false
      lastMarked = nil
      onCompositionEnd(["text": textField.text ?? ""])
    }
  }
}

private class IMEAwareTextField: UITextField {
  var onMarkedTextChange: (() -> Void)?

  override func setMarkedText(_ markedText: String?, selectedRange: NSRange) {
    super.setMarkedText(markedText, selectedRange: selectedRange)
    onMarkedTextChange?()
  }

  override func unmarkText() {
    super.unmarkText()
    onMarkedTextChange?()
  }
}
