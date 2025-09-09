import { fetchWithAuth } from "../middleware/fetchWithAuth";

export default async function sync_login(data, method){
    if(method == "POST"){
        try {
            const result = await fetchWithAuth('https://api-agents-health.onrender.com/login/', {
                method:'POST',
                body:JSON.stringify(data),
            });
            console.log(result)

            return {
                status: result.status,
                data: await result.json(),
            }
        } catch (error) {
            return error;
        }
    }
}