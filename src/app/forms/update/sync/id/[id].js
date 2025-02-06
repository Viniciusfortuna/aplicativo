import React, { useState, useEffect } from 'react';
import ClienteBase from '../../../../components/BaseCliente/ClienteBase';
import FormularioBase from '../../../../components/BaseFormulario/FormularioBase';


export default function UpdateNSync() {
  return (
    <FormularioBase acao={'UPDATE'} desc={'Atualizar'} method={'PUT'} msg={'Atualização'} msgs={'Sincronização'} table={'forms_producao_sync'} table2={'forms_producao_sync'}></FormularioBase>
  );
}