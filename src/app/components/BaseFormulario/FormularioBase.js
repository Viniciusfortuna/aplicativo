import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useLocalSearchParams } from "expo-router";
import services from "../../functions/services/clients/servicesClient";
import servicesForms from "../../functions/services/forms/servicesForms";
import Save from "./BotaoSave";
import Sync from "./BotaoSync";
import LoginContext from "../../contexts/loginContext";

export default function FormularioBase({ acao, table, desc, msg, method, msgs, table2 }) {
  const [tipfor, setTipfor] = useState("");
  const [perguntas, setPerguntas] = useState([]);
  const [respostas, setRespostas] = useState({});
  const { login } = useContext(LoginContext);
  const { id } = useLocalSearchParams();

  // dados fixos do formulário
  const data = {
    codfor: id,
    tipfor,
    usuger: login.codusu,
  };

  if (acao === "INSERT") {
    delete data.codfor;
  } else {
    useEffect(() => {
      fetchData();
    }, []);
  }

  useEffect(() => {
    if (tipfor) {
      fetchPerguntas();
    }
  }, [tipfor]);

  const fetchData = async () => {
    const result = await servicesForms("SELECT", table, "ID", id);
    setTipfor(result[0]?.tipfor || "");
  };

  const fetchPerguntas = async () => {
    const result = await services("SELECT", "perguntas_tipo_formulario", "TIPFOR", tipfor);
    setPerguntas(result);
  };

  const handleResposta = (idperg, valor) => {
    setRespostas({ ...respostas, [idperg]: valor });
  };

  return (
    <ScrollView contentContainerStyle={style.container}>
      <View style={style.inputContainer}>
        <Text style={style.label}>Tipo de Formulário</Text>
        <Dropdown
          style={style.dropdown}
          data={[]} // você pode carregar os tipos aqui
          labelField="nomtip"
          valueField="tipfor"
          value={tipfor}
          onChange={(item) => setTipfor(item.tipfor)}
          placeholder="Selecione..."
        />
      </View>

      {perguntas.map((perg) => (
        <View key={perg.idperg} style={style.inputContainer}>
          <Text style={style.label}>{perg.desprg}</Text>
          <TextInput
            style={style.inputText}
            placeholder={`Resposta (${perg.tipper})`}
            value={respostas[perg.idperg] || ""}
            onChangeText={(txt) => handleResposta(perg.idperg, txt)}
          />
        </View>
      ))}

      <Save
        acao={acao}
        table={table}
        data={{
          ...data,
          respostas: Object.entries(respostas).map(([idperg, valres]) => ({
            idperg,
            valres,
          })),
        }}
        desc={desc}
        msg={msg}
      />
      <Sync
        method={method}
        dados={data}
        table={table2}
        msg={msgs}
        dataDel={id}
      />
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3FF",
    paddingVertical: 20,
    paddingHorizontal: 15,
    gap: 3,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  inputText: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  dropdown: {
    height: 40,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
});
