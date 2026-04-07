const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new sqlite3.Database("./database/database.db", (err) => {
  if (err) {
    console.error("Error al conectar con SQLite:", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/slots", (req, res) => {
  db.all(
    "SELECT * FROM available_slots WHERE is_available = 1 ORDER BY date, time",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

app.post("/reservations", (req, res) => {
  const { slot_id, customer_name, customer_email, customer_phone } = req.body;

  if (!slot_id || !customer_name || !customer_email || !customer_phone) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  db.get(
    "SELECT * FROM available_slots WHERE id = ? AND is_available = 1",
    [slot_id],
    (err, slot) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!slot) {
        return res.status(400).json({ message: "Ese turno ya no está disponible" });
      }

      db.run(
        "INSERT INTO reservations (slot_id, customer_name, customer_email, customer_phone) VALUES (?, ?, ?, ?)",
        [slot_id, customer_name, customer_email, customer_phone],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          db.run(
            "UPDATE available_slots SET is_available = 0 WHERE id = ?",
            [slot_id],
            (err) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }

              res.json({ message: "Reserva realizada con éxito" });
            }
          );
        }
      );
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});