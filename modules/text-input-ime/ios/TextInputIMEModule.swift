import ExpoModulesCore

public class TextInputIMEModule: Module {
  public func definition() -> ModuleDefinition {
    Name("TextInputIME")

    View(TextInputIMEView.self) {
      Events(
        "onChangeText",
        "onCompositionStart",
        "onCompositionUpdate",
        "onCompositionEnd"
      )

      Prop("value") { (view: TextInputIMEView, text: String) in
        view.setValue(text)
      }
    }
  }
}
