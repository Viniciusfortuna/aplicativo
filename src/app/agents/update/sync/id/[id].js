import React, { useState, useEffect } from 'react';
import ClienteBase from '../../../../components/BaseCliente/ClienteBase';
import AgenteBase from '../../../../components/BaseAgente/AgenteBase';

export default function UpdateNSync() {
  return (
    <AgenteBase acao={'UPDATE'} desc={'Atualizar'} method={'PUT'} msg={'Atualização'} msgs={'Sincronização'} table={'agentes_saude'} table2={'agentes_saude'}></AgenteBase>
  );
}