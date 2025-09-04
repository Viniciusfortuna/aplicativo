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
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ClienteBase({
  acao,
  table,
  dado,
  desc,
  msg,
  method,
  msgs,
  table2,
}) {
  const [nomcli, setNomCli] = useState("");
  const [cpfcli, setCpfcli] = useState("");
  const [datnas, setDatnas] = useState("");
  const [emacli, setEmacli] = useState("");
  const [telcli, setTelcli] = useState("");
  const { id } = useLocalSearchParams();

  const data = {
    codcli: id,
    nomcli: nomcli,
    cpfcli: cpfcli,
    datnas: datnas || null,
    emacli: emacli,
    telcli: telcli,
  };

  if (acao != "INSERT") {
    useEffect(() => {
      fetchData();
    }, []);
  } else {
    delete data.codcli;
  }

  const fetchData = async () => {
    const result = await services("SELECT", table, "ID", id);
    setNomCli(result[0]?.nomcli || "");
    setCpfcli(result[0]?.cpfcli || "");
    setDatnas(result[0]?.datnas || "");
    if (result[0].datnas) {
      var dataFormatada = new Date(result[0].datnas).toLocaleString("pt-br");
      if (dataFormatada === "Invalid Date") setDatnas(result[0].datnas);
      else setDatnas(dataFormatada);
    }
    setEmacli(result[0]?.emacli || "");
    setTelcli(result[0]?.telcli || "");
  };

  return (
    // <SafeAreaProvider>
      <ScrollView style={style.container}>
        <View style={style.inputContainer}>
          <Text style={style.label}>Nome</Text>
          <TextInput
            style={style.inputText}
            value={nomcli}
            onChangeText={setNomCli}
            placeholder="Digite seu nome"
          />
        </View>
        <View style={style.inputContainer}>
          <Text style={style.label}>CPF</Text>
          <MaskInput
            style={style.inputText}
            value={cpfcli}
            onChangeText={setCpfcli}
            mask={Masks.BRL_CPF}
            placeholder="000.000.000-00"
          />
        </View>
        <View style={style.inputContainer}>
          <Text style={style.label}>Nascimento</Text>
          <MaskInput
            style={style.inputText}
            value={datnas}
            mask={Masks.DATE_DDMMYYYY}
            onChangeText={setDatnas}
            placeholder="dd/mm/aaaa"
          />
        </View>
        <View style={style.inputContainer}>
          <Text style={style.label}>Email</Text>
          <MaskInput
            style={style.inputText}
            value={emacli}
            onChangeText={setEmacli}
            placeholder="Digite seu email"
          />
        </View>
        <View style={style.inputContainer}>
          <Text style={style.label}>Telefone</Text>
          <MaskInput
            style={style.inputText}
            value={telcli}
            onChangeText={setTelcli}
            placeholder="Informe seu telefone"
            mask={Masks.BRL_PHONE}
          />
        </View>
        <View style={style.container}>
            <Link style={style.linkStyle} href="/clients/read/sync/">
                Voltar
            </Link>
        </View>
      </ScrollView>
    // </SafeAreaProvider>
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
