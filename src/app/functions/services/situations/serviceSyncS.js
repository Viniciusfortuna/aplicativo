import { fetchWithAuth } from "../middleware/fetchWithAuth";

export default async function sync_situation(method, data, action, id){
    if(method == "POST"){
        try {
            const result = await fetchWithAuth('https://api-agents-health.onrender.com/situations/', {
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
            API_REQ = 'https://api-agents-health.onrender.com/situations/' + id;
        }
        else {
            API_REQ = 'https://api-agents-health.onrender.com/situations/';
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
            const codsit = data.codsit;
            delete data.codsit;
            console.log(data)
            const result = await fetchWithAuth('https://api-agents-health.onrender.com/situations/' + codsit, {
                method:'PUT',
                body:JSON.stringify(data),
                });
            
        
            return {
                status: result.status,
                codsit: codsit,
            }
        } catch (error) {
            return error;
        }
    }
}