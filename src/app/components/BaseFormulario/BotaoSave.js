import { Pressable, Text, StyleSheet, Alert } from "react-native"
// import * as SQLLite from 'expo-sqlite'
import * as SQLLite from 'expo-sqlite';
import services from "../../functions/services/clients/servicesClient";
import { useRouter } from "expo-router";
import servicesForms from "../../functions/services/forms/servicesForms";

export default  function Save({acao, table, method, data, desc, msg}){
    const router = useRouter();

    const SaveData = async () =>{
        try {
            const result = await servicesForms(acao, table, method, data, router, 0);
            Alert.alert('Sucesso', msg + ' efetuada com sucesso');
        } catch (error) {
            console.log(error)
        }
        console.log(result);
    }

    return (
        <Pressable
            style={style.linkStyle}
            onPress={SaveData}
        >
            <Text style={style.linkStyle}>{desc}</Text>
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