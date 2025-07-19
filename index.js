require("dotenv").config(); // Cargar variables de entorno
const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const adminRole = require("./adminRole");
const buttonHandler = require("./buttonHandler");
const mcServer = require("./mcServer");
const infoBot = require("./infoBot");
const trollAislar = require("./trollAislar");
const iniciarBot = require("./iniciarBot");
const adminSet = require("./adminSet");
const ClickerAPI = require("./clickerAPI");
const clickerCommand = require("./clickerCommand");

// Sistema de keep-alive para Replit
const app = express();
const path = require("path");

// Middleware para servir archivos estáticos
app.use(express.static('.'));

// Ruta principal del dashboard
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "dashboard.html"));
});

// Middleware para JSON
app.use(express.json());

// API para estado del bot
app.get("/api/status", (req, res) => {
    res.json({
        status: "online",
        uptime: process.uptime(),
        commands: ["admin", "mcserver", "infobot", "trollaislar", "iniciar", "admin-set", "clicker"],
        version: "1.6.7.3",
        owner: "fadex_zuox",
        developer: "ISEKAI STUDIOS"
    });
});

// Rutas del juego clicker
app.post("/api/clicker/save", async (req, res) => {
    try {
        const { username, points, playTime } = req.body;

        if (!username || points < 0 || playTime < 0) {
            return res.status(400).json({ error: "Datos inválidos" });
        }

        const resultado = await ClickerAPI.guardarProgreso(username, points, playTime);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.get("/api/clicker/rankings", async (req, res) => {
    try {
        const rankings = await ClickerAPI.obtenerRankings();
        res.json(rankings);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo rankings" });
    }
});

app.get("/api/clicker/player/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const stats = await ClickerAPI.obtenerEstadisticasJugador(username);

        if (!stats) {
            return res.status(404).json({ error: "Jugador no encontrado" });
        }

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo estadísticas" });
    }
});

// Ruta del juego clicker
app.get("/clicker", (req, res) => {
    res.sendFile(path.join(__dirname, "clickerGame.html"));
});

// Ruta keep-alive para UptimeRobot
app.get("/alive", (req, res) => res.send("¡Estoy vivo!"));

app.listen(3000, () => console.log("🌐 Dashboard disponible en puerto 3000"));

// Configuración del bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.once("ready", async () => {
    console.log(`✅ Conectado como ${client.user.tag}`);

    // Establecer status personalizado
    client.user.setPresence({
        activities: [{
            name: "Propiedad de ISEKAI STUDIOS",
            type: 0 // PLAYING
        }],
        status: 'online'
    });
    console.log("✅ Status personalizado establecido: 'Propiedad de ISEKAI STUDIOS'");

    try {
        console.log("🔄 Registrando comandos individualmente para evitar conflictos...");

        // Obtener comandos existentes
        const existingCommands = await client.application.commands.fetch();
        console.log(`📋 Comandos existentes encontrados: ${existingCommands.size}`);

        // Verificar y crear comando admin si no existe
        const adminExists = existingCommands.find(cmd => cmd.name === "admin");
        if (!adminExists) {
            await client.application.commands.create({
                name: "admin",
                description: "Asignar o quitar un rol a un usuario",
                options: [
                    {
                        name: "usuario",
                        type: 6,
                        description: "Usuario al que asignar o remover el rol",
                        required: true
                    },
                    {
                        name: "rol",
                        type: 8,
                        description: "Rol a asignar o remover",
                        required: true
                    }
                ]
            });
            console.log("✅ Comando /admin creado");
        } else {
            console.log("📝 Comando /admin ya existe");
        }

        // Verificar y crear comando mcserver si no existe
        const mcserverExists = existingCommands.find(cmd => cmd.name === "mcserver");
        if (!mcserverExists) {
            await client.application.commands.create({
                name: "mcserver",
                description: "Muestra la información del servidor de Minecraft"
            });
            console.log("✅ Comando /mcserver creado");
        } else {
            console.log("📝 Comando /mcserver ya existe");
        }

        // Verificar y crear comando infobot si no existe
        const infobotExists = existingCommands.find(cmd => cmd.name === "infobot");
        if (!infobotExists) {
            await client.application.commands.create({
                name: "infobot",
                description: "Muestra información detallada del bot"
            });
            console.log("✅ Comando /infobot creado");
        } else {
            console.log("📝 Comando /infobot ya existe");
        }

        // Verificar y crear comando trollaislar si no existe
        const trollaislarExists = existingCommands.find(cmd => cmd.name === "trollaislar");
        if (!trollaislarExists) {
            await client.application.commands.create({
                name: "trollaislar",
                description: "Aisla a un usuario del servidor",
                options: [
                    {
                        name: "usuario",
                        type: 6,
                        description: "Usuario a aislar",
                        required: true
                    }
                ]
            });
            console.log("✅ Comando /trollaislar creado");
        } else {
            console.log("📝 Comando /trollaislar ya existe");
        }

        // Verificar y crear comando iniciar si no existe
        const iniciarExists = existingCommands.find(cmd => cmd.name === "iniciar");
        if (!iniciarExists) {
            await client.application.commands.create({
                name: "iniciar",
                description: "Reinicia los servicios y estado del bot"
            });
            console.log("✅ Comando /iniciar creado");
        } else {
            console.log("📝 Comando /iniciar ya existe");
        }

        // Verificar y crear comando admin-set si no existe
        const adminSetExists = existingCommands.find(cmd => cmd.name === "admin-set");
        if (!adminSetExists) {
            await client.application.commands.create({
                name: "admin-set",
                description: "Asigna o remueve el permiso de ServerAdmin a un usuario",
                options: [
                    {
                        name: "usuario",
                        type: 6,
                        description: "Usuario al que asignar o remover ServerAdmin",
                        required: true
                    },
                    {
                        name: "accion",
                        type: 3,
                        description: "Acción a realizar",
                        required: true,
                        choices: [
                            {
                                name: "Otorgar ServerAdmin",
                                value: "otorgar"
                            },
                            {
                                name: "Remover ServerAdmin",
                                value: "remover"
                            }
                        ]
                    }
                ]
            });
            console.log("✅ Comando /admin-set creado");
        } else {
            console.log("📝 Comando /admin-set ya existe");
        }

        // Verificar y crear comando clicker si no existe
        const clickerExists = existingCommands.find(cmd => cmd.name === "clicker");
        if (!clickerExists) {
            await client.application.commands.create({
                name: "clicker",
                description: "Muestra información del juego de clicker",
                options: [
                    {
                        name: "accion",
                        type: 3,
                        description: "Acción a realizar",
                        required: false,
                        choices: [
                            {
                                name: "Rankings",
                                value: "rankings"
                            },
                            {
                                name: "Mi perfil",
                                value: "perfil"
                            },
                            {
                                name: "Jugar",
                                value: "jugar"
                            }
                        ]
                    },
                    {
                        name: "usuario",
                        type: 3,
                        description: "Nombre de usuario para ver estadísticas",
                        required: false
                    }
                ]
            });
            console.log("✅ Comando /clicker creado");
        } else {
            console.log("📝 Comando /clicker ya existe");
        }

        console.log("✅ Todos los comandos están disponibles");

    } catch (error) {
        console.error("❌ Error al registrar comandos:", error);
    }
});

