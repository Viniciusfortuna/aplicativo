import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View style={style.container}>
      <Link style={style.buttonLink} href="/clients/create">
        Cadastrar
      </Link>
      <Link style={style.buttonLink} href="/clients/read">
        Consultar
      </Link>
      {/* <Link style={style.buttonLink} href="/clients/read">
        Consultar Clientes
      </Link> */}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3FF",
    alignItems: "center",
    justifyContent: "center",
    gap: 15, // Espaçamento entre os botões
    paddingHorizontal: 20,
  },
  buttonLink: {
    width: 250,
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
});
