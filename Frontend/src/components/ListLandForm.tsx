import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, MapPin, DollarSign, FileText, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { api } from '../lib/api';

interface FormData {
  size: string;
  price: string;
  location: string;
  description: string;
}

interface UploadedFile {
  name: string;
  type: string;
  hash?: string;
}

export const ListLandForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    size: '',
    price: '',
    location: '',
    description: '',
  });
  const [files, setFiles] = useState<{
    ownershipProof?: UploadedFile;
    surveyMap?: UploadedFile;
    additionalDocs: UploadedFile[];
  }>({
    additionalDocs: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'ownershipProof' | 'surveyMap' | 'additional') => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    try {
      // Upload to IPFS
      const formData = new FormData();
      formData.append('file', uploadedFile);
      const { ipfsHash } = await api.uploadFileToIPFS(uploadedFile);

      const fileData: UploadedFile = {
        name: uploadedFile.name,
        type: uploadedFile.type,
        hash: ipfsHash,
      };

      if (fileType === 'additional') {
        setFiles(prev => ({
          ...prev,
          additionalDocs: [...prev.additionalDocs, fileData],
        }));
      } else {
        setFiles(prev => ({
          ...prev,
          [fileType]: fileData,
        }));
      }
    } catch (err) {
      setError('Failed to upload file to IPFS. Please try again.');
      console.error('File upload error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required files
      if (!files.ownershipProof?.hash || !files.surveyMap?.hash) {
        throw new Error('Ownership proof and survey map are required');
      }

      console.log('Starting form submission...');
      
      // Create metadata
      const metadata = {
        ...formData,
        documents: {
          ownershipProof: files.ownershipProof.hash,
          surveyMap: files.surveyMap.hash,
          additional: files.additionalDocs.map(doc => doc.hash),
        },
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      // Upload metadata to IPFS
      const { ipfsHash: metadataHash } = await api.uploadJSONToIPFS(metadata);

      // Create land NFT with metadata
      const listingData = new FormData();
      listingData.append('metadataHash', metadataHash);
      listingData.append('size', formData.size);
      listingData.append('price', formData.price);
      listingData.append('location', formData.location);

      await api.createLandNFT(listingData);
      
      setSuccess('Land parcel listed successfully! Waiting for inspector verification.');
      // Reset form
      setFormData({
        size: '',
        price: '',
        location: '',
        description: '',
      });
      setFiles({ additionalDocs: [] });
    } catch (err: any) {
      setError(err.message || 'Failed to list land parcel. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6 bg-card rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6">List Your Land Parcel</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="size">Land Size (in acres)</Label>
            <div className="relative">
              <Input
                id="size"
                name="size"
                type="text"
                required
                value={formData.size}
                onChange={handleInputChange}
                placeholder="e.g., 2.5"
                className="pl-10"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div>
            <Label htmlFor="price">Price (in KES)</Label>
            <div className="relative">
              <Input
                id="price"
                name="price"
                type="text"
                required
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 5,000,000"
                className="pl-10"
              />
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <Input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Kiambu, Limuru"
                className="pl-10"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your land parcel..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        {/* Document Uploads */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="ownershipProof">Ownership Proof (Required)</Label>
            <div className="relative">
              <Input
                id="ownershipProof"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(e, 'ownershipProof')}
                required={!files.ownershipProof}
                className="pl-10"
              />
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            {files.ownershipProof && (
              <p className="text-sm text-muted-foreground mt-1">
                ✓ {files.ownershipProof.name}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="surveyMap">Survey Map (Required)</Label>
            <div className="relative">
              <Input
                id="surveyMap"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(e, 'surveyMap')}
                required={!files.surveyMap}
                className="pl-10"
              />
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            {files.surveyMap && (
              <p className="text-sm text-muted-foreground mt-1">
                ✓ {files.surveyMap.name}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="additionalDocs">Additional Documents (Optional)</Label>
            <div className="relative">
              <Input
                id="additionalDocs"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(e, 'additional')}
                multiple
                className="pl-10"
              />
              <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            {files.additionalDocs.length > 0 && (
              <div className="text-sm text-muted-foreground mt-1">
                {files.additionalDocs.map((doc, index) => (
                  <p key={index}>✓ {doc.name}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-destructive text-sm"
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-500 text-sm"
          >
            {success}
          </motion.p>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            'Submitting...'
          ) : (
            <span className="flex items-center gap-2">
              List Land Parcel
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>
    </motion.div>
  );
};