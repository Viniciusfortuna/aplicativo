import ClienteListagem from "../../../components/BaseCliente/ClienteListagem";

export default function ListNotSync(){
  return (
      <ClienteListagem table={'clientes_producao_nsync'} type={'not_sync'}></ClienteListagem>
  );
}