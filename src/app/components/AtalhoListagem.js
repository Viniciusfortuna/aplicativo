import { Link } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function LinkCustom() {
  return (
    <View style={style.container}>
      <Link style={style.linkStyle} href="/clients/read/not_sync">
        Não Sincronizados
      </Link>
      <Link style={style.linkStyle} href="/clients/read/sync">
        Sincronizados
      </Link>
    </View>
  );
}

const style = StyleSheet.create({
  linkStyle: {
    width: 250,
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    textAlignVertical: "center",
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F3FF",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
    gap: 20,
  },
});
