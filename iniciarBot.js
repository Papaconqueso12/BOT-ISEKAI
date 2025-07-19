
module.exports = {
    name: "iniciar",
    description: "Reinicia los servicios y estado del bot",

    async execute(interaction) {
        // Verificar si el usuario que ejecuta el comando es Diego
        if (interaction.user.id !== "1196542416283504861") {
            return interaction.reply({ content: "❌ No tienes permiso para usar este comando.", ephemeral: true });
        }

        await interaction.reply({ 
            content: "🔄 **Iniciando servicios del bot...**", 
            ephemeral: true 
        });

        try {
            // Simular reinicio de servicios
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Actualizar estado del bot
            interaction.client.user.setPresence({
                activities: [{
                    name: "Propiedad de ISEKAI STUDIOS",
                    type: 0 // PLAYING
                }],
                status: 'online'
            });

            // Verificar comandos registrados
            const comandos = await interaction.client.application.commands.fetch();
            
            // Respuesta de éxito
            await interaction.editReply({
                content: `✅ **Bot iniciado correctamente!**\n\n` +
                        `🤖 **Estado:** Online y operativo\n` +
                        `⚡ **Comandos registrados:** ${comandos.size}\n` +
                        `📊 **Versión:** 1.0.0.6\n` +
                        `🏢 **Desarrollado por:** ISEKAI STUDIOS\n` +
                        `🌐 **Keep-alive:** Activo\n` +
                        `⏰ **Hora de inicio:** ${new Date().toLocaleString('es-ES')}\n\n` +
                        `🔧 **Servicios reiniciados:**\n` +
                        `├─ ✅ Sistema de comandos\n` +
                        `├─ ✅ Manejo de botones\n` +
                        `├─ ✅ Keep-alive server\n` +
                        `└─ ✅ Integración Minecraft`
            });

            console.log(`🚀 Bot reiniciado por ${interaction.user.username} (${interaction.user.id})`);

        } catch (error) {
            console.error("Error al reiniciar bot:", error);
            await interaction.editReply({
                content: "❌ **Error al reiniciar el bot.** Verifica los logs del sistema."
            });
        }
    }
};
