CREATE TABLE IF NOT EXISTS available_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    is_available INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slot_id INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed',
    FOREIGN KEY (slot_id) REFERENCES available_slots(id)
);


SELECT * FROM reservations;