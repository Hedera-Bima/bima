const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
fs.ensureDirSync('uploads/images');
fs.ensureDirSync('uploads/documents');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.fieldname === 'images' ? 'uploads/images' : 'uploads/documents';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'images') {
      // Accept images only
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for property images'));
      }
    } else {
      // Accept documents (PDF, DOC, DOCX, etc.)
      const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
      ];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid document format'));
      }
    }
  }
});

// Database file path
const DB_FILE = path.join(__dirname, 'data', 'listings.json');

// Ensure data directory and file exist
fs.ensureDirSync('data');
if (!fs.existsSync(DB_FILE)) {
  fs.writeJsonSync(DB_FILE, { listings: [] });
}

// Helper functions
const readDatabase = () => {
  try {
    return fs.readJsonSync(DB_FILE);
  } catch (error) {
    return { listings: [] };
  }
};

const writeDatabase = (data) => {
  fs.writeJsonSync(DB_FILE, data, { spaces: 2 });
};

const readListings = () => {
  const db = readDatabase();
  return db.listings;
};

// Routes

// Get all listings
app.get('/api/listings', (req, res) => {
  try {
    const listings = readListings();
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Get single listing by ID
app.get('/api/listings/:id', (req, res) => {
  try {
    console.log('Fetching listing with ID:', req.params.id);
    const listings = readListings();
    console.log('Total listings found:', listings.length);
    const listing = listings.find(l => l.id === req.params.id);
    console.log('Found listing:', listing ? 'Yes' : 'No');
    
    if (!listing) {
      console.log('Listing not found, returning 404');
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    console.log('Returning single listing with price:', listing.price);
    res.json(listing);
  } catch (error) {
    console.error('Error in /api/listings/:id:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

// Create new listing
app.post('/api/listings', upload.fields([
  { name: 'images', maxCount: 4 },
  { name: 'titleDeed', maxCount: 1 },
  { name: 'surveyReport', maxCount: 1 },
  { name: 'taxCertificate', maxCount: 1 }
]), (req, res) => {
  try {
    const {
      title,
      location,
      size,
      price,
      description,
      landType,
      zoning,
      utilities,
      accessibility,
      nearbyAmenities,
      sellerName,
      sellerPhone,
      sellerEmail
    } = req.body;

    // Validate required fields
    if (!title || !location || !size || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Process uploaded files
    const images = req.files.images ? req.files.images.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: `/uploads/images/${file.filename}`
    })) : [];

    const documents = {
      titleDeed: req.files.titleDeed ? {
        filename: req.files.titleDeed[0].filename,
        originalName: req.files.titleDeed[0].originalname,
        path: `/uploads/documents/${req.files.titleDeed[0].filename}`
      } : null,
      surveyReport: req.files.surveyReport ? {
        filename: req.files.surveyReport[0].filename,
        originalName: req.files.surveyReport[0].originalname,
        path: `/uploads/documents/${req.files.surveyReport[0].filename}`
      } : null,
      taxCertificate: req.files.taxCertificate ? {
        filename: req.files.taxCertificate[0].filename,
        originalName: req.files.taxCertificate[0].originalname,
        path: `/uploads/documents/${req.files.taxCertificate[0].filename}`
      } : null
    };

    // Create new listing
    const newListing = {
      id: uuidv4(),
      title,
      location,
      size,
      price: parseFloat(price),
      description,
      landType,
      zoning,
      utilities: utilities ? utilities.split(',').map(u => u.trim()) : [],
      accessibility,
      nearbyAmenities: nearbyAmenities ? nearbyAmenities.split(',').map(a => a.trim()) : [],
      images,
      documents,
      seller: {
        name: sellerName,
        phone: sellerPhone,
        email: sellerEmail
      },
      status: 'pending_verification',
      verificationStatus: {
        documents: 'pending',
        site: 'pending',
        legal: 'pending'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to database
    const db = readDatabase();
    db.listings.push(newListing);
    writeDatabase(db);

    res.status(201).json({
      message: 'Listing created successfully',
      listing: newListing
    });

  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Update listing status (for verification)
app.patch('/api/listings/:id/status', (req, res) => {
  try {
    const { status, verificationStatus } = req.body;
    const db = readDatabase();
    const listingIndex = db.listings.findIndex(l => l.id === req.params.id);
    
    if (listingIndex === -1) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    if (status) {
      db.listings[listingIndex].status = status;
    }
    
    if (verificationStatus) {
      db.listings[listingIndex].verificationStatus = {
        ...db.listings[listingIndex].verificationStatus,
        ...verificationStatus
      };
    }
    
    db.listings[listingIndex].updatedAt = new Date().toISOString();
    writeDatabase(db);
    
    res.json({
      message: 'Listing updated successfully',
      listing: db.listings[listingIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// Delete listing
app.delete('/api/listings/:id', (req, res) => {
  try {
    const db = readDatabase();
    const listingIndex = db.listings.findIndex(l => l.id === req.params.id);
    
    if (listingIndex === -1) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    // Remove associated files
    const listing = db.listings[listingIndex];
    
    // Remove images
    listing.images.forEach(image => {
      const imagePath = path.join(__dirname, 'uploads/images', image.filename);
      fs.removeSync(imagePath);
    });
    
    // Remove documents
    Object.values(listing.documents).forEach(doc => {
      if (doc) {
        const docPath = path.join(__dirname, 'uploads/documents', doc.filename);
        fs.removeSync(docPath);
      }
    });
    
    // Remove from database
    db.listings.splice(listingIndex, 1);
    writeDatabase(db);
    
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  res.status(500).json({ error: error.message || 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Bima Backend Server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${path.join(__dirname, 'uploads')}`);
  console.log(`💾 Database file: ${DB_FILE}`);
});
