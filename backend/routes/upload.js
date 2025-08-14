const express = require('express');
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const { auth, merchant } = require('../middleware/auth');

const router = express.Router();

// Upload multiple product images
router.post('/product-images', auth, merchant, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const imageUrls = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      message: 'Images uploaded successfully',
      images: imageUrls
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Upload business profile photo
router.post('/business-photo', auth, merchant, (req, res) => {
  upload.single('businessPhoto')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
      } else if (err.message) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: 'Upload failed' });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const imageData = {
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      };

      res.json({
        message: 'Business photo uploaded successfully',
        image: imageData
      });

    } catch (error) {
      console.error('Business photo upload error:', error);
      res.status(500).json({ message: 'Upload failed', error: error.message });
    }
  });
});

// Upload organic certificate
router.post('/organic-certificate', auth, merchant, (req, res) => {
  upload.single('certificate')(req, res, (err) => {
    if (err) {
      console.error('Organic certificate upload error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
      } else if (err.message) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: 'Upload failed' });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const certificateData = {
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      };

      res.json({
        message: 'Organic certificate uploaded successfully',
        url: certificateData.url,
        filename: certificateData.filename,
        certificate: certificateData
      });

    } catch (error) {
      console.error('Organic certificate upload error:', error);
      res.status(500).json({ message: 'Upload failed', error: error.message });
    }
  });
});

// Delete an uploaded image
router.delete('/image/:filename', auth, merchant, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

module.exports = router;