import ClienteListagem from "../../../components/BaseCliente/ClienteListagem";
import { tables } from "../../../functions/services/db/tables";

export default function ListNotSync(){
  return (
      <ClienteListagem table={tables.clientes} type={'sync'}></ClienteListagem>
  );
}