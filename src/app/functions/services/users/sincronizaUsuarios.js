import { useEffect, useState } from "react";
import servicesUsers from "./servicesUser";
import sync_users from "./serviceSyncU";


export default async function SincronizaUsuarios(){
    //Verifica os clientes que não existem na API, e deleta
    try {
        const data_off = await servicesUsers('SELECT', 'users', 'ALL', '');
        data_off.forEach(async (item) =>{
            const result = await sync_users('GET', '', 'ID', item.codusu);
            if(!result){
                const result = servicesUsers('DELETE', 'users', '', item.codusu, '', '');
                console.log(result)
            }
            console.log(item.codusu)
        });

        const data = await sync_users('GET', '');
        if (data.length > 0) {
            data.forEach((item) => {
            const result = servicesUsers('SELECT', 'users', 'ID', item.codusu, '', '');
            result.then((value)=>{
                if(value.length > 0){
                    const result = servicesUsers('UPDATE', 'users', '', item, '', '');
                    console.log(result)
                }
                else {
                    const result = servicesUsers('INSERT', 'users', '', item, '', '');
                }
            })
            });
        }
        return 'ok'
    } catch (error) {
        return error;
    }

}
