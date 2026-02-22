const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '.'))); // Serve frontend files from root
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Prevent Caching for API routes
app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Appending timestamp to avoid duplicate names
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const cpUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 },
    { name: 'zip', maxCount: 1 }
]);

// Routes

// API to Upload Project
app.post('/api/upload', cpUpload, (req, res) => {
    const { title, description, uploader_type, phone, location } = req.body;

    // Get file paths (relative to root for storage)
    // Note: req.files is an object with arrays of files
    const imagePath = req.files['image'] ? '/uploads/' + req.files['image'][0].filename : null;
    const documentPath = req.files['document'] ? '/uploads/' + req.files['document'][0].filename : null;
    const zipPath = req.files['zip'] ? '/uploads/' + req.files['zip'][0].filename : null;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    // Default to 'client' if not provided
    const type = uploader_type || 'client';

    const query = `INSERT INTO projects (title, description, image_path, document_path, zip_path, uploader_type, phone, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [title, description, imagePath, documentPath, zipPath, type, phone, location];

    db.run(query, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: "Project uploaded successfully",
            data: { id: this.lastID, title, description, imagePath }
        });
    });
});

// API to Get All Projects
app.get('/api/projects', (req, res) => {
    const query = "SELECT * FROM projects ORDER BY created_at DESC";
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ projects: rows });
    });
});

// API to Delete Project
app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM projects WHERE id = ?";
    db.run(query, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Project deleted successfully", changes: this.changes });
    });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
