
const BotDatabase = require("./database");

module.exports = {
    name: "admin-set",
    description: "Asigna o remueve el permiso de ServerAdmin a un usuario",
    options: [
        {
            name: "usuario",
            type: 6, // USER
            description: "Usuario al que asignar o remover ServerAdmin",
            required: true
        },
        {
            name: "accion",
            type: 3, // STRING
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
    ],

    async execute(interaction) {
        // Verificar si el usuario tiene permisos de Administrador en Discord o es el propietario
        const esPropietario = interaction.user.id === "1196542416283504861";
        const tienePermisoAdmin = interaction.member.permissions.has("Administrator");

        if (!esPropietario && !tienePermisoAdmin) {
            return interaction.reply({ 
                content: "❌ **Acceso denegado.**\n\n" +
                        "🔐 **Permisos requeridos:** Administrador (Discord)\n" +
                        "📋 **Para obtener permisos:** Solicita el rol de Administrador en este servidor\n" +
                        "👑 **Alternativa:** Ser el propietario del bot (fadex_zuox)", 
                ephemeral: true 
            });
        }

        const usuario = interaction.options.getUser("usuario");
        const accion = interaction.options.getString("accion");

        if (!usuario) {
            return interaction.reply({ 
                content: "❌ Debes especificar un usuario válido.", 
                ephemeral: true 
            });
        }

        // Verificar que el usuario esté en el servidor
        const miembro = await interaction.guild.members.fetch(usuario.id).catch(() => null);
        if (!miembro) {
            return interaction.reply({ 
                content: "❌ El usuario no se encuentra en este servidor.", 
                ephemeral: true 
            });
        }

        try {
            if (accion === "otorgar") {
                // Verificar si ya es admin
                const yaEsAdmin = await BotDatabase.esServerAdmin(usuario.id, interaction.guild.id);
                if (yaEsAdmin) {
                    return interaction.reply({ 
                        content: `⚠️ **${usuario.username}** ya tiene permisos de ServerAdmin.`, 
                        ephemeral: true 
                    });
                }

                // Otorgar permisos de ServerAdmin
                await BotDatabase.establecerServerAdmin(usuario.id, interaction.guild.id, true);
                
                await interaction.reply({
                    content: `✅ **Permisos otorgados exitosamente**\n\n` +
                            `👤 **Usuario:** ${usuario.username}\n` +
                            `🔑 **Permiso:** ServerAdmin\n` +
                            `🏠 **Servidor:** ${interaction.guild.name}\n` +
                            `⚡ **Estado:** Activo\n\n` +
                            `🎯 **Nuevas capacidades:**\n` +
                            `├─ ✅ Usar comando /admin\n` +
                            `├─ ✅ Gestionar roles de usuarios\n` +
                            `└─ ✅ Acceso a funciones administrativas del bot`
                });

                console.log(`🔑 ServerAdmin otorgado a ${usuario.username} (${usuario.id}) en ${interaction.guild.name}`);

            } else if (accion === "remover") {
                // Verificar si es admin
                const esAdmin = await BotDatabase.esServerAdmin(usuario.id, interaction.guild.id);
                if (!esAdmin) {
                    return interaction.reply({ 
                        content: `⚠️ **${usuario.username}** no tiene permisos de ServerAdmin.`, 
                        ephemeral: true 
                    });
                }

                // Remover permisos de ServerAdmin
                await BotDatabase.establecerServerAdmin(usuario.id, interaction.guild.id, false);
                
                await interaction.reply({
                    content: `❌ **Permisos removidos exitosamente**\n\n` +
                            `👤 **Usuario:** ${usuario.username}\n` +
                            `🔑 **Permiso:** ServerAdmin (Removido)\n` +
                            `🏠 **Servidor:** ${interaction.guild.name}\n` +
                            `⚡ **Estado:** Inactivo\n\n` +
                            `🚫 **Capacidades removidas:**\n` +
                            `├─ ❌ Comando /admin\n` +
                            `├─ ❌ Gestión de roles\n` +
                            `└─ ❌ Funciones administrativas del bot`
                });

                console.log(`🔑 ServerAdmin removido de ${usuario.username} (${usuario.id}) en ${interaction.guild.name}`);
            }

        } catch (error) {
            console.error("Error en admin-set:", error);
            await interaction.reply({
                content: "❌ **Error interno del sistema.** Verifica los logs para más detalles.",
                ephemeral: true
            });
        }
    }
};
