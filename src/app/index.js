import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'
import sync_login from './functions/services/login/serviceSyncL';
import LoginContext from './contexts/loginContext';
import migrations from './functions/services/db/migrations';


export default function LoginBase() {

  const router = useRouter();
  const {login, setLogin} = useContext(LoginContext);

  const [userLogin, setUserLogin] = useState({
    logusu: "",
    password: ""
  });

  const Enter = async () => {
      try {
        const response = await sync_login(userLogin, 'POST');
        console.log(response)
        if(response.status == 200){
            const result = await AsyncStorage.setItem(response.data.logusu, JSON.stringify(response.data));
            setLogin(response.data);
            router.push('/home');
        }
      } catch (error) {
        console.log(error)
      }
  }

  const migration = async () => {
      try {
        const response = await migrations();
        console.log(response);
      } catch (error) {
        console.log(error);
      }
  }

  useEffect(()=>{
      migration();
  }, [])

  return (
    <ScrollView contentContainerStyle={style.container}>
      <View style={style.inputContainer}>
        <Text style={style.label}>Login</Text>
        <TextInput
          style={style.inputText}
          value={userLogin.logusu}
          onChangeText={(e)=> setUserLogin({...userLogin, logusu: e})}
          placeholder="Digite seu nome"
        />
      </View>
      <View style={style.inputContainer}>
        <Text style={style.label}>Senha</Text>
        <TextInput
          keyboardType='visible-password'
          style={style.inputText}
          value={userLogin.password}
          onChangeText={(e)=> setUserLogin({...userLogin, password: e})}
          ></TextInput>
      </View>
      <Pressable
        style={style.linkStyle}
        onPress={Enter}>
          <Text>Entrar</Text>
      </Pressable>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3FF",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    gap: 20,
    borderWidth: 1

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
