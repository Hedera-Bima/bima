import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Shield, 
  CheckCircle2, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  Star,
  FileText,
  Download,
  Eye,
  Wallet,
  Heart,
  Share2,
  Phone,
  Mail,
  Navigation,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface LandDetailsProps {
  landId: string;
}

interface PropertyImage {
  id: string;
  url: string;
  title: string;
  description?: string;
}

interface Document {
  id: string;
  name: string;
  type: 'title-deed' | 'survey' | 'certificate' | 'inspection';
  verified: boolean;
  uploadDate: string;
  size: string;
}

interface InspectionReport {
  id: string;
  inspectorName: string;
  rating: number;
  date: string;
  summary: string;
  verified: boolean;
}

const LandDetails: React.FC<LandDetailsProps> = ({ landId }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'location' | 'documents' | 'history'>('overview');
  const [isLiked, setIsLiked] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch property data from backend
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        console.log('Fetching listing with ID:', landId);
        const response = await fetch(`http://localhost:5000/api/listings/${landId}`);
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched listing data:', data);
          
          // Handle both array and object responses
          let listing;
          if (Array.isArray(data)) {
            // If it's an array, find the listing with matching ID
            listing = data.find(item => item.id === landId) || data[0];
            console.log('Found matching listing in array:', listing ? 'Yes' : 'No (using first item)');
          } else {
            listing = data;
          }
          console.log('Processed listing:', listing);
          console.log('Price value:', listing?.price, 'Type:', typeof listing?.price);
          
          // Ensure price is properly formatted
          let formattedPrice = "0";
          if (listing && listing.price) {
            if (typeof listing.price === 'number') {
              formattedPrice = listing.price.toLocaleString();
            } else if (typeof listing.price === 'string' && listing.price !== '') {
              // If it's already a formatted string, use it
              formattedPrice = listing.price;
            }
          }
          console.log('Formatted price:', formattedPrice);
          
          // Transform backend data to match component expectations
          setProperty({
            id: listing?.id || landId,
            title: listing?.title || "Property Title",
            location: listing?.location || "Location",
            coordinates: { lat: -1.1719, lng: 36.8315 }, // Default coordinates
            price: formattedPrice,
            currency: "KES",
            area: listing?.size || "N/A",
            description: listing?.description || "No description available",
            features: [
              listing?.landType && `Land Type: ${listing.landType}`,
              listing?.zoning && `Zoning: ${listing.zoning}`,
              listing?.utilities && `Utilities: ${listing.utilities}`,
              listing?.accessibility && `Road Access: ${listing.accessibility}`,
              listing?.nearbyAmenities && `Nearby Amenities: ${listing.nearbyAmenities}`
            ].filter(Boolean),
            ownerDID: "did:hedera:testnet:z9KmF47C1xvVk2D8nQw3...",
            ownerName: listing?.seller?.name || "Property Owner",
            ownerContact: {
              phone: listing?.seller?.phone || "Contact via platform",
              email: listing?.seller?.email || "Contact via platform"
            },
            verificationStatus: listing?.status === 'verified' ? 'verified' : listing?.status === 'pending_verification' ? 'pending' : 'unverified',
            listedDate: listing?.createdAt ? new Date(listing.createdAt).toLocaleDateString() : "N/A",
            lastUpdated: listing?.updatedAt ? new Date(listing.updatedAt).toLocaleDateString() : listing?.createdAt ? new Date(listing.createdAt).toLocaleDateString() : "N/A",
            views: Math.floor(Math.random() * 500) + 50, // Mock views
            inspections: Math.floor(Math.random() * 20) + 1, // Mock inspections
            images: listing?.images || [],
            documents: listing?.documents || []
          });
        } else {
          console.log('Listing not found in backend, using dummy data for landId:', landId);
          console.log('Response status:', response.status);
          console.log('Response body:', await response.text());
          // Fallback to dummy data if listing not found in backend - match dummy listing prices
          const dummyData = {
            "1": { price: "45,000,000", title: "Premium Land in Karen", location: "Nairobi, Karen", area: "2.5 acres" },
            "2": { price: "78,500,000", title: "Agricultural Land in Limuru", location: "Kiambu, Limuru", area: "5.0 acres" },
            "3": { price: "120,000,000", title: "Commercial Land in Konza", location: "Machakos, Konza", area: "10.0 acres" },
            "4": { price: "95,000,000", title: "Residential Land in Elementaita", location: "Nakuru, Elementaita", area: "7.5 acres" }
          };
          
          const dummy = dummyData[landId as keyof typeof dummyData] || dummyData["1"];
          
          setProperty({
            id: landId,
            title: dummy.title,
            location: dummy.location,
            coordinates: { lat: -1.1719, lng: 36.8315 },
            price: dummy.price,
            currency: "KES",
            area: dummy.area,
            description: "Exceptional agricultural land with fertile soil, perfect for farming or development. Located in the heart of Kenya with excellent accessibility and infrastructure.",
            features: [
              "Fertile red soil perfect for agriculture",
              "Access to clean water supply",
              "Electricity connection available",
              "All-weather road access",
              "Fenced perimeter",
              "Clear title deed"
            ],
            ownerDID: "did:hedera:testnet:z9KmF47C1xvVk2D8nQw3...",
            ownerName: "John Kamau",
            ownerContact: {
              phone: "+254 712 345 678",
              email: "john.kamau@email.com"
            },
            verificationStatus: "verified" as const,
            listedDate: "2024-01-15",
            lastUpdated: "2024-01-20",
            views: 234,
            inspections: 12,
            images: [],
            documents: []
          });
        }
      } catch (err) {
        console.error('Failed to fetch property:', err);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [landId]);

  // Transform backend images or use fallback
  const images: PropertyImage[] = property?.images?.length > 0 
    ? property.images.map((img: any, index: number) => ({
        id: index.toString(),
        url: `http://localhost:5000${img.path}`,
        title: `Property Image ${index + 1}`,
        description: `Property view ${index + 1}`
      }))
    : [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
          title: "Main View",
          description: "Overview of the entire property"
        },
        {
          id: "2", 
          url: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deae?w=800&h=600&fit=crop",
          title: "Soil Quality",
          description: "Rich, fertile soil perfect for agriculture"
        },
        {
          id: "3",
          url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop", 
          title: "Access Road",
          description: "Well-maintained access road"
        },
        {
          id: "4",
          url: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&h=600&fit=crop",
          title: "Boundary View",
          description: "Clear property boundaries"
        }
      ];

  // Transform backend documents or use fallback
  const documents: Document[] = property?.documents?.length > 0
    ? [
        property.documents.titleDeed && {
          id: "1",
          name: "Title Deed Certificate",
          type: "title-deed" as const,
          verified: true,
          uploadDate: new Date().toLocaleDateString(),
          size: "2.4 MB"
        },
        property.documents.surveyReport && {
          id: "2",
          name: "Survey Report",
          type: "survey" as const,
          verified: true,
          uploadDate: new Date().toLocaleDateString(),
          size: "5.1 MB"
        },
        property.documents.taxCertificate && {
          id: "3",
          name: "Tax Certificate",
          type: "certificate" as const,
          verified: true,
          uploadDate: new Date().toLocaleDateString(),
          size: "1.2 MB"
        }
      ].filter(Boolean)
    : [
        {
          id: "1",
          name: "Title Deed Certificate",
          type: "title-deed",
          verified: true,
          uploadDate: "2024-01-10",
          size: "2.4 MB"
        },
        {
          id: "2", 
          name: "Survey Report 2024",
          type: "survey",
          verified: true,
          uploadDate: "2024-01-12",
          size: "5.1 MB"
        },
        {
          id: "3",
          name: "Tax Compliance Certificate",
          type: "certificate", 
          verified: true,
          uploadDate: "2024-01-08",
          size: "1.2 MB"
        },
        {
          id: "4",
          name: "Professional Inspection Report",
          type: "inspection",
          verified: true,
          uploadDate: "2024-01-18",
          size: "3.7 MB"
        }
      ];

  const inspectionReports: InspectionReport[] = [
    {
      id: "1",
      inspectorName: "Sarah Mwangi",
      rating: 4.8,
      date: "2024-01-18",
      summary: "Excellent soil quality and infrastructure. Highly recommended for agricultural use.",
      verified: true
    },
    {
      id: "2",
      inspectorName: "David Ochieng", 
      rating: 4.6,
      date: "2024-01-15",
      summary: "Good accessibility and clear boundaries. Minor drainage improvements recommended.",
      verified: true
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'title-deed': return FileText;
      case 'survey': return Navigation;
      case 'certificate': return Shield;
      case 'inspection': return Eye;
      default: return FileText;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/marketplace" className="text-primary hover:underline">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Property not found</p>
          <Link to="/marketplace" className="text-primary hover:underline">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/marketplace" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Marketplace</span>
            </Link>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setIsLiked(!isLiked)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-colors ${
                  isLiked ? 'bg-red-500/20 text-red-500' : 'bg-card/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-card/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-card">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex].url}
                    alt={images[currentImageIndex].title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>

                {/* Verification Badge */}
                <div className="absolute top-4 right-4">
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full backdrop-blur-sm border ${
                    property.verificationStatus === 'verified' 
                      ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                      : property.verificationStatus === 'pending'
                      ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
                      : 'bg-red-500/20 border-red-500/30 text-red-400'
                  }`}>
                    {property.verificationStatus === 'verified' && <CheckCircle2 className="w-4 h-4" />}
                    {property.verificationStatus === 'pending' && <Clock className="w-4 h-4" />}
                    {property.verificationStatus === 'unverified' && <Shield className="w-4 h-4" />}
                    <span className="text-sm font-medium capitalize">{property.verificationStatus}</span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-primary shadow-lg' 
                        : 'border-border/50 hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Information Tabs */}
            <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-border/50">
                {[
                  { id: 'overview', label: 'Overview', icon: FileText },
                  { id: 'location', label: 'Location', icon: MapPin },
                  { id: 'documents', label: 'Documents', icon: Shield },
                  { id: 'history', label: 'History', icon: Clock }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                        activeTab === tab.id
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Property Description</h3>
                          <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {property.features.map((feature: string, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{property.views}</div>
                            <div className="text-sm text-muted-foreground">Views</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{property.inspections}</div>
                            <div className="text-sm text-muted-foreground">Inspections</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">4.7</div>
                            <div className="text-sm text-muted-foreground">Rating</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">100%</div>
                            <div className="text-sm text-muted-foreground">Verified</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'location' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Location Details</h3>
                          <div className="flex items-center gap-2 text-muted-foreground mb-4">
                            <MapPin className="w-4 h-4" />
                            <span>{property.location}</span>
                          </div>
                        </div>

                        {/* Mock Map Placeholder */}
                        <div className="aspect-[16/9] bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-lg border border-border/50 flex items-center justify-center">
                          <div className="text-center">
                            <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                            <p className="text-muted-foreground">Interactive Map</p>
                            <p className="text-sm text-muted-foreground">Lat: {property.coordinates.lat}, Lng: {property.coordinates.lng}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <h4 className="font-medium">Nearby Amenities</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div>🏥 Kiambu Hospital - 2.5 km</div>
                              <div>🏫 Kiambu High School - 1.8 km</div>
                              <div>🛒 Kiambu Market - 3.2 km</div>
                              <div>⛽ Shell Petrol Station - 1.5 km</div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-medium">Transportation</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div>🚌 Matatu Stage - 800m</div>
                              <div>🛣️ Kiambu-Nairobi Highway - 2km</div>
                              <div>✈️ JKIA Airport - 45 min drive</div>
                              <div>🚂 Kiambu Railway Station - 3km</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'documents' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Legal Documents</h3>
                          <p className="text-muted-foreground text-sm mb-4">
                            All documents are blockchain-verified and legally compliant
                          </p>
                        </div>

                        <div className="grid gap-4">
                          {documents.map((doc) => {
                            const Icon = getDocumentIcon(doc.type);
                            return (
                              <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-primary/10">
                                    <Icon className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{doc.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {doc.size} • Uploaded {doc.uploadDate}
                                    </div>
                                  </div>
                                  {doc.verified && (
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-600 text-xs">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Verified
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <button className="p-2 rounded-lg bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground transition-colors">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 rounded-lg bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground transition-colors">
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {activeTab === 'history' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Inspection Reports</h3>
                        </div>

                        <div className="space-y-4">
                          {inspectionReports.map((report) => (
                            <div key={report.id} className="p-4 rounded-lg border border-border/50">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="font-medium">{report.inspectorName}</div>
                                  <div className="text-sm text-muted-foreground">{report.date}</div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < Math.floor(report.rating)
                                            ? 'text-yellow-500 fill-current'
                                            : 'text-muted-foreground'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium ml-1">{report.rating}</span>
                                  {report.verified && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-2" />
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{report.summary}</p>
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-border/50">
                          <h4 className="font-medium mb-3">Property Timeline</h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                              <span className="text-muted-foreground">Listed on marketplace</span>
                              <span className="text-muted-foreground">•</span>
                              <span>{property.listedDate}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span className="text-muted-foreground">Professional inspection completed</span>
                              <span className="text-muted-foreground">•</span>
                              <span>2024-01-18</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                              <span className="text-muted-foreground">Blockchain verification completed</span>
                              <span className="text-muted-foreground">•</span>
                              <span>2024-01-10</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Price and Quick Info */}
              <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {property.currency} {property.price.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">{property.area}</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <div className="flex items-center gap-1">
                      {property.verificationStatus === 'verified' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {property.verificationStatus === 'pending' && <Clock className="w-4 h-4 text-yellow-500" />}
                      {property.verificationStatus === 'unverified' && <Shield className="w-4 h-4 text-red-500" />}
                      <span className={`font-medium capitalize ${
                        property.verificationStatus === 'verified' ? 'text-emerald-600' :
                        property.verificationStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                      }`}>{property.verificationStatus}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Listed</span>
                    <span>{property.listedDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span>{property.lastUpdated}</span>
                  </div>
                </div>

                {/* Buy Button */}
                <motion.button
                  className="group relative w-full px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-lg overflow-hidden flex items-center justify-center gap-3 text-lg shadow-[0_0_40px_rgba(59,130,246,1)] border-2 border-white/30 backdrop-blur-sm"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(59,130,246,1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <Wallet className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Buy now</span>
                </motion.button>

                <div className="text-center mt-3">
                  <p className="text-xs text-muted-foreground">
                    Secure blockchain transaction • Instant ownership transfer
                  </p>
                </div>
              </div>

              {/* Verification & Trust Indicators */}
              <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Trust & Security
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Blockchain Verified</div>
                      <div className="text-xs text-muted-foreground">Title deed on Hedera network</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Eye className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Professional Inspection</div>
                      <div className="text-xs text-muted-foreground">Verified by certified inspectors</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <FileText className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Legal Compliance</div>
                      <div className="text-xs text-muted-foreground">All documents verified</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/20">
                      <Zap className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Instant Transfer</div>
                      <div className="text-xs text-muted-foreground">Smart contract execution</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Property Owner
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="font-medium">{property.ownerName}</div>
                    <div className="text-sm text-muted-foreground">Verified Owner</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{property.ownerContact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{property.ownerContact.email}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50">
                    <div className="text-xs text-muted-foreground">Hedera DID</div>
                    <div className="text-xs font-mono bg-card/50 p-2 rounded mt-1 break-all">
                      {property.ownerDID}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandDetails;
