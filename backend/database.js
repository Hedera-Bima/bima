const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs-extra");

// Ensure storage directory exists
const storageDir = path.join(__dirname, "storage");
fs.ensureDirSync(storageDir);

// Ensure data subdirectory exists
const dataDir = path.join(storageDir, "data");
fs.ensureDirSync(dataDir);

// Initialize SQLite database
const dbPath = path.join(dataDir, "bima.db");
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Create tables
const initDatabase = () => {
  // Listings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS listings (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      size TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      landType TEXT,
      zoning TEXT,
      accessibility TEXT,
      metadataHash TEXT,
      status TEXT DEFAULT 'pending_verification',
      sellerName TEXT,
      sellerPhone TEXT,
      sellerEmail TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  // Images table
  db.exec(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listingId TEXT NOT NULL,
      filename TEXT NOT NULL,
      originalName TEXT NOT NULL,
      path TEXT NOT NULL,
      FOREIGN KEY (listingId) REFERENCES listings(id) ON DELETE CASCADE
    )
  `);

  // Documents table
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listingId TEXT NOT NULL,
      type TEXT NOT NULL,
      filename TEXT NOT NULL,
      originalName TEXT NOT NULL,
      path TEXT NOT NULL,
      FOREIGN KEY (listingId) REFERENCES listings(id) ON DELETE CASCADE
    )
  `);

  // Utilities table (many-to-many)
  db.exec(`
    CREATE TABLE IF NOT EXISTS utilities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listingId TEXT NOT NULL,
      utility TEXT NOT NULL,
      FOREIGN KEY (listingId) REFERENCES listings(id) ON DELETE CASCADE
    )
  `);

  // Amenities table (many-to-many)
  db.exec(`
    CREATE TABLE IF NOT EXISTS amenities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listingId TEXT NOT NULL,
      amenity TEXT NOT NULL,
      FOREIGN KEY (listingId) REFERENCES listings(id) ON DELETE CASCADE
    )
  `);

  // Verification status table
  db.exec(`
    CREATE TABLE IF NOT EXISTS verification_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listingId TEXT NOT NULL UNIQUE,
      documents TEXT DEFAULT 'pending',
      site TEXT DEFAULT 'pending',
      legal TEXT DEFAULT 'pending',
      FOREIGN KEY (listingId) REFERENCES listings(id) ON DELETE CASCADE
    )
  `);

  console.log("✅ Database tables initialized");
};

// Initialize database on startup
initDatabase();

