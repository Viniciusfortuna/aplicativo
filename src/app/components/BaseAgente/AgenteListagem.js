import React from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import { useState, useEffect } from "react";
import { Link } from "expo-router";
import services from "../../functions/services/clients/servicesClient";
import servicesAgents from "../../functions/services/agents/serviceAgents";

export default function AgenteListagem({ table, type }) {
  const [agents, setAgents] = useState([]);

  const getData = async () => {
    const data = await servicesAgents("SELECT", table, "ALL", "");
    console.log(data + "clientes");
    setAgents(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <Text style={style.headerText}>Agentes</Text>
      </View>

      <FlatList
        contentContainerStyle={{ flexGrow: 1, gap: 10 }}
        data={agents}
        keyExtractor={(item) => item.codage.toString()}
        renderItem={({ item }) => (
          <View style={style.itemContainer}>
            <Text style={style.itemText}>{item.nomage}</Text>
            <Link
              href={"/agents/update/" + type + "/id/" + item.codage}
              style={style.editButton}
            >
              Editar
            </Link>
          </View>
        )}
        ListFooterComponent={
          <Link style={style.linkStyle} href={"/home"}>
              Voltar
          </Link>
        }
      />
    </View>
  );
}

const style = StyleSheet.create({
  flatlist: {
    flex: 1,
    width: "100%",
    gap: 5,
  },
  container: { flex: 1, backgroundColor: "#F3F3FF", paddingTop: 20, paddingHorizontal: 10 },
  headerContainer: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#E0E0E0", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, marginBottom: 10 },
  headerText: { fontSize: 18, fontWeight: "bold", color: "#333", flex: 1, textAlign: "center" },
  filtersContainer: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: "#ddd" },
  dropdown: { backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: "#ddd" },
  switchContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10, alignItems: "center" },
  exportButton: { backgroundColor: "#28a745", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  itemContainer: { backgroundColor: "#fff", padding: 15, borderRadius: 8, borderWidth: 1, borderColor: "#ddd", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, flexDirection: "row", justifyContent: "space-between" },
  itemText: { fontSize: 12, color: "#333", flex: 1 },
  editButton: { fontSize: 16, color: "#007BFF", fontWeight: "bold", textDecorationLine: "underline" },
  linkStyle: { width: 250, height: 40, backgroundColor: "#FFF", borderRadius: 12, alignItems: "center", justifyContent: "center", textAlign: "center", textAlignVertical: "center", color: "#000", fontSize: 14, fontWeight: "bold", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, marginTop: 20, alignSelf: "center" },
});

// const style = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F3F3FF",
//     paddingTop: 20,
//     paddingHorizontal: 10,
//   },
//   headerContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     backgroundColor: "#E0E0E0", // Cor de fundo do cabeçalho
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//     flex: 1,
//     textAlign: "center",
//   },
//   flatlist: {
//     flex: 1,
//     width: "100%",
//     gap: 10,
//   },
//   itemContainer: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 5, // Para dispositivos Android
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   itemText: {
//     fontSize: 16,
//     color: "#333",
//     flex: 1,
//   },
//   editButton: {
//     fontSize: 16,
//     color: "#007BFF",
//     fontWeight: "bold",
//     textDecorationLine: "underline",
//   },
//   linkStyle: {
//     width: 250,
//     height: 40,
//     backgroundColor: "#FFF",
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     textAlign: "center",
//     textAlignVertical: "center",
//     color: "#000",
//     fontSize: 14,
//     fontWeight: "bold",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     gap: 20,
//   },
// });
