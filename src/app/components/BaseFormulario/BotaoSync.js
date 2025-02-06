import { Pressable, Text, StyleSheet, Alert } from "react-native"
// import * as SQLLite from 'expo-sqlite'
import * as SQLLite from 'expo-sqlite';
import sync_clients from "../../functions/services/clients/serviceSync";
import { useRouter } from "expo-router";
import services from "../../functions/services/clients/servicesClient";
import { parse, isValid } from 'date-fns';
import sync_forms from "../../functions/services/forms/servicesSyncF";
import servicesForms from "../../functions/services/forms/servicesForms";


export default  function Sync({method, table, dados, msg}){
    const router = useRouter();
    // var dadosAnt = dados;
    var methodDb;

    // console.log(dados)
    const SyncData = async () =>{
        
        if (method === 'POST'){
            delete dados.codfor;
            console.log('aqui no post')
            methodDb = 'INSERT'
        }
        else if (method === 'PUT'){
            methodDb = 'UPDATE'
            console.log('aqui no put')
            console.log(dados.datnas)
        }
        else if (method === 'DELETE'){
            methodDb = 'DELETE'
        }
        else if (method === 'GET'){
            methodDb = 'SELECT'
        }

        var data;
        // console.log(dados + "aquinovo")
        try {
            data = await sync_forms(method, dados);
            console.log(data)
            console.log('deu')
        } catch (error) {
            console.log(error)
        }
        
        console.log(data.status)

        if(data.status == 200){
            try {
                if(method === 'POST'){
                    const result = await servicesForms('INSERT', table, '', data.data.codfor, router);
                }
                else if (method === 'PUT'){
                    const result = await services('UPDATE', table, '', data.codfor, router, 1);
                }
                Alert.alert('Sucesso', msg + ' efetuada com sucesso');
            } catch (error) {
                console.log(error);
            }
        }
        else {
            console.log(dados)
            console.log(data)
        }
    }

    return (
        <Pressable
            style={style.linkStyle}
            onPress={SyncData}
        >
            <Text style={style.linkStyle}>Sincronizar</Text>
        </Pressable>
    )
}

const style = StyleSheet.create({
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
  }
});