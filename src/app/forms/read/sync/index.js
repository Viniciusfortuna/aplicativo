import ClienteListagem from "../../../components/BaseCliente/ClienteListagem";
import FormulariosListagem from "../../../components/BaseFormulario/FormularioListagem";

export default function ListNotSync(){
  return (
      <FormulariosListagem table={'forms_producao_sync'} type={'sync'}></FormulariosListagem>
  );
}