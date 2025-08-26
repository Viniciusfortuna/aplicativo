import ClienteListagem from "../../../components/BaseCliente/ClienteListagem";
import FormulariosListagem from "../../../components/BaseFormulario/FormularioListagem";
import { tables } from "../../../functions/services/db/tables";

export default function ListNotSync(){
  return (
      <FormulariosListagem table={tables.formularios} type={'sync'}></FormulariosListagem>
  );
}