import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";
import { Link, useLocalSearchParams } from "expo-router";
import services from "../../functions/services/clients/servicesClient";
import LinkCustom from "../AtalhoListagem";
import Save from "./BotaoSave";
import Sync from "./BotaoSync";
import servicesAgents from "../../functions/services/agents/serviceAgents";

export default function AgenteBase({
  acao,
  table,
  dado,
  desc,
  msg,
  method,
  msgs,
  table2,
}) {
  const [nomage, setNomage] = useState("");
  const [emaage, setEmaage] = useState("");
  const [cpfage, setCpfage] = useState("");
  const [telage, setTelage] = useState("");
  const [funage, setFunage] = useState("");
  const [datnas, setDatnas] = useState("");
  const { id } = useLocalSearchParams();

  const data = {
    codage: id,
    nomage: nomage,
    emaage: emaage,
    cpfage: cpfage,
    telage: telage || null,
    funage: funage,
    datnas: datnas || null,
  };

  if (acao !== "INSERT") {
    useEffect(() => {
      fetchData();
    }, []);
  } else {
    delete data.codage;
  }

  const fetchData = async () => {
    const result = await servicesAgents("SELECT", table, "ID", id);
    setNomage(result[0]?.nomage || "");
    setEmaage(result[0]?.emaage || "");
    setCpfage(result[0]?.cpfage || "");
    setFunage(result[0]?.funage || "");
    setTelage(result[0]?.telage || "");
    if (result[0].datnas) {
      var dataFormatada = new Date(result[0].datnas).toLocaleDateString(
        "pt-BR"
      );
      setDatnas(
        dataFormatada === "Invalid Date" ? result[0].datnas : dataFormatada
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={style.container}>
      <View style={style.inputContainer}>
        <Text style={style.label}>Nome</Text>
        <TextInput
          style={style.inputText}
          value={nomage}
          onChangeText={setNomage}
          placeholder="Digite o nome do agente"
        />
      </View>
      <View style={style.inputContainer}>
        <Text style={style.label}>Email</Text>
        <TextInput
          style={style.inputText}
          value={emaage}
          onChangeText={setEmaage}
          placeholder="Digite o email"
        />
      </View>
      <View style={style.inputContainer}>
        <Text style={style.label}>CPF</Text>
        <MaskInput
          style={style.inputText}
          value={cpfage}
          onChangeText={setCpfage}
          mask={Masks.BRL_CPF}
          placeholder="000.000.000-00"
        />
      </View>
      <View style={style.inputContainer}>
        <Text style={style.label}>Telefone</Text>
        <MaskInput
          style={style.inputText}
          value={telage}
          onChangeText={setTelage}
          placeholder="Informe o telefone"
          mask={Masks.BRL_PHONE}
        />
      </View>
      <View style={style.inputContainer}>
        <Text style={style.label}>Função</Text>
        <TextInput
          style={style.inputText}
          value={funage}
          onChangeText={setFunage}
          placeholder="Informe a função"
        />
      </View>
      <View style={style.inputContainer}>
        <Text style={style.label}>Data de Nascimento</Text>
        <MaskInput
          style={style.inputText}
          value={datnas}
          mask={Masks.DATE_DDMMYYYY}
          onChangeText={setDatnas}
          placeholder="dd/mm/aaaa"
        />
      </View>
      <View style={style.container}>
          <Link style={style.linkStyle} href="/agents/read/sync/">
              Voltar
          </Link>
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3FF",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
    gap: 10,
  },
  inputContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  inputText: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#FFF",
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
  },
});
