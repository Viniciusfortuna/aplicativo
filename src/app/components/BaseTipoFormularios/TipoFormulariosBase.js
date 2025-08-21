import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import services from "../../functions/services/clients/servicesClient";
import LinkCustom from "../AtalhoListagem";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function TipoFormularioBase({ acao, table }) {
  const [nomtip, setNomTip] = useState("");
  const [destip, setDesTip] = useState("");
  const [datger, setDatger] = useState("");
  const { id } = useLocalSearchParams();

  const data = {
    tipfor: id,
    nomtip: nomtip,
    destip: destip,
    datger: datger || null,
  };

  if (acao === "INSERT") {
    delete data.tipfor; // para autoincrement
  } else {
    useEffect(() => {
      fetchData();
    }, []);
  }

  const fetchData = async () => {
    const result = await services("SELECT", table, "ID", id);
    setNomTip(result[0]?.nomtip || "");
    setDesTip(result[0]?.destip || "");
    setDatger(result[0]?.datger || "");
    if (result[0]?.datger) {
      const dataFormatada = new Date(result[0].datger).toLocaleString("pt-BR");
      if (dataFormatada !== "Invalid Date") setDatger(dataFormatada);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={style.container}>
        <View style={style.inputContainer}>
          <Text style={style.label}>Nome do Tipo</Text>
          <TextInput
            style={style.inputText}
            value={nomtip}
            onChangeText={setNomTip}
            placeholder="Digite o nome do tipo de formulário"
          />
        </View>
        <View style={style.inputContainer}>
          <Text style={style.label}>Descrição</Text>
          <TextInput
            style={[style.inputText, { height: 80 }]}
            value={destip}
            onChangeText={setDesTip}
            placeholder="Digite a descrição"
            multiline
          />
        </View>
        <LinkCustom />
      </SafeAreaView>
    </SafeAreaProvider>
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
});
