const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

// Middleware
app.use(cors());
app.use(express.json());
app.use("/storage", express.static(path.join(__dirname, "storage")));

// Ensure uploads directory exists
fs.ensureDirSync('uploads/images');
fs.ensureDirSync('uploads/documents');

// JSON file database setup (fallback to file-based persistence)
const DB_FILE = path.join(__dirname, 'data', 'listings.json');
fs.ensureDirSync(path.join(__dirname, 'data'));
if (!fs.existsSync(DB_FILE)) {
  fs.writeJsonSync(DB_FILE, { listings: [] });
}

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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const storageDir = path.join(__dirname, "storage");
    const uploadPath =
      file.fieldname === "images"
        ? path.join(storageDir, "uploads", "images")
        : path.join(storageDir, "uploads", "documents");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Chat proxy to OpenAI (secure, uses backend API key)
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing messages array" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res
        .status(500)
        .json({ error: "OPENAI_API_KEY not configured on server" });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content || "";
    return res.json({ reply });
  } catch (error) {
    const errPayload = error?.response?.data || {
      message: error.message || "Unknown error",
    };
    console.error("OpenAI proxy error:", errPayload);
    const payload =
      process.env.NODE_ENV === "production"
        ? { error: "Failed to get response from model" }
        : { error: "Failed to get response from model", details: errPayload };
    return res.status(500).json(payload);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "images") {
      // Accept images only
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed for property images"));
      }
    } else {
      // Accept documents (PDF, DOC, DOCX, etc.)
      const allowedMimes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
      ];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid document format"));
      }
    }
  },
});

// Routes

// Get all listings
app.get("/api/listings", (req, res) => {
  try {
    const listings = readListings();
    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// Get single listing by ID
app.get("/api/listings/:id", (req, res) => {
  try {
    console.log('Fetching listing with ID:', req.params.id);
    const listings = readListings();
    console.log('Total listings found:', listings.length);
    const listing = listings.find(l => l.id === req.params.id);
    console.log('Found listing:', listing ? 'Yes' : 'No');
    
    if (!listing) {
      console.log("Listing not found, returning 404");
      return res.status(404).json({ error: "Listing not found" });
    }

    console.log("Returning single listing with price:", listing.price);
    res.json(listing);
  } catch (error) {
    console.error("Error in /api/listings/:id:", error);
    res.status(500).json({ error: "Failed to fetch listing" });
  }
});

// Create new listing
app.post(
  "/api/listings",
  upload.fields([
    { name: "images", maxCount: 4 },
    { name: "titleDeed", maxCount: 1 },
    { name: "surveyReport", maxCount: 1 },
    { name: "taxCertificate", maxCount: 1 },
  ]),
  (req, res) => {
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
        sellerEmail,
        metadataHash,
      } = req.body;

      // Validate required fields
      if (!title || !location || !size || !price) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Process uploaded files
      const images = req.files.images
        ? req.files.images.map((file) => ({
            filename: file.filename,
            originalName: file.originalname,
            path: `/storage/uploads/images/${file.filename}`,
          }))
        : [];

      const documents = {
        titleDeed: req.files.titleDeed
          ? {
              filename: req.files.titleDeed[0].filename,
              originalName: req.files.titleDeed[0].originalname,
              path: `/storage/uploads/documents/${req.files.titleDeed[0].filename}`,
            }
          : null,
        surveyReport: req.files.surveyReport
          ? {
              filename: req.files.surveyReport[0].filename,
              originalName: req.files.surveyReport[0].originalname,
              path: `/storage/uploads/documents/${req.files.surveyReport[0].filename}`,
            }
          : null,
        taxCertificate: req.files.taxCertificate
          ? {
              filename: req.files.taxCertificate[0].filename,
              originalName: req.files.taxCertificate[0].originalname,
              path: `/storage/uploads/documents/${req.files.taxCertificate[0].filename}`,
            }
          : null,
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
        utilities: utilities ? utilities.split(",").map((u) => u.trim()) : [],
        accessibility,
        nearbyAmenities: nearbyAmenities
          ? nearbyAmenities.split(",").map((a) => a.trim())
          : [],
        images,
        documents,
        seller: {
          name: sellerName,
          phone: sellerPhone,
          email: sellerEmail,
        },
        metadataHash: metadataHash || null,
        status: "pending_verification",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
}
);

// Update listing status (for verification)
app.patch("/api/listings/:id/status", (req, res) => {
  try {
    const { status, verificationStatus } = req.body;
    const db = readDatabase();
    const idx = db.listings.findIndex(l => l.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (status) {
      db.listings[idx].status = status;
    }

    if (verificationStatus) {
      db.listings[idx].verificationStatus = {
        ...(db.listings[idx].verificationStatus || { documents: 'pending', site: 'pending', legal: 'pending' }),
        ...verificationStatus
      };
    }

    db.listings[idx].updatedAt = new Date().toISOString();
    writeDatabase(db);

    res.json({
      message: 'Listing updated successfully',
      listing: db.listings[idx]
    });
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({ error: "Failed to update listing" });
  }
});

// Delete listing
app.delete("/api/listings/:id", (req, res) => {
  try {
    const db = readDatabase();
    const idx = db.listings.findIndex(l => l.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const listing = db.listings[idx];

    // Remove associated files
    if (listing.images && listing.images.length > 0) {
      listing.images.forEach((image) => {
        const imagePath = path.join(
          __dirname,
          "storage",
          "uploads",
          "images",
          image.filename,
        );
        if (fs.existsSync(imagePath)) {
          fs.removeSync(imagePath);
        }
      });
    }

    if (listing.documents) {
      Object.values(listing.documents).forEach((doc) => {
        if (doc) {
          const docPath = path.join(
            __dirname,
            "storage",
            "uploads",
            "documents",
            doc.filename,
          );
          if (fs.existsSync(docPath)) {
            fs.removeSync(docPath);
          }
        }
      });
    }

    // Remove from database
    db.listings.splice(idx, 1);
    writeDatabase(db);

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).json({ error: "Failed to delete listing" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 10MB." });
    }
  }

  res.status(500).json({ error: error.message || "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Bima Backend Server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${path.join(__dirname, 'uploads')}`);
  console.log(`💾 Database file: ${DB_FILE}`);
});
