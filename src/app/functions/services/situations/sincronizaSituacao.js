import servicesSituation from "./servicesSituation";
import sync_situation from "./serviceSyncS";

export default async function SincronizaSituacao() {
  //Verifica os clientes que não existem na API, e deleta
  try {
    const data_off = await servicesSituation("SELECT", "situacao", "ALL", "");
    data_off.forEach(async (item) => {
      const result = await sync_situation("GET", "", "ID", item.codsit);
      if (!result) {
        const result = servicesSituation(
          "DELETE",
          "situacao",
          "",
          item.codsit,
          "",
          ""
        );
        console.log(result);
      }
      console.log(item.codsit);
    });

    const data = await sync_situation("GET", "");
    if (data.length > 0) {
      data.forEach((item) => {
        const result = servicesSituation(
          "SELECT",
          "situacao",
          "ID",
          item.codsit,
          "",
          ""
        );
        result.then((value) => {
          if (value.length > 0) {
            const result = servicesSituation(
              "UPDATE",
              "situacao",
              "",
              item,
              "",
              ""
            );
            console.log(result);
          } else {
            const result = servicesSituation(
              "INSERT",
              "situacao",
              "",
              item,
              "",
              ""
            );
          }
        });
      });
    }
    return "ok";
  } catch (error) {
    return error;
  }
}
