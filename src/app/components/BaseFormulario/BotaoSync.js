import React, { useState } from "react";
import { Pressable, Text, StyleSheet, Alert, Modal, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import sync_forms from "../../functions/services/forms/servicesSyncF";
import servicesForms from "../../functions/services/forms/servicesForms";

export default function Sync({ method, table, dados, msg, dataDel }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const SyncData = async () => {
    setLoading(true); // 🔹 ativa o carregamento
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
          if (created.status !== 200) {
            Alert.alert("Erro ao sincronizar!");
            return;
          }
          data = created;
        } else {
          // existe → atualiza
          data = await sync_forms("PUT", dados);
        }
      } else {
        // POST, DELETE, GET normais
        data = await sync_forms(method, dados);
      }

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
      }
    } catch (error) {
      console.log("Erro SyncData:", error);
      Alert.alert("Erro", "Falha na comunicação com o servidor");
    } finally {
      setLoading(false); // 🔹 desativa o carregamento SEMPRE
    }
  };

  return (
    <>
      <Pressable style={style.linkStyle} onPress={SyncData} disabled={loading}>
        <Text style={style.textStyle}>{loading ? "Sincronizando..." : "Sincronizar"}</Text>
      </Pressable>

      {/* 🔹 Modal de carregamento */}
      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={style.modalContainer}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={style.modalText}>Sincronizando...</Text>
        </View>
      </Modal>
    </>
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
});
