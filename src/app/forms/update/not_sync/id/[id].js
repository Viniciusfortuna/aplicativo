import React, { useState, useEffect } from 'react';
import FormularioBase from '../../../../components/BaseFormulario/FormularioBase';

export default function UpdateNSync() {
  return (
    <FormularioBase acao={'UPDATE'} desc={'Atualizar'} method={'POST'} msg={'Atualização'} msgs={'Sincronização'} table={'forms_producao_nsync'} table2={'forms_producao_sync'}></FormularioBase>
  );
}