import React, { useState, useEffect } from 'react';
import ClienteBase from '../../../../components/BaseCliente/ClienteBase';

export default function UpdateNSync() {
  return (
    <ClienteBase acao={'UPDATE'} desc={'Atualizar'} method={'POST'} msg={'Atualização'} msgs={'Sincronização'} table={'clientes_producao_nsync'} table2={'clientes_producao_sync'}></ClienteBase>
  );
}