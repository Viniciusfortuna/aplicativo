import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button,TouchableOpacity, Text} from 'react-native';
import { Link } from 'expo-router';
import sync_clients from '../../functions/services/clients/serviceSync';
import services from '../../functions/services/clients/servicesClient';
import DropDownPicker from 'react-native-dropdown-picker';

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
    const data_off = await services('SELECT', 'clientes_producao_sync', 'ALL', '');
    data_off.forEach(async (item) =>{
      const result = await sync_clients('GET', '', 'ID', item.codcli);
      console.log('resultado')
      console.log(item.codcli)
      if(!result){
          const result = services('DELETE', 'clientes_producao_sync', '', item.codcli, '', '');
          console.log(result)
      }
    });
    const result = await sync_clients('GET', '');
    setData(result);
  }

  useEffect(() => {
    if (data.length > 0) {
      data.forEach((item) => {
        const result = services('SELECT', 'clientes_producao_sync', 'ID', item.codcli, '', '');
        result.then((value)=>{
          if(value.length > 0){
              const result = services('UPDATE', 'clientes_producao_sync', '', item, '', '');
              console.log(result)
          }
          else {
              const result = services('INSERT', 'clientes_producao_sync', '', item, '', '');
          }
        })
      });
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

      <Link style={style.buttonLink} href="/forms/read/not_sync">
        Não integrado
      </Link>
      <Link style={style.buttonLink} href="/forms/read/sync">
        Integrado
      </Link>
      <TouchableOpacity style={style.buttonLink} onPress={sync_api}>
        <Text style={style.buttonLink}>Sincronizar</Text>
      </TouchableOpacity>
      {/* <Button style = {style.buttonLink} onPress={sync_api} title='Sincronizar Clientes'/> */}
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
