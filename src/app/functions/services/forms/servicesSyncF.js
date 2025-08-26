import { apiRaiz } from "../api/source";

export default async function sync_forms(method, data, action, id){
    const param = 'forms/';
    if(method == "POST"){
        try {         
            const result = await fetch(apiRaiz + param, {
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
            API_REQ = apiRaiz + param + id;
        }
        else {
            API_REQ = apiRaiz + param;
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
            const codfor = data.codfor;
            console.log('id cliente' + codfor)
            console.log(data)
            delete data.codfor;
            console.log(data)
            const result = await fetch(apiRaiz + param + codfor, {
                method:'PUT',
                body:JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json',
                }
                });
            
        
            return {
                status: result.status,
                codfor: codfor,
            }
        } catch (error) {
            return error;
        }
    }
}