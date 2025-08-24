import React from 'react';
import FormularioBase from '../../components/BaseFormulario/FormularioBase';
import { tables } from '../../functions/services/db/tables';

export default function UpdateNSync() {
  return (
    <FormularioBase acao={'INSERT'} desc={'Cadastrar'} method={'POST'} msg={'Cadastro'} msgs={'Sincronização'} table={tables.formularios} table2={tables.tipo_formulario}></FormularioBase>
  );
}