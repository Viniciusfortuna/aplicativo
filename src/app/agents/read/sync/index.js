import AgenteListagem from "../../../components/BaseAgente/AgenteListagem";
import ClienteListagem from "../../../components/BaseCliente/ClienteListagem";
import { tables } from "../../../functions/services/db/tables";

export default function ListNotSync(){
  return (
      <AgenteListagem table={tables.agentes} type={'sync'}></AgenteListagem>
  );
}