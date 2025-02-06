import { useEffect, useState } from "react";
import services from "./servicesClient";
import sync_clients from "./serviceSync";


export default async function SincronizaClientes(){
    //Verifica os clientes que não existem na API, e deleta
    try {
        const data_off = await services('SELECT', 'clientes_producao_sync', 'ALL', '');
        data_off.forEach(async (item) =>{
            const result = await sync_clients('GET', '', 'ID', item.codcli);
            if(!result){
                const result = services('DELETE', 'clientes_producao_sync', '', item.codcli, '', '');
                console.log(result)
            }
            console.log(item.codcli)
        });

        const data = await sync_clients('GET', '');
        if (data.length > 0) {
            data.forEach((item) => {
            const result = services('SELECT', 'clientes_producao_sync', 'ID', item.codcli, '', '');
            result.then((value)=>{
                if(value.length > 0){
                    const result = services('UPDATE', 'clientes_producao_sync', '', item, '', '');
                    console.log(result)
                }
                else {
                    const result = services('INSERT', 'clientes_producao_sync', '', item, '', '');
                }
                console.log('passei na sinc dos cli')
            })
            });
        }
        return 'ok'
    } catch (error) {
        return error;
    }

}
