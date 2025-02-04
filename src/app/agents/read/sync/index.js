import AgenteListagem from "../../../components/BaseAgente/AgenteListagem";
import ClienteListagem from "../../../components/BaseCliente/ClienteListagem";

export default function ListNotSync(){
  return (
      <AgenteListagem table={'agentes_saude'} type={'sync'}></AgenteListagem>
  );
}