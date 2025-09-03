import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Switch, Pressable, Alert, Share } from "react-native";
import { Link } from "expo-router";
import servicesForms from "../../functions/services/forms/servicesForms";
import servicesSituation from "../../functions/services/situations/servicesSituation";
import { Dropdown } from "react-native-element-dropdown";
import { tables } from "../../functions/services/db/tables";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";

export default function FormulariosListagem({ table, type }) {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [situacao, setSituacao] = useState([]);
  const [codSit, setCodSit] = useState(null);
  const [clienteFilter, setClienteFilter] = useState("");
  const [sincronizadoFilter, setSincronizadoFilter] = useState(null);

  // Buscar formulários
  const getData = async () => {
    const data = await servicesForms("SELECT", table, "ALL", "", "", "", 0);
    setForms(data);
    setFilteredForms(data);
  };

  // Buscar situações
  const getSituacoes = async () => {
    const data = await servicesSituation("SELECT", tables.situacao, "ALL", "");
    setSituacao(data);
  };

  // Filtrar quando algum filtro mudar
  useEffect(() => {
    let filtered = [...forms];

    if (codSit) filtered = filtered.filter(f => f.codsit === codSit);
    if (clienteFilter) filtered = filtered.filter(f =>
      f.nomcli.toLowerCase().includes(clienteFilter.toLowerCase())
    );
    if (sincronizadoFilter !== null) filtered = filtered.filter(f =>
      sincronizadoFilter ? f.sitsin !== 1 : f.sitsin === 1
    );

    setFilteredForms(filtered);
  }, [codSit, clienteFilter, sincronizadoFilter, forms]);

  useEffect(() => {
    getData();
    getSituacoes();
  }, []);

  // Exportar Excel
  const exportToExcel = async () => {
    try {
      if (!filteredForms || filteredForms.length === 0) {
        Alert.alert("Aviso", "Não há dados para exportar");
        return;
      }

      const ws = XLSX.utils.json_to_sheet(filteredForms.map(f => ({
        Código: f.codfor,
        Cliente: f.nomcli,
        Situação: f.dessit || "",
        Sincronizado: f.sitsin === 2 ? "Sim" : "Não",
        Data: f.datger || "",
      })));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Formularios");

      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      const fileUri = FileSystem.documentDirectory + "formularios.xlsx";

      await FileSystem.writeAsStringAsync(fileUri, wbout, { encoding: FileSystem.EncodingType.Base64 });
      await Share.share({ url: fileUri, title: "Exportar Excel" });

      Alert.alert("Sucesso", "Arquivo Excel gerado com sucesso!");
    } catch (error) {
      console.log("Erro ao exportar Excel:", error);
      Alert.alert("Erro", "Falha ao gerar Excel");
    }
  };

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <Text style={style.headerText}>Formulários</Text>
      </View>

      <View style={style.filtersContainer}>
        <TextInput
          style={style.input}
          placeholder="Filtrar por cliente"
          value={clienteFilter}
          onChangeText={setClienteFilter}
        />

        <Text style={style.label}>Situação</Text>
        <Dropdown
          style={style.dropdown}
          data={situacao}
          search
          labelField="dessit"
          valueField="codsit"
          placeholder="Selecione..."
          value={codSit}
          onChange={(item) => setCodSit(item.codsit)}
        />

        <View style={style.switchContainer}>
          <Text>Sincronizado</Text>
          <Switch
            value={sincronizadoFilter === true}
            onValueChange={(val) => setSincronizadoFilter(val ? true : null)}
          />
          <Text>Não Sincronizado</Text>
          <Switch
            value={sincronizadoFilter === false}
            onValueChange={(val) => setSincronizadoFilter(val ? false : null)}
          />
        </View>

        <Pressable style={style.exportButton} onPress={exportToExcel}>
          <Text style={{ fontWeight: "bold", color: "#fff" }}>Exportar Excel</Text>
        </Pressable>
      </View>

      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, gap: 10 }}
        data={filteredForms}
        keyExtractor={(item) => item.codfor.toString()}
        renderItem={({ item }) => (
          <View style={style.itemContainer}>
            <Text style={style.itemText}>
              {item.codfor} - {item.nomcli} ({item.dessit}) {item.sitsin === 2 ? "[Sincronizado]" : "[Não sincronizado]"}
            </Text>
            <Link
              href={`/forms/update/${type}/id/${item.codfor}`}
              style={style.editButton}
            >
              Editar
            </Link>
          </View>
        )}
        ListFooterComponent={
          <Link style={style.linkStyle} href={"/"}>
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
