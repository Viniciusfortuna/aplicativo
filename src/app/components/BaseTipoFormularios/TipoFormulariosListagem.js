import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Link } from "expo-router";
import services from "../../functions/services/clients/servicesClient";
import servicesTipoFormulario from "../../functions/services/tipo_formularios/serviceTipoFormularios";

export default function TipoFormulariosListagem({ table, type }) {
  const [tipos, setTipos] = useState([]);

  const getData = async () => {
    const data = await servicesTipoFormulario("SELECT", table, "ALL", "");
    setTipos(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <Text style={style.headerText}>Tipos de Formulário</Text>
      </View>

      <FlatList
        contentContainerStyle={style.flatlist}
        data={tipos}
        keyExtractor={(item) => item.tipfor.toString()}
        renderItem={({ item }) => (
          <View style={style.itemContainer}>
            <View style={{ flex: 1 }}>
              <Text style={style.itemTitle}>{item.nomtip}</Text>
              {item.destip ? (
                <Text style={style.itemDesc}>{item.destip}</Text>
              ) : null}
              {item.datger ? (
                <Text style={style.itemDate}>
                  Criado em: {new Date(item.datger).toLocaleDateString("pt-BR")}
                </Text>
              ) : null}
            </View>
            <Link
              href={`/forms/create/`}
              style={style.editButton}
            >
              Novo
            </Link>
          </View>
        )}
      />

      <Link style={style.linkStyle} href={"/"}>
        Voltar
      </Link>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3FF",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  flatlist: {
    flex: 1,
    width: "100%",
    gap: 10,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemDesc: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  itemDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  editButton: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginLeft: 10,
  },
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
    marginTop: 20,
    alignSelf: "center",
  },
});
