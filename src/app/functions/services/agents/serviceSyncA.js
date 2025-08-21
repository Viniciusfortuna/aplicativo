import { apiRaiz } from "../api/source";

export default async function sync_agents(method, data, action, id){
    const param = 'agents'
    if(method == "POST"){
        try {
            const result = await fetch(apiRaiz+param+'/', {
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
            API_REQ = apiRaiz+param+'/' + id;
        }
        else {
            API_REQ = apiRaiz+param+'/';
        }
        try {
            const result = await fetch(API_REQ, {
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                }
            });  
            return result.json()
        } catch (error) {
            return error;
        }
    }
    else if(method == "PUT"){
        try {
            const codage = data.codage;
            delete data.codage;
            const result = await fetch(apiRaiz+param+'/' + codage, {
                method:'PUT',
                body:JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json',
                }
                });
            
        
            return {
                status: result.status,
                codage: codage,
            }
        } catch (error) {
            return error;
        }
    }
}