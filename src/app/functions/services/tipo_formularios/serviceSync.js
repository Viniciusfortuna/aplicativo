import { apiRaiz } from "../api/source";
import { fetchWithAuth } from "../middleware/fetchWithAuth";

export default async function sync_TipoFormulario(method, data, action, id){
    const param = 'type_forms'
    if(method == "POST"){
        try {
            const result = await fetchWithAuth(apiRaiz+param+'/', {
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
            API_REQ = apiRaiz+param+'/' + id;
        }
        else {
            API_REQ = apiRaiz+param+'/';
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
            const tipfor = data.tipfor;
            delete data.tipfor;
            const result = await fetchWithAuth(apiRaiz+param+'/' + tipfor, {
                method:'PUT',
                body:JSON.stringify(data),
                });
            
        
            return {
                status: result.status,
                tipfor: tipfor,
            }
        } catch (error) {
            return error;
        }
    }
}