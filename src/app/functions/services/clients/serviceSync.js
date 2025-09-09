import { apiRaiz } from "../api/source";
import { fetchWithAuth } from "../middleware/fetchWithAuth";

export default async function sync_clients(method, data, action, id){
    const param = 'clients/';
    if(method == "POST"){
        try {
            const result = await fetch(apiRaiz+param, {
                method:'POST',
                body:JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json',
                }
            });

            return {
                status: result.status,
                data: await result.json(),
            }
        } catch (error) {
            return error;
        }
    }
    else if(method == "GET"){
        var API_REQ;
        if(action == "ID"){
            API_REQ = apiRaiz+param + id;
        }
        else {
            API_REQ = apiRaiz+param;
        }
        try {
            const result = await fetchWithAuth(API_REQ, {
                method:'GET',
            });  
            return result.json()
        } catch (error) {
            return error;
        }
    }
    else if(method == "PUT"){
        try {
            const codcli = data.codcli;
            delete data.codcli;
            const result = await fetch(apiRaiz+param+ codcli, {
                method:'PUT',
                body:JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json',
                }
                });
            
        
            return {
                status: result.status,
                codcli: codcli,
            }
        } catch (error) {
            return error;
        }
    }
}