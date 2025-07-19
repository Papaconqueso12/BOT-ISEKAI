const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("¡Estoy vivo!"));
app.listen(3000, () => console.log("Servidor keep_alive activo"));
