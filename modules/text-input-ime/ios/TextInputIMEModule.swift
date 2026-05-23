import ExpoModulesCore

public class TextInputIMEModule: Module {
  public func definition() -> ModuleDefinition {
    Name("TextInputIME")

    Function("hello") { () -> String in
      return "Hello from TextInputIME"
    }
  }
}