// Manejo de interacciones
client.on("interactionCreate", async (interaction) => {
    try {
        if (interaction.isChatInputCommand()) {
            if (interaction.commandName === "admin") {
                await adminRole.execute(interaction);
            } else if (interaction.commandName === "mcserver") {
                await mcServer.execute(interaction);
            } else if (interaction.commandName === "infobot") {
                await infoBot.execute(interaction);
            } else if (interaction.commandName === "trollaislar") {
                await trollAislar.execute(interaction);
            } else if (interaction.commandName === "iniciar") {
                await iniciarBot.execute(interaction);
            } else if (interaction.commandName === "admin-set") {
                await adminSet.execute(interaction);
            } else if (interaction.commandName === "clicker") {
                await clickerCommand.execute(interaction);
            }
        } else if (interaction.isButton()) {
            await buttonHandler(interaction);
        } else {
            await interaction.reply({ content: "❌ Hubo un error con la interacción.", ephemeral: true });
        }
    } catch (error) {
        console.error("⚠️ Error en interacción:", error);
        if (!interaction.replied) {
            await interaction.reply({ content: "⚠️ Error interno. Inténtalo de nuevo.", ephemeral: true });
        }
    }
});

// Manejo de errores para evitar que el bot se cierre inesperadamente
client.on("error", (error) => {
    console.error("⚠️ Error detectado:", error);
});

// Detectar cuando Replit detiene el proceso y apagar el bot
process.on("SIGTERM", () => {
    console.log("🚨 Bot apagándose inmediatamente...");
    client.destroy();
    process.exit(0);
});

// Activación del bot
client.login(process.env.DISCORD_TOKEN);
