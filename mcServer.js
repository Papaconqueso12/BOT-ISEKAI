module.exports = {
    name: "mcserver",
    description: "Muestra la información del servidor de Minecraft",

    async execute(interaction) {
        // Información del servidor
        const infoServidor = `
        🌍 **Minecraft Server Info** 🌍

        **Java Edition**  
        🖥️ IP: \`KINDOMOFINK.aternos.me:25362\`

        **Bedrock Edition**  
        📱 IP: \`KINDOMOFINK.aternos.me\`  
        🔌 Puerto: \`25362\`

        **Versiones y Disponibilidad**  
        ✅ Bedrock: Si (GeyserMC) v1.21.80  
        ✅ Java: Si (Paper) 1.21.5 Release
        `;

        await interaction.reply({ content: infoServidor, ephemeral: false });
    }
};
