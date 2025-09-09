import { apiRaiz } from "../api/source";
import { fetchWithAuth } from "../middleware/fetchWithAuth";

export default async function sync_forms(method, data, action, id){
    const param = 'forms/';
    if(method == "POST"){
        try {         
            console.log(data)
            const result = await fetchWithAuth(apiRaiz + param, {
                method:'POST',
                body:JSON.stringify(data),
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
            API_REQ = apiRaiz + param + id;
        }
        else {
            API_REQ = apiRaiz + param;
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
            const codfor = data.codfor;
            console.log('id cliente' + codfor)
            console.log(data)
            delete data.codfor;
            console.log(data)
            const result = await fetchWithAuth(apiRaiz + param + codfor, {
                method:'PUT',
                body:JSON.stringify(data),
                });
            
        
            return {
                status: result.status,
                data: await result.json()
                // codfor: codfor,
            }
        } catch (error) {
            return error;
        }
    }
}