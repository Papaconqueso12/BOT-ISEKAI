
const BotDatabase = require("./database");

module.exports = {
    name: "estadisticas",
    description: "Muestra estadísticas de uso del bot",

    async execute(interaction) {
        // Solo Diego puede ver estadísticas
        if (interaction.user.id !== "1196542416283504861") {
            return interaction.reply({ content: "❌ No tienes permiso para usar este comando.", ephemeral: true });
        }

        try {
            // Obtener estadísticas de comandos
            const statsAdmin = await BotDatabase.obtenerEstadistica("admin") || { total: 0 };
            const statsTroll = await BotDatabase.obtenerEstadistica("trollaislar") || { total: 0 };
            const statsMC = await BotDatabase.obtenerEstadistica("mcserver") || { total: 0 };
            const statsInfo = await BotDatabase.obtenerEstadistica("infobot") || { total: 0 };

            // Obtener aislamientos activos
            const aislamientosActivos = await BotDatabase.listarClaves("aislamiento_");
            
            const estadisticas = `📊 **Estadísticas del Bot - ISEKAI**\n\n` +
                               `**📋 Uso de Comandos:**\n` +
                               `├─ /admin: ${statsAdmin.total} usos\n` +
                               `├─ /trollaislar: ${statsTroll.total} usos\n` +
                               `├─ /mcserver: ${statsMC.total} usos\n` +
                               `└─ /infobot: ${statsInfo.total} usos\n\n` +
                               `**🔒 Sistema de Aislamiento:**\n` +
                               `├─ Usuarios aislados: ${aislamientosActivos.length}\n` +
                               `└─ Limpieza automática: Activa\n\n` +
                               `**💾 Base de Datos:**\n` +
                               `├─ Sistema: Replit Key-Value Store\n` +
                               `├─ Estado: Operativo\n` +
                               `└─ Persistencia: 24/7`;

            await interaction.reply({ content: estadisticas, ephemeral: true });

        } catch (error) {
            console.error("Error al obtener estadísticas:", error);
            await interaction.reply({ 
                content: "❌ Error al obtener estadísticas de la base de datos.", 
                ephemeral: true 
            });
        }
    }
};
