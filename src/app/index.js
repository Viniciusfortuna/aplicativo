import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import sync_login from "./functions/services/login/serviceSyncL";
import LoginContext from "./contexts/loginContext";
import migrations from "./functions/services/db/migrations";
import servicesUsers from "./functions/services/users/servicesUser";
import ModalLoading from "./components/Modal/modalLoading";
import Icon from "react-native-vector-icons/Feather";

export default function LoginBase() {
  const router = useRouter();
  const { setLogin } = useContext(LoginContext);
  const [foco, setFoco] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userLogin, setUserLogin] = useState({
    logusu: "",
    password: "",
  });

  const migration = async () => {
    try {
      await migrations();
    } catch (error) {
      console.log("Erro migrations:", error);
    }
  };

  useEffect(() => {
    setLoading(false);
    migration();
  }, []);

  const Enter = async () => {
    setLoading(true);
    try {
      const netState = await NetInfo.fetch();
      const isOnline = netState.isConnected;

      let session;

      if (isOnline) {
        // LOGIN ONLINE
        const response = await sync_login(userLogin, "POST");
        if (response.status === 200) {
          const data = response.data;

          // Salvar sessão no SQLite
          await servicesUsers("INSERT", "users_session", null, {
            codusu: data.codusu,
            logusu: data.logusu,
            password: userLogin.password,
            token: data.token,
            is_offline: 0,
          });

          // Salvar no AsyncStorage
          await AsyncStorage.setItem("currentSession", JSON.stringify(data));
          console.log('esse é o data')
          console.log(data)
          session = data;
        } else {
          Alert.alert("Erro", "Credenciais inválidas ou usuário inativo");
          setLoading(false);
          return;
        }
      } else {
        // LOGIN OFFLINE
        const offlineResult = await servicesUsers("SELECT", "users_session", "ID", {
          logusu: userLogin.logusu,
          password: userLogin.password,
        });

        if (!offlineResult || offlineResult.length === 0) {
          Alert.alert(
            "Erro",
            "Sem internet e credenciais não encontradas offline"
          );
          setLoading(false);
          return;
        }

        session = { ...offlineResult[0], is_offline: 1 };

        // Atualiza o last_login offline
        await servicesUsers("UPDATE", "users_session", null, session);

        await AsyncStorage.setItem("currentSession", JSON.stringify(session));
      }

      // Atualiza contexto global
      setLogin(session);
      router.push("/home");
    } catch (error) {
      Alert.alert("Erro", error.message || "Falha ao realizar login");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={style.container}>
      <ModalLoading loading={loading} />
      <View style={style.inputContainer}>
        <Text style={style.label}>Login</Text>
        <TextInput
          style={foco === "logusu" ? style.LayoutEvent : style.inputText}
          onFocus={() => setFoco("logusu")}
          onBlur={() => setFoco(false)}
          value={userLogin.logusu}
          onChangeText={(e) => setUserLogin({ ...userLogin, logusu: e })}
          placeholder="Digite seu login"
        />
      </View>

      <View style={style.inputContainer}>
        <Text style={style.label}>Senha</Text>
        <View style={style.inputLogin}>
          <TextInput
            keyboardType="visible-password"
            onFocus={() => setFoco("password")}
            onBlur={() => setFoco(false)}
            secureTextEntry={!mostrarSenha}
            style={foco === "password" ? style.LayoutEvent : style.inputText}
            value={userLogin.password}
            onChangeText={(e) => setUserLogin({ ...userLogin, password: e })}
          />
          <Pressable onPress={() => setMostrarSenha(!mostrarSenha)}>
            <Icon
              name={mostrarSenha ? "eye-off" : "eye"}
              size={24}
              color="#665"
            />
          </Pressable>
        </View>
      </View>

      <Pressable style={style.linkStyle} onPress={Enter}>
        <Text style={style.label}>Entrar</Text>
      </Pressable>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
    gap: 20,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  inputLogin: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 13,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  inputText: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#F3F4F6",
  },
  linkStyle: {
    width: 200,
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: "bold",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  LayoutEvent: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#D1D5DB",
  },
});
