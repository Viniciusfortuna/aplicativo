import React, { useState, useEffect } from 'react';
import ClienteBase from '../../../../components/BaseCliente/ClienteBase';
import FormularioBase from '../../../../components/BaseFormulario/FormularioBase';
import { tables } from '../../../../functions/services/db/tables';


export default function UpdateNSync() {
  return (
    <FormularioBase acao={'UPDATE'} desc={'Atualizar'} method={'PUT'} msg={'Atualização'} msgs={'Sincronização'} table={tables.formularios} table2={tables.formularios}></FormularioBase>
  );
}