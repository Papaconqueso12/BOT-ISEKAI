
module.exports = {
    name: "infobot",
    description: "Muestra información detallada del bot",

    async execute(interaction) {
        // Información del bot
        const infoBot = `
        🤖 **Información del Bot** 🤖

        **📋 Detalles Generales**
        🏷️ **Nombre:** ISEKAI Bot
        👑 **Propietario:** fadex_zuox
        🏢 **Desarrollador:** ISEKAI STUDIOS
        💻 **Desarrollado en:** Replit
        📊 **Versión:** 1.6.7.3

        **⚙️ Funcionalidades**
        ✅ Sistema de administración de roles
        ✅ Información de servidor Minecraft
        ✅ Sistema keep-alive 24/7
        ✅ Comandos interactivos con botones

        **🔧 Estado Técnico**
        🟢 **Estado:** Online y operativo
        🌐 **Plataforma:** Discord.js v14
        ⚡ **Uptime:** Monitoreado por UptimeRobot
        `;

        await interaction.reply({ content: infoBot, ephemeral: false });
    }
};
