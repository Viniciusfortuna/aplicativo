export default async function sync_login(data, method){
    if(method == "POST"){
        try {
            console.log(data)
            const result = await fetch('https://api-agents-health.onrender.com/login/', {
                method:'POST',
                body:JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json',
                }
            });
            console.log(result)
            // console.log(result.json())
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
            API_REQ = 'https://api-agents-health.onrender.com/clients/' + id;
        }
        else {
            API_REQ = 'https://api-agents-health.onrender.com/clients/';
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
            const codcli = data.codcli;
            console.log('id cliente' + codcli)
            console.log(data)
            delete data.codcli;
            console.log(data)
            const result = await fetch('https://api-agents-health.onrender.com/clients/' + codcli, {
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