export default async function sync_users(method, data, action, id){
    if(method == "POST"){
        try {
            const result = await fetch('https://api-agents-health.onrender.com/users/', {
                method:'POST',
                body:JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json',
                }
            });
            // console.log(result)
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
            API_REQ = 'https://api-agents-health.onrender.com/users/' + id;
        }
        else {
            API_REQ = 'https://api-agents-health.onrender.com/users/';
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
            const codusu = data.codusu;
            console.log('id cliente' + codusu)
            console.log(data)
            delete data.codusu;
            console.log(data)
            const result = await fetch('https://api-agents-health.onrender.com/users/' + codusu, {
                method:'PUT',
                body:JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json',
                }
                });
            
        
            return {
                status: result.status,
                codusu: codusu,
            }
        } catch (error) {
            return error;
        }
    }
}