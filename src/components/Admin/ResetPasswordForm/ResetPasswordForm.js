import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { sendResetPassword } from "../../../api/user"; // Asegúrate de importar tu función de la API

export function ResetPasswordForm() {
    const { uid, token } = useParams();
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirmation) {
            setMessage("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await sendResetPassword(uid, token, password);
            setMessage(response.message);  // Esto debería mostrar el mensaje de éxito
        } catch (error) {
            setMessage("Error al restablecer la contraseña.");
        }
    };

    return (
        <div>
            <h2>Restablecer Contraseña</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                />
                <button type="submit">Restablecer</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
