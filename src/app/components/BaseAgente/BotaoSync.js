import { Pressable, Text, StyleSheet, Alert } from "react-native";
// import * as SQLLite from 'expo-sqlite'
import * as SQLLite from "expo-sqlite";
import sync_clients from "../../functions/services/clients/serviceSync";
import { useRouter } from "expo-router";
import services from "../../functions/services/clients/servicesClient";
import { parse, isValid } from "date-fns";
import sync_agents from "../../functions/services/agents/serviceSyncA";

export default function SyncAgente({ method, table, dados, msg }) {
  const router = useRouter();
  // var dadosAnt = dados;
  var methodDb;

  // console.log(dados)
  const SyncData = async () => {
    // delete dados.codcli;
    // const data = await sync_clients(method, dados);

    // console.log(data)
    // console.log(data.data.cliente)
    // console.log(data.status)
    console.log(dados.datnas);
    if (dados.datnas) {
      console.log("aqui");

      try {
        // Verifica se já está no formato ISO
        if (dados.datnas.includes("T")) {
          const dateISO = new Date(dados.datnas);
          if (isValid(dateISO)) {
            dados.datnas = dateISO.toISOString(); // Confirma que está no formato correto
          }
        }

        // Caso não esteja no formato ISO, tenta fazer parsing de outro formato
        const formattedDate = parse(dados.datnas, "dd/MM/yyyy", new Date());
        if (isValid(formattedDate)) {
          dados.datnas = formattedDate.toISOString(); // Converte para ISO
        } else {
          console.log("Data inválida:", dados.datnas);
        }
      } catch (error) {
        console.log("Erro ao formatar a data:", error);
      }
    }

    console.log(dados.datnas);
    console.log("novo");

    if (method === "POST") {
      delete dados.codage;
      console.log("aqui no post");
      methodDb = "INSERT";
    } else if (method === "PUT") {
      methodDb = "UPDATE";
      console.log("aqui no put");
      console.log(dados.datnas);
    } else if (method === "DELETE") {
      methodDb = "DELETE";
    } else if (method === "GET") {
      methodDb = "SELECT";
    }

    var data;
    // console.log(dados + "aquinovo")
    try {
      data = await sync_agents(method, dados);
      console.log(data);
      console.log("deu");
    } catch (error) {
      console.log(error);
    }

    console.log(data.status);

    // console.log(data)
    // console.log(data.data.cliente)
    // console.log(data.status)

    if (data.status == 200) {
      try {
        if (method === "POST") {
          const result = await services(
            "INSERT",
            table,
            "",
            data.data.agente,
            router
          );
        } else if (method === "PUT") {
          const result = await services(
            "UPDATE",
            table,
            "",
            data.codage,
            router,
            1
          );
        }
        Alert.alert("Sucesso", msg + " efetuada com sucesso");
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log(dados);
      console.log(data);
    }
  };

  return (
    <Pressable style={style.linkStyle} onPress={SyncData}>
      <Text style={style.linkStyle}>Sincronizar</Text>
    </Pressable>
  );
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
  },
});
