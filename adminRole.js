const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const BotDatabase = require("./database");

module.exports = {
    name: "admin",
    description: "Asignar o quitar un rol a un usuario",
    options: [
        {
            name: "usuario",
            type: 6, // USER
            description: "Usuario al que asignar o remover el rol",
            required: true
        },
        {
            name: "rol",
            type: 8, // ROLE
            description: "Rol a asignar o remover",
            required: true
        }
    ],

    async execute(interaction) {
        // Verificar si el usuario es Diego (propietario) o tiene permisos de ServerAdmin
        const esPropietario = interaction.user.id === "1196542416283504861";
        const esServerAdmin = await BotDatabase.esServerAdmin(interaction.user.id, interaction.guild.id);

        if (!esPropietario && !esServerAdmin) {
            return interaction.reply({ 
                content: "❌ **Acceso denegado.**\n\n" +
                        "🔐 **Permisos requeridos:** ServerAdmin\n" +
                        "📋 **Para obtener permisos:** Contacta al propietario del bot\n" +
                        "👑 **Propietario:** fadex_zuox", 
                ephemeral: true 
            });
        }

        const usuario = interaction.options.getUser("usuario");
        const rol = interaction.options.getRole("rol");

        if (!usuario || !rol) {
            return interaction.reply({ content: "❌ Debes especificar un usuario y un rol.", flags: 64 });
        }

        // Crear botones para otorgar o remover el rol
        const botones = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`otorgar_${usuario.id}_${rol.id}`)
                .setLabel("Otorgar")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`remover_${usuario.id}_${rol.id}`)
                .setLabel("Remover")
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({
            content: `¿Qué quieres hacer con el rol **${rol.name}** para **${usuario.username}**?`,
            components: [botones]
        });
    }
};
