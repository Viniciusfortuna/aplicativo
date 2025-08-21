import { useEffect, useState } from "react";
import servicesAgents from "./serviceAgents";
import sync_agents from './serviceSyncA';
import { Alert } from "react-native";
import { tables } from "../db/tables";


export default async function SincronizaAgentes(){
    //Verifica os clientes que não existem na API, e deleta
    try {
        const data_off = await servicesAgents('SELECT', tables.agentes, 'ALL', '');
        data_off.forEach(async (item) =>{
          const result = await ('GET', '', 'ID', item.codage);
    
          if(!result){
              const result = servicesAgents('DELETE', tables.agentes, '', item.codage, '', '');
              console.log(result)
          }
        });
        
        const data = await sync_agents('GET', '');
        if (data.length > 0) {
          data.forEach((item) => {
            console.log(item)
            const result = servicesAgents('SELECT', tables.agentes, 'ID', item.codage, '', '');
            result.then((value)=>{
              if(value.length > 0){
                  const result = servicesAgents('UPDATE', tables.agentes, '', item, '', '');
                  console.log(result)
              }
              else {
                  const result = servicesAgents('INSERT', tables.agentes, '', item, '', '');
              }
            })
          });
        }
      return 'ok'
    } catch (error) {
        return error;
    }
}
