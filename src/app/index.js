import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Button,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sync_login from "./functions/services/login/serviceSyncL";
import LoginContext from "./contexts/loginContext";
import migrations from "./functions/services/db/migrations";
import Icon from "react-native-vector-icons/Feather"; // Ícone de olho
import IconB from "react-native-vector-icons/FontAwesome"; // Ícone de olho
import ModalLoading from "./components/Modal/modalLoading";

export default function LoginBase() {
  const router = useRouter();
  const { login, setLogin } = useContext(LoginContext);
  const [foco, setFoco] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userLogin, setUserLogin] = useState({
    logusu: "",
    password: "",
  });

  const Enter = async () => {
    try {
      setLoading(true);
      const response = await sync_login(userLogin, "POST");
      console.log(response);
      if (response.status == 200) {
        const result = await AsyncStorage.setItem(
          response.data.logusu,
          JSON.stringify(response.data)
        );
        setLogin(response.data);
        router.push("/home");
      } else {
        Alert.alert("Erro", "Credenciais inválidas");
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("ERRO", "Não foi possível completar sua solicitação");
      setLoading(false);
    }
  };

  const migration = async () => {
    try {
      const response = await migrations();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(false);
    migration();
  }, []);

  return (
    <ScrollView contentContainerStyle={style.container}>
      <ModalLoading loading={loading}></ModalLoading>
      <View style={style.inputContainer}>
        <Text style={style.label}>Login</Text>
        <TextInput
          style={foco === "logusu" ? style.LayoutEvent : style.inputText}
          onFocus={(e) => setFoco("logusu")}
          onBlur={(e) => setFoco(false)}
          value={userLogin.logusu}
          onChangeText={(e) => setUserLogin({ ...userLogin, logusu: e })}
          placeholder="Digite seu nome"
        />
      </View>
      <View style={style.inputContainer}>
        <Text style={style.label}>Senha</Text>
        <View style={style.inputLogin}>
          <TextInput
            keyboardType="visible-password"
            onFocus={(e) => setFoco("password")}
            onBlur={(e) => setFoco(false)}
            secureTextEntry={mostrarSenha}
            style={foco === "password" ? style.LayoutEvent : style.inputText}
            value={userLogin.password}
            onChangeText={(e) => setUserLogin({ ...userLogin, password: e })}
          ></TextInput>
          <Pressable onPress={() => setMostrarSenha(!mostrarSenha)}>
            <Icon
              name={mostrarSenha ? "eye" : "eye-off"}
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
    borderWidth: 1,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  inputLogin: {
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 13,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
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
