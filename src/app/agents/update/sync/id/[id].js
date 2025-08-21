import React, { useState, useEffect } from 'react';
import ClienteBase from '../../../../components/BaseCliente/ClienteBase';
import AgenteBase from '../../../../components/BaseAgente/AgenteBase';
import { tables } from '../../../../functions/services/db/tables';

export default function UpdateNSync() {
  return (
    <AgenteBase acao={'UPDATE'} desc={'Atualizar'} method={'PUT'} msg={'Atualização'} msgs={'Sincronização'} table={tables.agentes} table2={tables.agentes}></AgenteBase>
  );
}