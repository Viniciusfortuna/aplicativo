import { useEffect, useState } from "react";
import servicesUsers from "./servicesUser";
import sync_users from "./serviceSyncU";

export default async function SincronizaUsuarios() {
  //Verifica os clientes que não existem na API, e deleta
  try {
    const data_off = await servicesUsers("SELECT", "users", "ALL", "");
    console.log('verifica users')
    data_off.forEach(async (item) => {
      const result = await sync_users("GET", "", "ID", item.codusu);
      if (!result) {
        const result = servicesUsers(
          "DELETE",
          "users",
          "",
          item.codusu,
          "",
          ""
        );
      }
    });

    const data = await sync_users("GET", "");
    if (data.length > 0) {
      data.forEach((item) => {
        const result = servicesUsers(
          "SELECT",
          "users",
          "ID",
          item,
          "",
          ""
        );
        result.then((value) => {
          console.log('resultado do valie' + value.length)
          if (value.length > 0) {
            const result = servicesUsers("UPDATE", "users", "", item, "", "");
          } else {
            const result = servicesUsers("INSERT", "users", "", item, "", "");
          }
        });
      });
    }
    return "ok";
  } catch (error) {
    return error;
  }
}
