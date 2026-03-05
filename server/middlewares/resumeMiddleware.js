const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure resume upload directory exists
const resumeDir = path.join(__dirname, '../../client/public/uploads/resumes');
if (!fs.existsSync(resumeDir)) {
    fs.mkdirSync(resumeDir, { recursive: true });
}

// Storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, resumeDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Check file type (PDF only for resumes)
function checkFileType(file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: PDFs Only!');
    }
}

// Init upload
const uploadResume = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = uploadResume;
