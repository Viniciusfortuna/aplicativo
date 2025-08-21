import ClienteListagem from "../../../components/BaseCliente/ClienteListagem";
import TipoFormulariosListagem from "../../../components/BaseTipoFormularios/TipoFormulariosListagem";
import { tables } from "../../../functions/services/db/tables";

export default function ListNotSync(){
  return (
      <TipoFormulariosListagem table={tables.tipo_formulario} type={'sync'}></TipoFormulariosListagem>
  );
}