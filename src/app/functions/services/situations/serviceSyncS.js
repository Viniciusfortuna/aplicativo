export default async function sync_situation(method, data, action, id){
    if(method == "POST"){
        try {
            const result = await fetch('https://api-agents-health.onrender.com/situations/', {
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
            API_REQ = 'https://api-agents-health.onrender.com/situations/' + id;
        }
        else {
            API_REQ = 'https://api-agents-health.onrender.com/situations/';
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
            const codsit = data.codsit;
            console.log('id cliente' + codsit)
            console.log(data)
            delete data.codsit;
            console.log(data)
            const result = await fetch('https://api-agents-health.onrender.com/situations/' + codsit, {
                method:'PUT',
                body:JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json',
                }
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