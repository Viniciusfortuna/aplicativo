import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useLocalSearchParams } from "expo-router";
import Save from "./BotaoSave";
import Sync from "./BotaoSync";
import LoginContext from "../../contexts/loginContext";

// Serviços
import services from "../../functions/services/clients/servicesClient";
import servicesForms from "../../functions/services/forms/servicesForms";
import servicesAgents from "../../functions/services/agents/serviceAgents";
import serviceSituation from "../../functions/services/situations/servicesSituation";
import servicesTipoFormulario from "../../functions/services/tipo_formularios/serviceTipoFormularios";
import servicesPerguntasTipoFormulario from "../../functions/services/perguntas_tipo_formularios/servicePerguntasTipoFormularios";
import { tables } from "../../functions/services/db/tables";

export default function FormularioBase({
  acao,
  table,
  desc,
  msg,
  method,
  msgs,
  table2,
}) {
  // Estados gerais
  const [tipfor, setTipfor] = useState("");
  const [dataTipo, setDataTipo] = useState([]);
  const [perguntas, setPerguntas] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [codage, setCodAge] = useState("");
  const [codcli, setCodCli] = useState("");
  const [descri, setDesCri] = useState("");
  const [remrec, setRemRec] = useState("");
  const [codsit, setCodSit] = useState("");
  const [situacao, setSituacao] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [agentes, setAgentes] = useState([]);
  const { login } = useContext(LoginContext);
  const { id } = useLocalSearchParams();

  // Dados que vão para o backend
  const data = {
    tipfor,
    codage,
    codcli,
    descri,
    remrec,
    codsit,
    usuger: login.codusu,
    resfor: Object.entries(respostas).map(([idperg, valres]) => ({
    idperg,
    valres
    }))
  };

  if (acao != "INSERT") {
    useEffect(() => {
      fetchData();
    }, []);
  }

  // Carregar opções
  useEffect(() => {
    fetchOpcoes();
  }, []);

  // Carregar perguntas quando muda tipo de formulário
  useEffect(() => {
    if (tipfor) {
      fetchPerguntas();
    }
  }, [tipfor]);

  const fetchOpcoes = async () => {
    try {
      const resultClientes = await services(
        "SELECT",
        tables.clientes,
        "ALL"
      );
      const resultAgents = await servicesAgents(
        "SELECT",
        tables.agentes,
        "ALL",
        ""
      );
      const resultSituations = await serviceSituation(
        "SELECT",
        tables.situacao,
        "ALL",
        ""
      );
      setClientes(resultClientes);
      setAgentes(resultAgents);
      setSituacao(resultSituations);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    // Carrega tipos
    const resultTipos = await servicesTipoFormulario(
      "SELECT",
      table2,
      "ALL",
      ""
    );
    setTipfor(resultTipos[0]?.tipfor || "");
    setDataTipo(resultTipos);

    // Se não for INSERT, carrega dados do form
    if (acao !== "INSERT") {
      const result = await servicesForms("SELECT", table, "ID", id);
      setCodAge(result[0]?.codage || "");
      setCodCli(result[0]?.codcli || "");
      setDesCri(result[0]?.descri || "");
      setRemRec(result[0]?.remrec || "");
      setCodSit(result[0]?.codsit || "");
    }
  };

  const fetchPerguntas = async () => {
    const result = await servicesPerguntasTipoFormulario(
      "SELECT",
      tables.perguntas_tipo_formulario,
      "ID",
      tipfor
    );
    setPerguntas(result);
  };

  const handleResposta = (idperg, valor) => {
    setRespostas({ ...respostas, [idperg]: valor });
  };

  return (
    <ScrollView contentContainerStyle={style.container}>
      {/* Tipo de Formulário */}
      <View style={style.inputContainer}>
        <Text style={style.label}>Tipo de Formulário</Text>
        <Dropdown
          style={style.dropdown}
          placeholderStyle={style.placeholderStyle}
          selectedTextStyle={style.selectedTextStyle}
          inputSearchStyle={style.inputSearchStyle}
          iconStyle={style.iconStyle}
          data={dataTipo}
          search
          labelField="nomtip"
          valueField="tipfor"
          placeholder="Selecione..."
          searchPlaceholder="Pesquisar..."
          value={tipfor}
          onChange={(item) => setTipfor(item.tipfor)}
        />
      </View>

      {/* Agente */}
      <View style={style.inputContainer}>
        <Text style={style.label}>Agente</Text>
        <Dropdown
          style={style.dropdown}
          data={agentes}
          search
          labelField="nomage"
          valueField="codage"
          placeholder="Selecione..."
          value={codage}
          onChange={(item) => setCodAge(item.codage)}
        />
      </View>

      {/* Cliente */}
      <View style={style.inputContainer}>
        <Text style={style.label}>Cliente</Text>
        <Dropdown
          style={style.dropdown}
          data={clientes}
          search
          labelField="nomcli"
          valueField="codcli"
          placeholder="Selecione..."
          value={codcli}
          onChange={(item) => setCodCli(item.codcli)}
        />
      </View>

      {/* Descrição */}
      <View style={style.inputContainer}>
        <Text style={style.label}>Descrição</Text>
        <TextInput
          style={style.inputMemo}
          value={descri}
          onChangeText={setDesCri}
          multiline
        />
      </View>

      {/* Remédios */}
      <View style={style.inputContainer}>
        <Text style={style.label}>Remédios Receitados</Text>
        <TextInput
          style={style.inputText}
          value={remrec}
          onChangeText={setRemRec}
        />
      </View>

      {/* Situação */}
      <View style={style.inputContainer}>
        <Text style={style.label}>Situação</Text>
        <Dropdown
          style={style.dropdown}
          data={situacao}
          search
          labelField="dessit"
          valueField="codsit"
          placeholder="Selecione..."
          value={codsit}
          onChange={(item) => setCodSit(item.codsit)}
        />
      </View>

      {/* Perguntas Dinâmicas */}
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

      {/* Botões */}
      <Save
        acao={acao}
        table={table}
        data={data}
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
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
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
  inputMemo: {
    width: "100%",
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#FFF",
  },
  dropdown: {
    height: 40,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
  },
  iconStyle: {
    width: 15,
    height: 15,
  },
  inputSearchStyle: {
    height: 30,
    fontSize: 16,
  },
});
