import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { tables } from "../db/tables";
import servicesTipoFormulario from "./serviceTipoFormularios";
import sync_TipoFormulario from "./serviceSync";

export default async function SincronizaTipoFormularios(){
    //Verifica os clientes que não existem na API, e deleta
    try {
        const data_off = await servicesTipoFormulario('SELECT', tables.tipo_formulario, 'ALL', '');
        data_off.forEach(async (item) =>{
          const result = await ('GET', '', 'ID', item.tipfor);
    
          if(!result){
              const result = servicesTipoFormulario('DELETE', tables.tipo_formulario, '', item.tipfor, '', '');
              console.log(result)
          }
        });
        
        const data = await sync_TipoFormulario('GET', '');
        if (data.length > 0) {
          console.log("tem mais do que 0");
          data.forEach((item) => {
            console.log(item)
            const result = servicesTipoFormulario('SELECT', tables.tipo_formulario, 'ID', item.tipfor, '', '');
            result.then((value)=>{
              if(value.length > 0){
                  const result = servicesTipoFormulario('UPDATE', tables.tipo_formulario, '', item, '', '');
              }
              else {
                  const result = servicesTipoFormulario('INSERT', tables.tipo_formulario, '', item, '', '');
                  console.log(result);
                  console.log("resultado tipo");
              }
            })
          });
        }
      return 'ok'
    } catch (error) {
        console.log("erro ao sincronizar tipo sincroniza: " + error)
        return error;
    }
}
