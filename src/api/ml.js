

import { BASE_API } from "../utils/constants";

export async function getPrediction(price, date) {
    try {
        const url = `${BASE_API}/api/ml/predict/`;  // URL del backend Django
        const params = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ price, date })
        };

        const response = await fetch(url, params);

        if (!response.ok) {
            throw new Error("Error obteniendo la predicción");
        }

        const result = await response.json();
        return result.prediction;  // Asegúrate de que la predicción esté correctamente estructurada
    } catch (error) {
        console.error("Error en getPrediction:", error);
        return null;
    }
}
