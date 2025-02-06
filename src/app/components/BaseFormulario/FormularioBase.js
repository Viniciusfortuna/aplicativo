import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, ScrollView } from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import { Link, useLocalSearchParams } from 'expo-router';
import services from '../../functions/services/clients/servicesClient';
import LinkCustom from '../AtalhoListagem';
import Save from './BotaoSave';
import Sync from './BotaoSync';
import LoginContext from '../../contexts/loginContext';
import DropDownPicker from 'react-native-dropdown-picker';
import Picker from '@react-native-picker/picker'

export default function FormularioBase({acao, table, dado, desc, msg, method, msgs, table2}) {
  const [codage, setCodAge] = useState('');
  const [codcli, setCodCli] = useState('');
  const [ns_codcli, setNs_Codcli] = useState('');
  const [descri, setDesCri] = useState('');
  const [remrec, setRemRec] = useState('');
  const [codsit, setCodSit] = useState('');
  const [usuger, setUsuGer] = useState('');
  const [datger, setDatGer] = useState('');
  const [situacao, setSituacao] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clientesN, setClientesN] = useState([]);
  const [agentes, setAgentes] = useState([]);
  const [sincronizado, setSincronizado] = useState([]);
  const {login} = useContext(LoginContext);
  const { id } = useLocalSearchParams();
  

  const data = {
        codfor: id,
        codage: codage,
        codcli: codcli,
        ns_codcli: ns_codcli,
        descri: descri,
        remrec: remrec,
        codsit: codsit,
        usuger: login.codusu
  };

  console.log('acao é ' + acao)
  if(acao != 'INSERT'){
      useEffect(() => {
        fetchData();
      }, []);
  }
  else {
    delete data.codfor;
  }

  useEffect(()=>{
      fetchOpcoes();
  },[]);

  const fetchOpcoes = async () => {
      try {
        const resultClientesN = await services('SELECT', table, 'ALL');
        const resultClientes = await services('SELECT', table2, 'ALL');
        setClientesN(resultClientesN);
        setClientes(resultClientes);
      } catch (error) {
        console.log(error);
      }
  }

  const fetchData = async () => {
    const result = await services('SELECT', table, 'ID', id);
    setCodAge(result[0]?.codage || '');
    setCodCli(result[0]?.codcli || '');
    setNs_Codcli(result[0]?.ns_codcli || '');
    setDesCri(result[0]?.descri || '');
    setRemRec(result[0]?.remrec || '');
    setCodSit(result[0]?.codsit || '');
    setUsuGer(result[0]?.usuger || '');
    setDatGer(result[0]?.datger || '');
    if(result[0].datger){
      var dataFormatada = new Date(result[0].datger).toLocaleString('pt-br');
      if(dataFormatada === 'Invalid Date') setDatGer(result[0].datger);
      else setDatGer(dataFormatada);
    }
  };

  return (
    <ScrollView contentContainerStyle={style.container}>
      <View style={style.inputContainer}>
        <Text style={style.label}>Agente</Text>
        <TextInput style={style.inputText} value={codage} onChangeText={setCodAge} />
      </View>

      <View style={style.inputContainer}>
        <Text style={style.label}>Cliente Sincronizado?</Text>
        <Picker
          selectedValue={sincronizado}
          onValueChange={(itemValue) => setSincronizado(itemValue)}
          style={style.inputText}
        >
          <Picker.Item label="Sim" value="sim" />
          <Picker.Item label="Não" value="nao" />
        </Picker>
      </View>
      {sincronizado === "sim" ? (
          <View style={style.inputContainer}>
            <Picker
              selectedValue={codcli}
              onValueChange={(itemValue) => setCodCli(itemValue)}
              style={style.inputText}
            >
              <Picker.Item label="Selecione um cliente" value="" />
              {clientes.map((cliente) => (
                <Picker.Item key={cliente.codcli} label={cliente.nomcli} value={cliente.codcli} />
              ))}
            </Picker>
          </View>
        ) : (
          <View style={style.inputContainer}>
            <Picker
              selectedValue={ns_codcli}
              onValueChange={(itemValue) => setNs_Codcli(itemValue)}
              style={style.inputText}
            >
              <Picker.Item label="Selecione um cliente" value="" />
              {clientesN.map((cliente) => (
                <Picker.Item key={cliente.codcli} label={cliente.nomcli} value={cliente.codcli} />
              ))}
            </Picker>
          </View>
        )}
      <View style={style.inputContainer}>
        <Text style={style.label}>Descrição</Text>
        <TextInput style={style.inputText} value={descri} onChangeText={setDesCri} />
      </View>
      <View style={style.inputContainer}>
        <Text style={style.label}>Remedios Receitados</Text>
        <TextInput style={style.inputText} value={remrec} onChangeText={setRemRec} />
      </View>
      <View style={style.inputContainer}>
        <Picker
              selectedValue={codsit}
              onValueChange={(itemValue) => setCodCli(itemValue)}
              style={style.inputText}
            >
              <Picker.Item label="Selecione uma situação" value="" />
              {situacao.map((situacao) => (
                <Picker.Item key={situacao.cossit} label={situacao.dessit} value={situacao.cossit} />
              ))}
            </Picker>
      </View>
      <Save style={style.linkStyle} acao={acao} table={table} data={data} desc={desc} msg={msg}/>

      <Sync style={style.linkStyle} method={method} dados={data} table={table2} msg={msgs}/>
      
      <LinkCustom></LinkCustom>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3FF",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
    gap: 20,
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
