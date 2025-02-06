import React from 'react';
import FormularioBase from '../../components/BaseFormulario/FormularioBase';

export default function UpdateNSync() {
  return (
    <FormularioBase acao={'INSERT'} desc={'Cadastrar'} method={'POST'} msg={'Cadastro'} msgs={'Sincronização'} table={'forms_producao_nsync'} table2={'forms_producao_sync'}></FormularioBase>
  );
}