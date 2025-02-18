import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, ScrollView, TextBase } from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import { Link, useLocalSearchParams } from 'expo-router';
import services from '../../functions/services/clients/servicesClient';
import LinkCustom from '../AtalhoListagem';
import Save from './BotaoSave';
import Sync from './BotaoSync';
import LoginContext from '../../contexts/loginContext';
import {Picker, PickerIOS, RNP} from '@react-native-picker/picker';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import servicesAgents from '../../functions/services/agents/serviceAgents';
import serviceSituation from '../../functions/services/situations/servicesSituation'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import servicesForms from '../../functions/services/forms/servicesForms';



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
  const [sincronizado, setSincronizado] = useState('não');
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
        const resultClientesN = await services('SELECT', 'clientes_producao_nsync' , 'ALL');
        const resultClientes = await services('SELECT', 'clientes_producao_sync', 'ALL');
        const resultAgents = await servicesAgents('SELECT', 'agentes_saude', 'ALL', '');
        const resultSituations = await serviceSituation('SELECT', 'situacao', 'ALL', '')
        
        setClientesN(resultClientesN);
        setClientes(resultClientes);
        setAgentes(resultAgents);
        setSituacao(resultSituations);
      } catch (error) {
        console.log(error);
      }
  }

  const fetchData = async () => {
    const result = await servicesForms('SELECT', table, 'ID', id);
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
    <SafeAreaProvider>
      <SafeAreaView style={style.container}>
        <ScrollView contentContainerStyle={style.container}>
          <View style={style.inputContainer}>
            <Text style={style.label}>Agente</Text>
            <Dropdown
                    style={style.dropdown}
                    placeholderStyle={style.placeholderStyle}
                    selectedTextStyle={style.selectedTextStyle}
                    inputSearchStyle={style.inputSearchStyle}
                    iconStyle={style.iconStyle}
                    data={agentes}
                    search
                    labelField="nomage"
                    valueField="codage"
                    placeholder="Select item"
                    searchPlaceholder="Search..."
                    value={codage}
                    onChange={item => {
                      setCodAge(item.codage);
                    }}
                />
          </View>

          <View style={style.inputContainer}>
            <Text style={style.label}>Cliente Sincronizado?</Text>
            <Dropdown
              style={style.dropdown}
              placeholderStyle={style.placeholderStyle}
              selectedTextStyle={style.selectedTextStyle}
              inputSearchStyle={style.inputSearchStyle}
              iconStyle={style.iconStyle}
              data={[{label: 'Sim', value: 'sim'}, {label: 'Não', value: 'não'} ]}
              search
              labelField="label"
              valueField="value"
              placeholder="Select item"
              searchPlaceholder="Search..."
              value={sincronizado}
              onChange={item => {
                setSincronizado(item);
              }}
          />
          </View>
          {sincronizado.value == 'sim' ? (
              <View style={style.inputContainer}>
                <Text style={style.label}>Selecionar cliente</Text>
                <Dropdown
                    style={style.dropdown}
                    placeholderStyle={style.placeholderStyle}
                    selectedTextStyle={style.selectedTextStyle}
                    inputSearchStyle={style.inputSearchStyle}
                    iconStyle={style.iconStyle}
                    data={clientes}
                    search
                    labelField="nomcli"
                    valueField="codcli"
                    placeholder="Select item"
                    searchPlaceholder="Search..."
                    value={codcli}
                    onChange={item => {
                      setCodCli(item.codcli);
                    }}
                />
              </View>
            ) : (
              <View style={style.inputContainer}>
                <Text style={style.label}>Selecionar cliente</Text>
                <Dropdown
                    style={style.dropdown}
                    placeholderStyle={style.placeholderStyle}
                    selectedTextStyle={style.selectedTextStyle}
                    inputSearchStyle={style.inputSearchStyle}
                    iconStyle={style.iconStyle}
                    data={clientesN}
                    search
                    labelField="nomcli"
                    valueField="codcli"
                    placeholder="Select item"
                    searchPlaceholder="Search..."
                    value={ns_codcli}
                    onChange={item => {
                      setNs_Codcli(item.codcli);
                    }}
                />
              </View>
            )}
          <View style={style.inputContainer}>
            <Text style={style.label}>Descrição</Text>
            <TextInput style={style.inputMemo} value={descri} onChangeText={setDesCri} multiline={true} />
          </View>
          <View style={style.inputContainer}>
            <Text style={style.label}>Remedios Receitados</Text>
            <TextInput style={style.inputText} value={remrec} onChangeText={setRemRec} />
          </View>
          <View style={style.inputContainer}>
          <Text style={style.label}>Selecionar Situação</Text>
          <Dropdown
                    style={style.dropdown}
                    placeholderStyle={style.placeholderStyle}
                    selectedTextStyle={style.selectedTextStyle}
                    inputSearchStyle={style.inputSearchStyle}
                    iconStyle={style.iconStyle}
                    data={situacao}
                    search
                    labelField="dessit"
                    valueField="codsit"
                    placeholder="Select item"
                    searchPlaceholder="Search..."
                    value={codsit}
                    onChange={item => {
                      setCodSit(item.codsit);
                    }}
              />
          </View>
          <Save style={style.linkStyle} acao={acao} table={table} data={data} desc={desc} msg={msg}/>
          <Sync style={style.linkStyle} method={method} dados={data} table={table2} msg={msgs} dataDel={id} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3FF",
    paddingVertical: 20,
    paddingHorizontal: 15,
    gap: 3,
    alignItems:'center',
    justifyContent:'space-between'
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
  dropdown: {
    height: 40,
    width: 200,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 15,
    height: 15,
  },
  inputSearchStyle: {
    height: 30,
    fontSize: 16,
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
});
