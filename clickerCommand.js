const ClickerAPI = require("./clickerAPI");

module.exports = {
    name: "clicker",
    description: "Juego de Clicker - da clic para ganar puntos",
    options: [
        {
            name: "accion",
            type: 3,
            description: "Acción a realizar (clic o ranking)",
            required: true,
            choices: [
                {
                    name: "Clic",
                    value: "clic"
                },
                {
                    name: "Ranking",
                    value: "ranking"
                }
            ]
        }
    ],

    async execute(interaction) {
        const accion = interaction.options.getString("accion");

        if (accion === "clic") {
            const username = interaction.user.username;
            const puntosGanados = 1;  // Cada clic otorga 1 punto
            const resultado = await ClickerAPI.guardarProgreso(username, puntosGanados, 0); // No estamos guardando tiempo en esta acción

            if (resultado.success) {
                return interaction.reply({ content: `✅ ¡Has ganado un punto! Total: ${resultado.totalPoints} puntos.` });
            } else {
                return interaction.reply({ content: "❌ Error al guardar el progreso." });
            }
        } else if (accion === "ranking") {
            const rankings = await ClickerAPI.obtenerRankings();
            let mensaje = "🏆 **Ranking de Clicker**\n\n";

            if (rankings.length === 0) {
                return interaction.reply({ content: "❌ No hay datos en el ranking." });
            }

            rankings.forEach((player, index) => {
                mensaje += `${index + 1}. ${player.username} - ${player.totalPoints.toLocaleString()} puntos\n`;
            });

            return interaction.reply({ content: mensaje });
        }
    }
};
