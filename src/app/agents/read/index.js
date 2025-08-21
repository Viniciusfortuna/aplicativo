import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button,TouchableOpacity, Text, Alert} from 'react-native';
import { Link } from 'expo-router';
import sync_clients from '../../functions/services/clients/serviceSync';
import services from '../../functions/services/clients/servicesClient';
import DropDownPicker from 'react-native-dropdown-picker';
import servicesAgents from '../../functions/services/agents/serviceAgents';
import sync_agents from '../../functions/services/agents/serviceSyncA';

export default function App() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Sincronizados', value: 'sync' },
    { label: 'Não Sincronizados', value: 'not_sync' }
  ]);

  const sync_api = async () => {
    //Verifica os clientes que não existem na API, e deleta
    const data_off = await servicesAgents('SELECT', 'agentes_saude', 'ALL', '');
    data_off.forEach(async (item) =>{
      const result = await sync_agents('GET', '', 'ID', item.codage);
 
      if(!result){
          const result = servicesAgents('DELETE', 'agentes_saude', '', item.codage, '', '');
          console.log(result)
      }
    });
    console.log('chegeui aqui')
    const result = await sync_agents('GET', '');
    setData(result);
  }

  useEffect(() => {
    if (data.length > 0) {
      data.forEach((item) => {
        console.log(item)
        const result = servicesAgents('SELECT', 'agentes_saude', 'ID', item.codage, '', '');
        result.then((value)=>{
          if(value.length > 0){
              const result = servicesAgents('UPDATE', 'agentes_saude', '', item, '', '');
              console.log(result)
          }
          else {
              const result = servicesAgents('INSERT', 'agentes_saude', '', item, '', '');
          }
        })
      });

      Alert.alert('Sincronização', 'Processo efetuado com sucesso!')
    }
  }, [data]);

  /*
  useEffect(() => {
      data.forEach((item) => {
        const result = services('SELECT', 'clientes_producao_sync', 'ID', item.codcli, '', '');
        result.then((value)=>{
          if(value.length > 0){
              const result = services('UPDATE', 'clientes_producao_sync', '', item, '', '');
              console.log(result)
          }
        })
      });
  }, [value]);*/


  return (
    <View style={style.container}>
  
       {/* <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Selecione uma opção"
      /> */}

      <Link style={style.buttonLink} href="/agents/read/not_sync">
        Não integrado
      </Link>
      <Link style={style.buttonLink} href="/agents/read/sync">
        Integrado
      </Link>
      <TouchableOpacity style={style.buttonLink} onPress={sync_api}>
        <Text style={style.buttonLink}>Sincronizar</Text>
      </TouchableOpacity>
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
