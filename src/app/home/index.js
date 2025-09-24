import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { Text } from "react-native";
import SincronizaClientes from "../functions/services/clients/sincronizaClientes";
import SincronizaUsuarios from "../functions/services/users/sincronizaUsuarios";
import SincronizaSituacao from "../functions/services/situations/sincronizaSituacao";
import LoginContext, { useLogin } from "../contexts/loginContext";
import SincronizaAgentes from "../functions/services/agents/sincronizaAgentes";
import SincronizaTipoFormularios from "../functions/services/tipo_formularios/sincronizaTipoFormularios";
import SincronizaPerguntasTipoFormulario from "../functions/services/perguntas_tipo_formularios/sincronizaPerguntasTipoFormularios";
import SincronizaForms from "../functions/services/forms/sincronizaFormularios";
import NetInfo from "@react-native-community/netinfo"

export default function App() {
  const [logusu, setLogUsu] = useState("");
  const { login, setLogin } = useContext(LoginContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLogUsu(login.logusu);
  }, []);

  const fetchData = async () => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) return;

    try {
      // 🔹 1. Executa os independentes em paralelo
      const [responseCli, responseAge, responseUse, responseSit] = await Promise.all([
        SincronizaClientes(),
        SincronizaAgentes(),
        SincronizaUsuarios(),
        SincronizaSituacao(),
      ]);

      // 🔹 2. Executa os dependentes em SEQUÊNCIA
      const responseTipoFormularios = await SincronizaTipoFormularios();
      const responsePeguntasTipoFormularios = await SincronizaPerguntasTipoFormulario();
      const responseFormularios = await SincronizaForms();

      // 🔹 3. Validação dos retornos
      if (
        responseAge === "ok" &&
        responseCli === "ok" &&
        responseUse === "ok" &&
        responseSit === "ok" &&
        responseTipoFormularios === "ok" &&
        responsePeguntasTipoFormularios === "ok" &&
        responseFormularios === "ok"
      ) {
        Alert.alert("Sucesso", "Sincronização realizada com sucesso!");
      } else {
        Alert.alert("Aviso", "Algumas sincronizações não retornaram 'ok'.");
      }
    } catch (error) {
      Alert.alert("Erro", "Houve um erro ao sincronizar!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={style.container}>
      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={style.modalContainer}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={style.modalText}>Sincronizando...</Text>
        </View>
      </Modal>

      <Text style={style.label}> Olá, {logusu}</Text>
      <Link style={style.buttonLink} href="/tipo_formularios/read/sync">
        Formulários
      </Link>
      <Link style={style.buttonLink} href="/agents/read/sync">
        Agentes
      </Link>
      <Link style={style.buttonLink} href="/clients/read/sync">
        Clientes
      </Link>
      <Link style={style.buttonLink} href="/forms/read/sync">
        Listar Formularios
      </Link>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3FF",
    alignItems: "center",
    justifyContent: "center",
    gap: 8, // Espaçamento entre os botões
    paddingHorizontal: 20,
  },
  buttonLink: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    color: "#000", // Cor do texto
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Sombra no Android
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
  },
   modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
});
