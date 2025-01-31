const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// 🔥 Configuración correcta de CORS
app.use(cors({
    origin: "https://harmonious-lokum-976159.netlify.app",  // Asegúrate de que esta URL es la correcta de Netlify
    methods: "GET, POST, OPTIONS",
    allowedHeaders: ["Content-Type"]
}));

// 🔥 Middleware especial para manejar solicitudes preflight (OPTIONS)
app.options("*", cors());

app.use(bodyParser.json());

// 🔥 Configuración de PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// 🔥 Ruta para guardar respuestas
app.post("/guardar_respuesta", async (req, res) => {
    try {
        console.log("Datos recibidos:", req.body);  // 👀 Verificar qué datos llegan al backend

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
        console.error("Error en PostgreSQL:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔥 Iniciar servidor en Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
