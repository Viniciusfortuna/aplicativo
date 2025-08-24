import { tables } from "../db/tables";
import servicesPerguntasTipoFormulario from "./servicePerguntasTipoFormularios";
import sync_PerguntasTipoFormulario from "./serviceSync";

export default async function SincronizaPerguntasTipoFormulario() {
  try {
    // Pega todos os dados locais da tabela perguntas_tipo_formulario
    const data_off = await servicesPerguntasTipoFormulario('SELECT', tables.perguntas_tipo_formulario, 'ALL', '');

    // Verifica no servidor se os itens locais ainda existem, senão deleta localmente
    for (const item of data_off) {
      const result = await sync_PerguntasTipoFormulario('GET', '', 'ID', item.idperg);

      // Se não existe no servidor, deleta localmente
      // O retorno pode variar, então teste se o objeto está vazio ou tem erro
      if (!result || (result.status && result.status === 404)) {
        await servicesPerguntasTipoFormulario('DELETE', tables.perguntas_tipo_formulario, '', item.idperg, '', '');
        console.log(`Item com idperg ${item.idperg} deletado localmente pois não existe no servidor.`);
      }
    }

    // Busca todos os dados do servidor para atualizar ou inserir localmente
    const data = await sync_PerguntasTipoFormulario('GET', '');

    if (data && data.length > 0) {
      console.log("Tem mais do que 0 itens no servidor, sincronizando...");

      for (const item of data) {
        const localRecords = await servicesPerguntasTipoFormulario('SELECT', tables.perguntas_tipo_formulario, 'ID', item.idperg, '', '');

        if (localRecords && localRecords.length > 0) {
          // Atualiza o registro local
          await servicesPerguntasTipoFormulario('UPDATE', tables.perguntas_tipo_formulario, '', item, '', '');
          console.log(`Atualizado localmente: idperg ${item.idperg}`);
        } else {
          // Insere novo registro local
          await servicesPerguntasTipoFormulario('INSERT', tables.perguntas_tipo_formulario, '', item, '', '');
          console.log(`Inserido localmente: idperg ${item.idperg}`);
        }
      }
    }

    return 'ok';
  } catch (error) {
    console.log("Erro ao sincronizar perguntas_tipo_formulario:", error);
    return error;
  }
}
