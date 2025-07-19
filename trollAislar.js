
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "trollaislar",
    description: "Aisla a un usuario del servidor",
    options: [
        {
            name: "usuario",
            type: 6, // USER
            description: "Usuario a aislar",
            required: true
        }
    ],

    async execute(interaction) {
        // Verificar si el usuario tiene el rol específico
        const rolRequerido = "1377391121021534372";
        const miembro = await interaction.guild.members.fetch(interaction.user.id);
        
        if (!miembro.roles.cache.has(rolRequerido)) {
            return interaction.reply({ 
                content: "❌ No tienes el rol necesario para usar este comando.", 
                ephemeral: true 
            });
        }

        const usuarioObjetivo = interaction.options.getUser("usuario");
        const miembroObjetivo = await interaction.guild.members.fetch(usuarioObjetivo.id);

        if (!miembroObjetivo) {
            return interaction.reply({ 
                content: "❌ No se pudo encontrar al usuario.", 
                ephemeral: true 
            });
        }

        // Crear botones de confirmación
        const botones = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`aislar_${usuarioObjetivo.id}`)
                .setLabel("🔒 Aislar 1 Semana")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`cancelar_${usuarioObjetivo.id}`)
                .setLabel("❌ Cancelar")
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            content: `⚠️ **¿Estás seguro de que quieres aislar a ${usuarioObjetivo.username} por 1 semana?**\n\nSe le asignará un rol de "Aislado" que restringe sus permisos, pero mantendrá todos sus roles originales. El aislamiento se removerá automáticamente después de 7 días.`,
            components: [botones],
            ephemeral: true
        });
    }
};
