import { apiRaiz } from "../api/source";

export default async function sync_PerguntasTipoFormulario(method, data, action, id) {
    const param = 'perg_forms';

    if (method === "POST") {
        try {
            const result = await fetch(apiRaiz + param + '/', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return {
                status: result.status,
                data: await result.json(),
            };
        } catch (error) {
            return error;
        }
    } 
    else if (method === "GET") {
        let API_REQ;
        if (action === "ID") {
            API_REQ = apiRaiz + param + '/' + id;
        } else {
            API_REQ = apiRaiz + param + '/';
        }
        try {
            const result = await fetch(API_REQ, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return result.json();
        } catch (error) {
            return error;
        }
    } 
    else if (method === "PUT") {
        try {
            // No seu modelo, o ID principal é 'idperg'
            const idperg = data.idperg;
            delete data.idperg; // remove o id para não enviar no body

            const result = await fetch(apiRaiz + param + '/' + idperg, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            return {
                status: result.status,
                idperg: idperg,
            };
        } catch (error) {
            return error;
        }
    }
}
