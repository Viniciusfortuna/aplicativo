import { fetchWithAuth } from "../middleware/fetchWithAuth";

export default async function sync_login(data, method) {
    if (method === "POST") {
        try {
            const result = await fetch('https://api-agents-health.onrender.com/login/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const json = await result.json(); // só chama uma vez

            console.log('esse é o result');
            console.log(json);

            return {
                status: result.status,
                data: json,
            };
        } catch (error) {
            console.error("Erro no fetch:", error);
            return { status: 500, error };
        }
    }
}
