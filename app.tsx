import { useState } from "react";
import {
  ScrollView,
  type StyleProp,
  Text,
  TextInput,
  View,
  type ViewStyle,
} from "react-native";

const TextInputStyle: StyleProp<ViewStyle> = {
  borderWidth: 1,
  borderRadius: 4,
  padding: 4,
};

export default function App() {
  const [rnText, setRNText] = useState("");

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
            onChangeText={setRNText}
          />
          <Text>State: {rnText}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