// Helper functions for database operations
const dbHelpers = {
  // Get all listings with related data
  getAllListings: () => {
    const listings = db
      .prepare("SELECT * FROM listings ORDER BY createdAt DESC")
      .all();

    return listings.map((listing) => {
      const images = db
        .prepare("SELECT * FROM images WHERE listingId = ?")
        .all(listing.id);
      const documents = db
        .prepare("SELECT * FROM documents WHERE listingId = ?")
        .all(listing.id);
      const utilities = db
        .prepare("SELECT utility FROM utilities WHERE listingId = ?")
        .all(listing.id);
      const amenities = db
        .prepare("SELECT amenity FROM amenities WHERE listingId = ?")
        .all(listing.id);
      const verificationStatus = db
        .prepare("SELECT * FROM verification_status WHERE listingId = ?")
        .get(listing.id);

      return {
        ...listing,
        images,
        documents: {
          titleDeed: documents.find((d) => d.type === "titleDeed") || null,
          surveyReport:
            documents.find((d) => d.type === "surveyReport") || null,
          taxCertificate:
            documents.find((d) => d.type === "taxCertificate") || null,
        },
        utilities: utilities.map((u) => u.utility),
        nearbyAmenities: amenities.map((a) => a.amenity),
        seller: {
          name: listing.sellerName,
          phone: listing.sellerPhone,
          email: listing.sellerEmail,
        },
        verificationStatus: verificationStatus
          ? {
              documents: verificationStatus.documents,
              site: verificationStatus.site,
              legal: verificationStatus.legal,
            }
          : { documents: "pending", site: "pending", legal: "pending" },
      };
    });
  },

  // Get single listing by ID
  getListingById: (id) => {
    const listing = db.prepare("SELECT * FROM listings WHERE id = ?").get(id);

    if (!listing) return null;

    const images = db
      .prepare("SELECT * FROM images WHERE listingId = ?")
      .all(id);
    const documents = db
      .prepare("SELECT * FROM documents WHERE listingId = ?")
      .all(id);
    const utilities = db
      .prepare("SELECT utility FROM utilities WHERE listingId = ?")
      .all(id);
    const amenities = db
      .prepare("SELECT amenity FROM amenities WHERE listingId = ?")
      .all(id);
    const verificationStatus = db
      .prepare("SELECT * FROM verification_status WHERE listingId = ?")
      .get(id);

    return {
      ...listing,
      images,
      documents: {
        titleDeed: documents.find((d) => d.type === "titleDeed") || null,
        surveyReport: documents.find((d) => d.type === "surveyReport") || null,
        taxCertificate:
          documents.find((d) => d.type === "taxCertificate") || null,
      },
      utilities: utilities.map((u) => u.utility),
      nearbyAmenities: amenities.map((a) => a.amenity),
      seller: {
        name: listing.sellerName,
        phone: listing.sellerPhone,
        email: listing.sellerEmail,
      },
      verificationStatus: verificationStatus
        ? {
            documents: verificationStatus.documents,
            site: verificationStatus.site,
            legal: verificationStatus.legal,
          }
        : { documents: "pending", site: "pending", legal: "pending" },
    };
  },

  // Create new listing
  createListing: (listingData) => {
    const transaction = db.transaction(() => {
      // Insert listing
      const insertListing = db.prepare(`
        INSERT INTO listings (
          id, title, location, size, price, description, landType, zoning,
          accessibility, metadataHash, status, sellerName, sellerPhone,
          sellerEmail, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertListing.run(
        listingData.id,
        listingData.title,
        listingData.location,
        listingData.size,
        listingData.price,
        listingData.description,
        listingData.landType,
        listingData.zoning,
        listingData.accessibility,
        listingData.metadataHash,
        listingData.status,
        listingData.seller.name,
        listingData.seller.phone,
        listingData.seller.email,
        listingData.createdAt,
        listingData.updatedAt,
      );

      // Insert images
      if (listingData.images && listingData.images.length > 0) {
        const insertImage = db.prepare(
          "INSERT INTO images (listingId, filename, originalName, path) VALUES (?, ?, ?, ?)",
        );
        listingData.images.forEach((image) => {
          insertImage.run(
            listingData.id,
            image.filename,
            image.originalName,
            image.path,
          );
        });
      }

      // Insert documents
      if (listingData.documents) {
        const insertDoc = db.prepare(
          "INSERT INTO documents (listingId, type, filename, originalName, path) VALUES (?, ?, ?, ?, ?)",
        );
        Object.entries(listingData.documents).forEach(([type, doc]) => {
          if (doc) {
            insertDoc.run(
              listingData.id,
              type,
              doc.filename,
              doc.originalName,
              doc.path,
            );
          }
        });
      }

      // Insert utilities
      if (listingData.utilities && listingData.utilities.length > 0) {
        const insertUtility = db.prepare(
          "INSERT INTO utilities (listingId, utility) VALUES (?, ?)",
        );
        listingData.utilities.forEach((utility) => {
          insertUtility.run(listingData.id, utility);
        });
      }

      // Insert amenities
      if (
        listingData.nearbyAmenities &&
        listingData.nearbyAmenities.length > 0
      ) {
        const insertAmenity = db.prepare(
          "INSERT INTO amenities (listingId, amenity) VALUES (?, ?)",
        );
        listingData.nearbyAmenities.forEach((amenity) => {
          insertAmenity.run(listingData.id, amenity);
        });
      }

      // Insert verification status
      db.prepare("INSERT INTO verification_status (listingId) VALUES (?)").run(
        listingData.id,
      );
    });

    transaction();
    return dbHelpers.getListingById(listingData.id);
  },

  // Update listing status
  updateListingStatus: (id, statusData) => {
    const transaction = db.transaction(() => {
      if (statusData.status) {
        db.prepare(
          "UPDATE listings SET status = ?, updatedAt = ? WHERE id = ?",
        ).run(statusData.status, new Date().toISOString(), id);
      }

      if (statusData.verificationStatus) {
        const updates = [];
        const values = [];

        if (statusData.verificationStatus.documents) {
          updates.push("documents = ?");
          values.push(statusData.verificationStatus.documents);
        }
        if (statusData.verificationStatus.site) {
          updates.push("site = ?");
          values.push(statusData.verificationStatus.site);
        }
        if (statusData.verificationStatus.legal) {
          updates.push("legal = ?");
          values.push(statusData.verificationStatus.legal);
        }

        if (updates.length > 0) {
          values.push(id);
          db.prepare(
            `UPDATE verification_status SET ${updates.join(", ")} WHERE listingId = ?`,
          ).run(...values);
        }
      }
    });

    transaction();
    return dbHelpers.getListingById(id);
  },

  // Delete listing
  deleteListing: (id) => {
    const listing = dbHelpers.getListingById(id);
    if (!listing) return null;

    db.prepare("DELETE FROM listings WHERE id = ?").run(id);
    return listing;
  },
};

module.exports = { db, dbHelpers };
