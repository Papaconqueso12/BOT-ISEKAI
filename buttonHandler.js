const BotDatabase = require("./database");

module.exports = async (interaction) => {
    if (!interaction.isButton()) return;

    const partes = interaction.customId.split("_");
    const accion = partes[0];
    const usuarioId = partes[1];

    if (accion === "otorgar" || accion === "remover") {
        const rolId = partes[2];
        const usuario = await interaction.guild.members.fetch(usuarioId);
        const rol = await interaction.guild.roles.fetch(rolId);

        if (!usuario || !rol) {
            return interaction.reply({ content: "❌ No se pudo encontrar el usuario o el rol.", flags: 64 });
        }

        if (accion === "otorgar") {
            await usuario.roles.add(rol);
            await interaction.reply({ content: `✅ Se ha otorgado el rol **${rol.name}** a **${usuario.user.username}**.` });
        } else if (accion === "remover") {
            await usuario.roles.remove(rol);
            await interaction.reply({ content: `❌ Se ha removido el rol **${rol.name}** de **${usuario.user.username}**.` });
        }
    } else if (accion === "aislar") {
        const usuario = await interaction.guild.members.fetch(usuarioId);
        
        if (!usuario) {
            return interaction.reply({ content: "❌ No se pudo encontrar al usuario.", flags: 64 });
        }

        try {
            // Buscar o crear rol de "Aislado"
            let rolAislado = interaction.guild.roles.cache.find(rol => rol.name === "🔒 Aislado");
            
            if (!rolAislado) {
                // Crear el rol de aislado si no existe
                rolAislado = await interaction.guild.roles.create({
                    name: "🔒 Aislado",
                    color: "#808080", // Color gris
                    permissions: [], // Sin permisos
                    reason: "Rol automático para aislar usuarios temporalmente"
                });
                console.log("✅ Rol 'Aislado' creado automáticamente");
            }
            
            // Asignar el rol de aislado al usuario (mantiene sus otros roles)
            await usuario.roles.add(rolAislado);
            
            // Crear objeto para guardar información del aislamiento
            const datosAislamiento = {
                usuarioId: usuario.id,
                fechaInicio: Date.now(),
                fechaFin: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 días en millisegundos
                servidorId: interaction.guild.id,
                rolAisladoId: rolAislado.id,
                usuarioNombre: usuario.user.username,
                ejecutadoPor: interaction.user.id
            };
            
            // Guardar en la base de datos
            await BotDatabase.guardarAislamiento(usuario.id, datosAislamiento);
            
            // Programar remoción automática del rol de aislado
            setTimeout(async () => {
                try {
                    const usuarioParaRestaurar = await interaction.guild.members.fetch(usuarioId);
                    const rolParaRemover = await interaction.guild.roles.fetch(rolAislado.id);
                    
                    if (usuarioParaRestaurar && rolParaRemover) {
                        await usuarioParaRestaurar.roles.remove(rolParaRemover);
                        console.log(`✅ Rol de aislado removido automáticamente para ${usuarioParaRestaurar.user.username}`);
                    }
                } catch (error) {
                    console.error("Error al remover rol de aislado automáticamente:", error);
                }
            }, 7 * 24 * 60 * 60 * 1000); // 7 días
            
            const fechaRestauracion = new Date(datosAislamiento.fechaFin);
            
            await interaction.reply({ 
                content: `🔒 **${usuario.user.username} ha sido aislado temporalmente.**\n\n` +
                        `🏷️ Rol asignado: ${rolAislado.name}\n` +
                        `📋 Sus roles originales se mantienen intactos\n` +
                        `⏰ Duración: 7 días\n` +
                        `📅 Liberación automática: ${fechaRestauracion.toLocaleDateString('es-ES')} a las ${fechaRestauracion.toLocaleTimeString('es-ES')}`,
                ephemeral: true 
            });

        } catch (error) {
            console.error("Error al aislar usuario:", error);
            await interaction.reply({ 
                content: "❌ Error al aislar al usuario. Verifica los permisos del bot.", 
                ephemeral: true 
            });
        }
    } else if (accion === "cancelar") {
        await interaction.reply({ 
            content: "❌ Acción cancelada.", 
            ephemeral: true 
        });
    }
};
