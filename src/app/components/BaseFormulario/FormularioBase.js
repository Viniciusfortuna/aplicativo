import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Link, useLocalSearchParams } from "expo-router";
import Save from "./BotaoSave";
import Sync from "./BotaoSync";
import LoginContext from "../../contexts/loginContext";
import NetInfo from "@react-native-community/netinfo";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

// Serviços
import services from "../../functions/services/clients/servicesClient";
import servicesForms from "../../functions/services/forms/servicesForms";
import servicesAgents from "../../functions/services/agents/serviceAgents";
import serviceSituation from "../../functions/services/situations/servicesSituation";
import servicesTipoFormulario from "../../functions/services/tipo_formularios/serviceTipoFormularios";
import servicesPerguntasTipoFormulario from "../../functions/services/perguntas_tipo_formularios/servicePerguntasTipoFormularios";
import { tables } from "../../functions/services/db/tables";

export default function FormularioBase({ acao, table, desc, msg, method, msgs, table2 }) {
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
  const [isConnected, setIsConnected] = useState(true);
  const [nomcli, setNomCli] = useState("");
  const [nomage, setNomAge] = useState("");
  const [nomtip, setNomTip] = useState("");
  const [dessit, setDesSit] = useState("");


  const { login } = useContext(LoginContext);
  const { id, idtipfor } = useLocalSearchParams();

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
      valres,
    })),
    codfor: id,
  };

  const gerarPDF = async () => {
    try {
      const html = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
              h1 { text-align: center; color: #2563EB; margin-bottom: 30px; }
              h2 { margin-top: 30px; margin-bottom: 10px; color: #444; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 10px; font-size: 14px; }
              th { background-color: #f2f2f2; text-align: left; }
              .pergunta { margin-top: 15px; }
              .resposta { color: #111; font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>Formulário</h1>

            <h2>Dados Gerais</h2>
            <table>
              <tr><th>Documento</th><td>${data.codfor || "-"}</td></tr>
              <tr><th>Tipo</th><td>${nomtip || "-"}</td></tr>
              <tr><th>Agente</th><td>${nomage || "-"}</td></tr>
              <tr><th>Cliente</th><td>${nomcli || "-"}</td></tr>
              <tr><th>Descrição</th><td>${descri || "-"}</td></tr>
              <tr><th>Situação</th><td>${dessit || "-"}</td></tr>
            </table>

            <h2>Perguntas e Respostas</h2>
            <table>
              <tr>
                <th>Pergunta</th>
                <th>Resposta</th>
              </tr>
              ${perguntas
                .map(
                  (perg) => `
                  <tr>
                    <td>${perg.desprg}</td>
                    <td class="resposta">${respostas[perg.idperg] || "-"}</td>
                  </tr>
                `
                )
                .join("")}
            </table>

            <p style="text-align: center; margin-top: 40px; font-size: 12px; color: #777;">
              Relatório gerado automaticamente pelo aplicativo em ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
            </p>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        alert("Compartilhamento não disponível neste dispositivo.");
      }
    } catch (error) {
      console.log("Erro ao gerar PDF:", error);
    }
  };


  // 1️⃣ Verifica conexão
  useEffect(() => {
    const checkConnection = async () => {
      const netState = await NetInfo.fetch();
      setIsConnected(netState.isConnected);
    };
    checkConnection();
  }, []);

  // 2️⃣ Carrega opções gerais
  useEffect(() => {
    const fetchOpcoes = async () => {
      try {
        setClientes(await services("SELECT", tables.clientes, "ALL"));
        setAgentes(await servicesAgents("SELECT", tables.agentes, "ALL", ""));
        setSituacao(await serviceSituation("SELECT", tables.situacao, "ALL", ""));
      } catch (error) {
        Alert.alert("Erro ao carregar opções:", error);
      }
    };
    fetchOpcoes();
  }, []);

  // 3️⃣ Carrega dados do formulário
  useEffect(() => {
    const loadFormData = async () => {
      try {
        const resultTipos = await servicesTipoFormulario("SELECT", tables.tipo_formulario, "ALL", "");
        setDataTipo(resultTipos);

        if (acao !== "INSERT" && id) {
          const resultForm = await servicesForms("SELECT", table, "ID", id);
          if (resultForm) {
            setCodAge(resultForm?.codage || "");
            setCodCli(resultForm?.codcli || "");
            setDesCri(resultForm?.descri || "");
            setRemRec(resultForm?.remrec || "");
            setCodSit(resultForm?.codsit || "");
            setTipfor(resultForm?.tipfor || "");

            if (resultForm?.resfor) {
              const respostasSalvas = {};
              resultForm.resfor.forEach((r) => {
                respostasSalvas[r.idperg] = r.valres;
              });
              setRespostas(respostasSalvas);
            }
          }
        } else if (acao === "INSERT") {
          if (idtipfor) {
            const existe = resultTipos.find(t => t.tipfor.toString() === idtipfor.toString());
            setTipfor(existe ? existe.tipfor : resultTipos[0]?.tipfor || "");
          } else {
            setTipfor(resultTipos[0]?.tipfor || "");
          }
        }
      } catch (error) {
        Alert.alert("Erro ao carregar formulário:", error);
      }
    };
    loadFormData();
  }, [acao, id, idtipfor, table]);

  // 4️⃣ Carrega perguntas
  useEffect(() => {
    if (!tipfor) return;
    const loadPerguntas = async () => {
      try {
        const result = await servicesPerguntasTipoFormulario(
          "SELECT",
          tables.perguntas_tipo_formulario,
          "ID_TIPFOR",
          tipfor
        );
        setPerguntas(result);
      } catch (error) {
        Alert.alert("Erro ao carregar perguntas:", error);
      }
    };
    loadPerguntas();
  }, [tipfor]);

  const handleResposta = (idperg, valor) => {
    setRespostas(prev => ({ ...prev, [idperg]: valor }));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={style.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Tipo de Formulário */}
        <InputDropdown
          label="Tipo de Formulário"
          data={dataTipo}
          labelField="nomtip"
          valueField="tipfor"
          value={tipfor}
          onChange={(item) => {
            setTipfor(item.tipfor);
            setNomTip(item.nomtip);
          }}
          disabled={acao !== "INSERT"}
        />

        {/* Agente */}
        <InputDropdown
          label="Agente"
          data={agentes}
          labelField="nomage"
          valueField="codage"
          value={codage}
          onChange={(item) => {
            setCodAge(item.codage);
            setNomAge(item.nomage);
          }}
        />

        {/* Cliente */}
        <InputDropdown
          label="Cliente"
          data={clientes}
          labelField="nomcli"
          valueField="codcli"
          value={codcli}
          onChange={(item) => {
            setCodCli(item.codcli);
            setNomCli(item.nomcli)}}
        />

        {/* Descrição */}
        <InputText
          label="Descrição"
          value={descri}
          onChangeText={setDesCri}
          multiline
          big
        />

        {/* Remédios */}
        {/* <InputText
          label="Remédios Receitados"
          value={remrec}
          onChangeText={setRemRec}
        /> */}

        {/* Situação */}
        <InputDropdown
          label="Situação"
          data={situacao}
          labelField="dessit"
          valueField="codsit"
          value={codsit}
          onChange={(item) => {
            setCodSit(item.codsit);
            setDesSit(item.dessit);
          }}
        />

        {/* Perguntas Dinâmicas */}
        {perguntas.map((perg) => (
          <View key={perg.idperg} style={style.inputContainer}>
            <Text style={style.label}>{perg.desprg}</Text>
            {perg.tipper === "SIM_NAO" ? (
              <View style={style.toggleContainer}>
                <Text
                  style={[style.toggleButton, respostas[perg.idperg] === "S" && style.selectedYes]}
                  onPress={() => handleResposta(perg.idperg, "S")}
                >
                  Sim
                </Text>
                <Text
                  style={[style.toggleButton, respostas[perg.idperg] === "N" && style.selectedNo]}
                  onPress={() => handleResposta(perg.idperg, "N")}
                >
                  Não
                </Text>
              </View>
            ) : (
              <TextInput
                style={style.inputText}
                placeholder={`Resposta (${perg.tipper})`}
                value={respostas[perg.idperg] || ""}
                onChangeText={(txt) => handleResposta(perg.idperg, txt)}
              />
            )}
          </View>
        ))}

        {/* Botões */}
        <Save acao={acao} table={table} data={data} desc={desc} msg={msg} />
        {acao !== "INSERT" && isConnected && (
          <Sync method={method} dados={data} table={table2} msg={msgs} dataDel={id} />
        )}
        {/* {acao != "INSERT" && (
            <TouchableOpacity style={style.pdfButton} onPress={gerarPDF}>
              <Text style={style.pdfButtonText}>📄 Gerar PDF</Text>
            </TouchableOpacity>
        )} */}

        <Link href={"/forms/read/sync"} style={style.link}>Listar</Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* 🔹 Componentes reutilizáveis para manter padrão */
const InputDropdown = ({ label, ...props }) => (
  <View style={style.inputContainer}>
    <Text style={style.label}>{label}</Text>
    <Dropdown
      style={style.dropdown}
      placeholderStyle={style.placeholderStyle}
      selectedTextStyle={style.selectedTextStyle}
      inputSearchStyle={style.inputSearchStyle}
      iconStyle={style.iconStyle}
      search
      placeholder="Selecione..."
      searchPlaceholder="Pesquisar..."
      {...props}
    />
  </View>
);

const InputText = ({ label, big, ...props }) => (
  <View style={style.inputContainer}>
    <Text style={style.label}>{label}</Text>
    <TextInput
      style={big ? style.inputMemo : style.inputText}
      placeholder={label}
      {...props}
    />
  </View>
);

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F9FAFB",
    paddingVertical: 20,
    paddingHorizontal: 15,
    gap: 10,
    alignItems: "center"
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 5,
  },
  inputText: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 15,
    backgroundColor: "#FFF",
  },
  inputMemo: {
    width: "100%",
    height: 90,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 15,
    backgroundColor: "#FFF",
    textAlignVertical: "top",
  },
  dropdown: {
    height: 45,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  placeholderStyle: {
    fontSize: 15,
    color: "#9CA3AF",
  },
  selectedTextStyle: {
    fontSize: 15,
    color: "#111827",
  },
  iconStyle: {
    width: 18,
    height: 18,
  },
  inputSearchStyle: {
    height: 35,
    fontSize: 15,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  toggleButton: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F3F4F6",
  },
  selectedYes: {
    backgroundColor: "#10B981",
    color: "white",
    borderColor: "#059669",
  },
  selectedNo: {
    backgroundColor: "#EF4444",
    color: "white",
    borderColor: "#DC2626",
  },
  link: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
    color: "#2563EB",
    textAlign: "center",
  },
});
