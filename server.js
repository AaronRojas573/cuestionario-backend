const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// 🔥 Configuración de CORS para permitir Netlify
app.use(cors({
    origin: "*",  // Para pruebas, permite cualquier origen
    methods: "GET, POST, OPTIONS",
    allowedHeaders: ["Content-Type"]
}));

// 🔥 Middleware especial para manejar solicitudes OPTIONS (preflight)
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
        const { nombre, email, respuesta1, respuesta2, respuesta3 } = req.body;

        await pool.query(
            "INSERT INTO respuestas (nombre, email, respuesta1, respuesta2, respuesta3) VALUES ($1, $2, $3, $4, $5)",
            [nombre, email, respuesta1, respuesta2, respuesta3]
        );

        res.json({ message: "Respuesta guardada exitosamente" });
    } catch (error) {
        console.error("Error en PostgreSQL:", error);
        res.status(500).json({ error: "Error al guardar respuesta" });
    }
});

// 🔥 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
