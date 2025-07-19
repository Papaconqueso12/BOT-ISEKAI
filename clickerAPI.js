class ClickerAPI {
    // Guardar progreso del jugador
    static async guardarProgreso(username, points, playTime) {
        try {
            const key = `clicker_${username.toLowerCase()}`;
            const datosExistentes = await BotDatabase.obtenerConfiguracion(key) || {
                username: username,
                totalPoints: 0,
                totalTime: 0,
                lastSession: null,
                sessions: 0
            };

            // Actualizar datos
            datosExistentes.totalPoints += points;  // Sumar puntos por click
            datosExistentes.totalTime += playTime;  // Mantener la lógica anterior
            datosExistentes.lastSession = Date.now();
            datosExistentes.sessions += 1;

            await BotDatabase.guardarConfiguracion(key, datosExistentes);

            console.log(`🎮 Progreso guardado para ${username}: ${datosExistentes.totalPoints} puntos`);
            return { success: true, totalPoints: datosExistentes.totalPoints };
        } catch (error) {
            console.error("Error guardando progreso del clicker:", error);
            return { success: false, error: error.message };
        }
    }

    // Obtener rankings globales
    static async obtenerRankings() {
        try {
            const keys = await BotDatabase.listarClaves('clicker_');
            const jugadores = [];
            for (const key of keys) {
                if (key.startsWith('clicker_')) {
                    const datos = await BotDatabase.obtenerConfiguracion(key);
                    if (datos && datos.totalPoints > 0) {
                        jugadores.push(datos);
                    }
                }
            }

            // Ordenar por puntos totales (descendente)
            jugadores.sort((a, b) => b.totalPoints - a.totalPoints);

            // Limitar a top 50
            return jugadores.slice(0, 50);
        } catch (error) {
            console.error("Error obteniendo rankings:", error);
            return [];
        }
    }
}

module.exports = ClickerAPI;
