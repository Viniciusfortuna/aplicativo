import { fetchWithAuth } from "../middleware/fetchWithAuth";

export default async function sync_login(data, method){
    if(method == "POST"){
        try {
            const result = await fetch('https://api-agents-health.onrender.com/login/', {
                method:'POST',
                body:JSON.stringify(data),
                headers: {
                    "content-type":"application/json"
                }
            });
            console.log(result)
            console.log(result.json())
            return {
                status: result.status,
                data: await result.json(),
            }
        } catch (error) {
            return error;
        }
    }
}