const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db"); // Asegúrate de que está configurado correctamente

app.use(express.json()); // Para que el backend pueda recibir JSON
app.use(cors({
    origin: "https://harmonious-lokum-976159.netlify.app", // Netlify
    methods: "GET, POST",
    allowedHeaders: ["Content-Type"]
}));

app.post("/guardar_respuesta", async (req, res) => {
    try {
        const { nombre, email, respuesta1, respuesta2, respuesta3 } = req.body;

        if (!nombre || !email || !respuesta1 || !respuesta2 || !respuesta3) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        await pool.query(
            "INSERT INTO respuestas (nombre, email, respuesta1, respuesta2, respuesta3) VALUES ($1, $2, $3, $4, $5)",
            [nombre, email, respuesta1, respuesta2, respuesta3]
        );

        res.json({ message: "Respuesta guardada exitosamente" });
    } catch (error) {
        console.error("Error en la base de datos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
