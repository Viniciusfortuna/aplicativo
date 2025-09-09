import { Pressable, Text, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import sync_forms from "../../functions/services/forms/servicesSyncF";
import servicesForms from "../../functions/services/forms/servicesForms";

export default function Sync({ method, table, dados, msg, dataDel }) {
  const router = useRouter();

  const SyncData = async () => {
    let methodDb;
    if (method === "POST") {
      methodDb = "INSERT";
    } else if (method === "PUT") {
      methodDb = "UPDATE";
    } else if (method === "DELETE") {
      methodDb = "DELETE";
    } else if (method === "GET") {
      methodDb = "SELECT";
    }

    try {
      let data;

      // 🔹 Se for UPDATE, verifica antes se o registro existe no servidor
      if (method === "PUT") {
        const result = await sync_forms("GET", "", "ID", dados.codfor);
        
        if (!result || result.codfor == null) {
          // não existe → cria
          const created = await sync_forms("POST", dados);
          console.log(created)
          console.log('dado resposta')
          if (created.status !== 200) {
            Alert.alert("Erro ao sincronizar!");
            return;
          }
          data = created;
        } else {
          // existe → atualiza
          console.log('estou no atualiza')
          data = await sync_forms("PUT", dados);
        }
      } else {
        // POST, DELETE, GET normais
        data = await sync_forms(method, dados);
      }

      console.log("Resposta servidor:", data);

      if (data.status === 200) {
        // 🔹 Atualiza também no SQLite/local
        if (method === "POST") {
          await servicesForms("INSERT", table, "", data.data.forms, router, "", dataDel);
        } else if (method === "PUT") {
          await servicesForms("UPDATE", table, "", data.data.forms.codfor, router, 1);
        }

        Alert.alert("Sucesso", msg + " efetuada com sucesso");
      } else {
        Alert.alert("Erro", "Falha na sincronização");
        console.log("Erro sync:", data);
      }
    } catch (error) {
      console.log("Erro SyncData:", error);
      Alert.alert("Erro", "Falha na comunicação com o servidor");
    }
  };

  return (
    <Pressable style={style.linkStyle} onPress={SyncData}>
      <Text style={style.textStyle}>Sincronizar</Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
});
