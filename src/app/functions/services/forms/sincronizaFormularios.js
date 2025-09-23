import { tables } from "../db/tables";
import servicesForms from "./servicesForms";
import sync_forms from "./servicesSyncF";


export default async function SincronizaForms() {
  try {
    // Pega todos os dados locais da tabela formulários
    const data_off = await servicesForms('SELECT', tables.formularios, 'ALL', '', '', '', 1);

    // Verifica no servidor se os itens locais ainda existem, senão deleta localmente
    for (const item of data_off) {
      const result = await sync_forms('GET', '', 'ID', item.codfor);

      // Se não existe no servidor, deleta localmente
      // O retorno pode variar, então teste se o objeto está vazio ou tem erro
      if (!result || (result.status && result.status === 404)) {
        await servicesForms('DELETE', tables.formularios, '', item.codfor);
        console.log(`Item com codfor ${item.codfor} deletado localmente pois não existe no servidor.`);
      }
    }

    // Busca todos os dados do servidor para atualizar ou inserir localmente
    const data = await sync_forms('GET', '');
    console.log('itens a sinc')
      console.log(data)
    if (data && data.length > 0) {
      console.log("Tem mais do que 0 itens no servidor, sincronizando...");
    

      for (const item of data) {
        const localRecords = await servicesForms('SELECT', tables.formularios, 'ID', item.codfor, '', '');

        if (localRecords && (Array.isArray(localRecords) ? localRecords.length > 0 : Object.keys(localRecords).length > 0)) {
          // Atualiza o registro local
          if(localRecords.sitsin === 1){
              console.log(`Ignorando codfor ${item.codfor} pois sitsin == 1`);
              continue;
          }
          await servicesForms('UPDATE', tables.formularios, '', item, '', 3);
          console.log(`Atualizado localmente: codfor ${item.codfor}`);
        } else {
          // Insere novo registro local
          await servicesForms('INSERT', tables.formularios, '', item, '', '');
          console.log(`Inserido localmente: codfor ${item.codfor}`);
        }
      }
    }

    return 'ok';
  } catch (error) {
    console.log("Erro ao sincronizar formulários:", error);
    return error;
  }
}
