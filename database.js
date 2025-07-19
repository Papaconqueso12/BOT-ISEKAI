// Sistema de base de datos para ISEKAI Bot
const Database = require('@replit/database');
const db = new Database();

class BotDatabase {
    // Guardar datos de aislamiento
    static async guardarAislamiento(usuarioId, datos) {
        const key = `aislamiento_${usuarioId}`;
        await db.set(key, {
            ...datos,
            fechaCreacion: Date.now()
        });
        console.log(`💾 Aislamiento guardado para usuario ${usuarioId}`);
    }

    // Obtener datos de aislamiento
    static async obtenerAislamiento(usuarioId) {
        const key = `aislamiento_${usuarioId}`;
        try {
            return await db.get(key);
        } catch (error) {
            return null;
        }
    }

    // Eliminar datos de aislamiento
    static async eliminarAislamiento(usuarioId) {
        const key = `aislamiento_${usuarioId}`;
        await db.delete(key);
        console.log(`🗑️ Aislamiento eliminado para usuario ${usuarioId}`);
    }

    // Guardar configuración del bot
    static async guardarConfiguracion(clave, valor) {
        await db.set(`config_${clave}`, valor);
    }

    // Obtener configuración del bot
    static async obtenerConfiguracion(clave) {
        try {
            return await db.get(`config_${clave}`);
        } catch (error) {
            return null;
        }
    }

    // Guardar estadísticas de uso
    static async guardarEstadistica(comando, usuarioId) {
        const key = `stats_${comando}`;
        const stats = await this.obtenerEstadistica(comando) || { total: 0, usuarios: {} };

        stats.total++;
        stats.usuarios[usuarioId] = (stats.usuarios[usuarioId] || 0) + 1;
        stats.ultimoUso = Date.now();

        await db.set(key, stats);
    }

    // Obtener estadísticas
    static async obtenerEstadistica(comando) {
        try {
            return await db.get(`stats_${comando}`);
        } catch (error) {
            return null;
        }
    }

    // Listar todas las claves con un prefijo
    static async listarClaves(prefijo) {
        try {
            return await db.list(prefijo);
        } catch (error) {
            return [];
        }
    }

    // Limpiar datos antiguos (aislamientos expirados)
    static async limpiarDatosAntiguos() {
        const aislamientos = await this.listarClaves('aislamiento_');
        let eliminados = 0;

        for (const key of aislamientos) {
            const datos = await db.get(key);
            if (datos && datos.fechaFin && Date.now() > datos.fechaFin) {
                await db.delete(key);
                eliminados++;
            }
        }

        console.log(`🧹 Limpieza completada: ${eliminados} registros eliminados`);
        return eliminados;
    }

    // Método para establecer ServerAdmin
    static async establecerServerAdmin(usuarioId, servidorId, esAdmin) {
        const key = `serveradmin_${usuarioId}_${servidorId}`;
        if (esAdmin) {
            await db.set(key, {
                usuarioId: usuarioId,
                servidorId: servidorId,
                fechaOtorgado: Date.now(),
                estado: "activo"
            });
        } else {
            await db.delete(key);
        }
        console.log(`🔑 ServerAdmin ${esAdmin ? 'otorgado' : 'removido'} para usuario ${usuarioId} en servidor ${servidorId}`);
    }

    // Método para verificar si es ServerAdmin
    static async esServerAdmin(usuarioId, servidorId) {
        const key = `serveradmin_${usuarioId}_${servidorId}`;
        try {
            const datos = await db.get(key);
            return datos && datos.estado === "activo";
        } catch (error) {
            return false;
        }
    }

    // Método para obtener todos los ServerAdmins de un servidor
    static async obtenerServerAdmins(servidorId) {
        try {
            const keys = await db.list();
            const adminKeys = keys.filter(key => key.startsWith(`serveradmin_`) && key.endsWith(`_${servidorId}`));
            const admins = [];

            for (const key of adminKeys) {
                const datos = await db.get(key);
                if (datos && datos.estado === "activo") {
                    admins.push(datos);
                }
            }

            return admins;
        } catch (error) {
            return [];
        }
    }
}

module.exports = BotDatabase;
