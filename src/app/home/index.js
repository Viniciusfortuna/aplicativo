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

export default function App() {
  const [logusu, setLogUsu] = useState("");
  const { login, setLogin } = useContext(LoginContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLogUsu(login.logusu);
    setLoading(false);
  }, []);

  const fetchData = async () => {
    const responseCli = await SincronizaClientes();
    const responseAge = await SincronizaAgentes();
    const responseUse = await SincronizaUsuarios();
    const responseSit = await SincronizaSituacao();
    const responseTipoFormularios = await SincronizaTipoFormularios();
    const responsePeguntasTipoFormularios = await SincronizaPerguntasTipoFormulario();
    const responseFormularios = await SincronizaForms();

    if (
      responseAge === "ok" &&
      responseCli === "ok" &&
      responseUse === "ok" &&
      responseSit === "ok" &&
      responseTipoFormularios == "ok" &&
      responsePeguntasTipoFormularios == "ok" &&
      responseFormularios == "ok"
    ) {
      Alert.alert("Sucesso", "Sincronização realizada com sucesso!");
    }
  };

  return (
    <View style={style.container}>
      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={style.container}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={style.label}>Carregando...</Text>
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
});
