import { useEffect, useState } from "react";
import services from "./servicesClient";
import sync_clients from "./serviceSync";
import { tables } from "../db/tables";


export default async function SincronizaClientes(){
    //Verifica os clientes que não existem na API, e deleta
    try {
        const data_off = await services('SELECT', tables.clientes, 'ALL', '');
        data_off.forEach(async (item) =>{
            const result = await sync_clients('GET', '', 'ID', item.codcli);
            if(!result){
                const result = services('DELETE', tables.clientes, '', item.codcli, '', '');
            }
        });

        const data = await sync_clients('GET', '');
        if (data.length > 0) {
            data.forEach((item) => {
            const result = services('SELECT', tables.clientes, 'ID', item.codcli, '', '');
            result.then((value)=>{
                if(value.length > 0){
                    const result = services('UPDATE', tables.clientes, '', item, '', '');
                    console.log(result)
                }
                else {
                    const result = services('INSERT', tables.clientes, '', item, '', '');
                }
            })
            });
        }
        return 'ok'
    } catch (error) {
        return error;
    }

}
