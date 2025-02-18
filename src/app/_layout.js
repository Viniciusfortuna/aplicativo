import { Slot } from "expo-router";
import { LoginProvider } from "./contexts/loginContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaViewBase, View } from "react-native";

export default function layout() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
        <SafeAreaView style={{ flex: 1 }}>
          <LoginProvider>
            <Slot></Slot>
          </LoginProvider>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}
