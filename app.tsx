import { useState } from "react";
import {
  ScrollView,
  type StyleProp,
  Text,
  TextInput,
  View,
  type ViewStyle,
} from "react-native";
import TextInputIME from "./modules/text-input-ime";

const TextInputStyle: StyleProp<ViewStyle> = {
  borderWidth: 1,
  borderRadius: 4,
  padding: 4,
};

export default function App() {
  const [rnText, setRnText] = useState("");
  const [rnIMEText, setRnIMEText] = useState("");

  return (
    <ScrollView
      style={{
        width: "100%",
        height: "100%",
        paddingVertical: 80,
        paddingHorizontal: 40,
      }}
    >
      <View style={{ gap: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          Text Input Demo
        </Text>

        <View style={{ gap: 8 }}>
          <Text>React Native</Text>
          <TextInput
            style={TextInputStyle}
            value={rnText}
            onChangeText={setRnText}
          />
          <Text>State: {rnText}</Text>
        </View>

        <View style={{ gap: 8 }}>
          <Text>TextInputIME</Text>
          <TextInputIME
            style={TextInputStyle}
            value={rnIMEText}
            onChangeText={setRnIMEText}
          />
          <Text>State: {rnIMEText}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
