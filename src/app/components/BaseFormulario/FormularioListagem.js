import React from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import services from '../../functions/services/clients/servicesClient';
import servicesForms from '../../functions/services/forms/servicesForms';

export default function FormulariosListagem({table, type}) {
  const [forms, setForms] = useState([]);

  const getData = async () => {
    const data = await servicesForms('SELECT', table, 'ALL', '');
    setForms(data);
  };

  useEffect(() => {
    getData();
    console.log(forms)
  }, []);

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <Text style={style.headerText}>Formularios</Text>
      </View>

      <FlatList
        contentContainerStyle={style.flatlist}
        data={forms}
        keyExtractor={(item) => item.codfor.toString()}
        renderItem={({ item }) => (
          <View style={style.itemContainer}>
            <Text style={style.itemText}>{item.codfor}</Text>
            <Link href={'/forms/update/'+type+'/id/' + item.codfor} style={style.editButton}>Editar</Link>
          </View>
        )}
      />
      <Link style={style.linkStyle} href={'/'}>Voltar</Link>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3FF',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E0E0E0', // Cor de fundo do cabeçalho
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign:'center'
  },
  flatlist: {
    flex: 1,
    width: '100%',
    gap:10
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Para dispositivos Android
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  editButton: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
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
    gap:20
  }
});
