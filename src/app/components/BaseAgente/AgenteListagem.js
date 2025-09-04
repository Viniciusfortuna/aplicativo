import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert, Share } from "react-native";
import { Link } from "expo-router";
import servicesAgents from "../../functions/services/agents/serviceAgents";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";

export default function AgenteListagem({ table, type }) {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [agentFilter, setAgentFilter] = useState("");

  // Buscar agentes
  const getData = async () => {
    const data = await servicesAgents("SELECT", table, "ALL", "");
    setAgents(data);
    setFilteredAgents(data);
  };

  useEffect(() => {
    getData();
  }, []);

  // Filtrar por nome
  useEffect(() => {
    let filtered = [...agents];
    if (agentFilter) {
      filtered = filtered.filter((a) =>
        a.nomage.toLowerCase().includes(agentFilter.toLowerCase())
      );
    }
    setFilteredAgents(filtered);
  }, [agentFilter, agents]);

  // Exportar Excel
  const exportToExcel = async () => {
    try {
      if (!filteredAgents || filteredAgents.length === 0) {
        Alert.alert("Aviso", "Não há agentes para exportar");
        return;
      }

      const ws = XLSX.utils.json_to_sheet(
        filteredAgents.map((a) => ({
          Código: a.codage,
          Nome: a.nomage,
          Data: a.datger || "",
        }))
      );

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Agentes");

      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      const fileUri = FileSystem.documentDirectory + "agentes.xlsx";

      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Share.share({ url: fileUri, title: "Exportar Agentes" });

      Alert.alert("Sucesso", "Arquivo Excel gerado com sucesso!");
    } catch (error) {
      console.log("Erro ao exportar Excel:", error);
      Alert.alert("Erro", "Falha ao gerar Excel");
    }
  };

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <Text style={style.headerText}>Agentes</Text>
      </View>

      {/* Filtros */}
      <View style={style.filtersContainer}>
        <TextInput
          style={style.input}
          placeholder="Filtrar por agente"
          value={agentFilter}
          onChangeText={setAgentFilter}
        />

        <Pressable style={style.exportButton} onPress={exportToExcel}>
          <Text style={{ fontWeight: "bold", color: "#fff" }}>Exportar Excel</Text>
        </Pressable>
      </View>

      {/* Lista */}
      <FlatList
        contentContainerStyle={{ flexGrow: 1, gap: 10 }}
        data={filteredAgents}
        keyExtractor={(item) => item.codage.toString()}
        renderItem={({ item }) => (
          <View style={style.itemContainer}>
            <Text style={style.itemText}>{item.codage} - {item.nomage}</Text>
            <Link
              href={`/agents/update/${type}/id/${item.codage}`}
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
  container: { flex: 1, backgroundColor: "#F3F3FF", paddingTop: 20, paddingHorizontal: 10 },
  headerContainer: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#E0E0E0", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, marginBottom: 10 },
  headerText: { fontSize: 18, fontWeight: "bold", color: "#333", flex: 1, textAlign: "center" },
  filtersContainer: { marginBottom: 15 },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: "#ddd" },
  exportButton: { backgroundColor: "#28a745", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  itemContainer: { backgroundColor: "#fff", padding: 15, borderRadius: 8, borderWidth: 1, borderColor: "#ddd", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, flexDirection: "row", justifyContent: "space-between" },
  itemText: { fontSize: 12, color: "#333", flex: 1 },
  editButton: { fontSize: 16, color: "#007BFF", fontWeight: "bold", textDecorationLine: "underline" },
  linkStyle: { width: 250, height: 40, backgroundColor: "#FFF", borderRadius: 12, alignItems: "center", justifyContent: "center", textAlign: "center", textAlignVertical: "center", color: "#000", fontSize: 14, fontWeight: "bold", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, marginTop: 20, alignSelf: "center" },
});
