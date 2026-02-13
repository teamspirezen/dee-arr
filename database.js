const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use a file-based database. 
// Hostinger VPS/Shared: Ensure this path is writable. 
// Standard pattern: 'database.sqlite' in the root.
const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create table
        db.run(`CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            image_path TEXT,
            document_path TEXT,
            zip_path TEXT,
            uploader_type TEXT DEFAULT 'client',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error("Error creating table: " + err.message);
            } else {
                // Migration for existing tables
                const migrationQuery = "ALTER TABLE projects ADD COLUMN uploader_type TEXT DEFAULT 'client'";
                db.run(migrationQuery, (err) => {
                    if (err && !err.message.includes('duplicate column name')) {
                        console.error("Migration Warning (Safe to ignore if column exists): " + err.message);
                    } else {
                        console.log("Database schema checked/updated.");
                    }
                });
            }
        });
    }
});

module.exports = db;
