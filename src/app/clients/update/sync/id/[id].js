import React, { useState, useEffect } from 'react';
import ClienteBase from '../../../../components/BaseCliente/ClienteBase';
import { tables } from '../../../../functions/services/db/tables';


export default function UpdateNSync() {
  return (
    <ClienteBase acao={'UPDATE'} desc={'Atualizar'} method={'PUT'} msg={'Atualização'} msgs={'Sincronização'} table={tables.clientes} table2={tables.clientes}></ClienteBase>
  );
}