import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, MapPin, DollarSign, FileText, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { api } from '../lib/api';

interface FormData {
  size: string;
  price: string;
  location: string;
  description: string;
}

// Tweak UploadedFile to minimally support status, type, name, hash
interface UploadedFile {
  name: string;
  type: string;
  hash?: string;
  status?: 'pending' | 'success' | 'error';
  gatewayOk?: boolean;
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

  // Handle input field updates
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Helper for uploading ONE file to IPFS and setting result in state
  const uploadSingleFile = async (
    file: File, 
    fileType: 'ownershipProof' | 'surveyMap' | 'additional',
    index?: number
  ) => {
    let fileData: UploadedFile = {
      name: file.name,
      type: file.type,
      status: 'pending',
    };
    if (fileType === 'additional') {
      setFiles(prev => ({
        ...prev,
        additionalDocs: index !== undefined ? [...prev.additionalDocs.slice(0, index), fileData, ...prev.additionalDocs.slice(index + 1)] : [...prev.additionalDocs, fileData],
      }));
    } else {
      setFiles(prev => ({
        ...prev,
        [fileType]: fileData,
      }));
    }
    try {
      const { ipfsHash } = await api.uploadFileToIPFS(file);
      fileData = {
        ...fileData,
        hash: ipfsHash,
        status: ipfsHash ? 'success' : 'error',
      };
      // Check propagation (optional)
      if (ipfsHash) {
        const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        try {
          const resp = await fetch(gatewayUrl, { method: 'HEAD' });
          fileData.gatewayOk = resp.ok;
          fileData.status = resp.ok ? 'success' : 'error';
        } catch {
          fileData.gatewayOk = false;
          fileData.status = 'error';
        }
      }
      setFiles(prev => {
        if (fileType === 'additional' && index !== undefined) {
          const docs = [...prev.additionalDocs];
          docs[index] = fileData;
          return { ...prev, additionalDocs: docs };
        } else if (fileType === 'additional') {
          return { ...prev, additionalDocs: [...prev.additionalDocs.slice(0, -1), fileData] };
        } else {
          return { ...prev, [fileType]: fileData };
        }
      });
    } catch {
      fileData.status = 'error';
      setError('Failed to upload to IPFS.');
    }
  };

  // In the file input onChange for 'ownershipProof' or 'surveyMap':
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'ownershipProof' | 'surveyMap' | 'additional') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === 'additional') {
      setFiles(prev => ({
        ...prev,
        additionalDocs: [...prev.additionalDocs, { name: file.name, type: file.type, status: 'pending' }]
      }));
      // Upload last in array
      uploadSingleFile(file, 'additional', files.additionalDocs.length);
    } else {
      uploadSingleFile(file, type);
    }
  };

  // Additional: support multiple files for additionalDocs
  const handleAdditionalFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    newFiles.forEach((file) => {
      setFiles(prev => ({
        ...prev,
        additionalDocs: [...prev.additionalDocs, { name: file.name, type: file.type, status: 'pending' }]
      }));
      uploadSingleFile(file, 'additional', files.additionalDocs.length);
    });
  };

  // Check readiness
  const canSubmit =
    files.ownershipProof?.status === 'success' &&
    files.ownershipProof?.gatewayOk &&
    files.surveyMap?.status === 'success' &&
    files.surveyMap?.gatewayOk;

  // On submit: 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      // Validate files
      if (!canSubmit) {
        throw new Error('All required files must be uploaded and reachable via IPFS.');
      }
      // 1. Upload metadata with doc hashes (guarantee: ONLY include public fields)
      const metadata = {
        size: formData.size,
        price: formData.price,
        location: formData.location,
        description: formData.description,
        documents: {
          ownershipProof: files.ownershipProof?.hash ?? null,
          surveyMap: files.surveyMap?.hash ?? null,
          additional: Array.isArray(files.additionalDocs)
            ? files.additionalDocs.filter(doc => doc.hash).map(doc => doc.hash)
            : []
        },
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      const { ipfsHash: metadataHash } = await api.uploadJSONToIPFS(metadata);
      // 2. Create verification entry for inspectors (returns landId)
      const created = await api.createLandNFT({
        metadataHash,
        size: formData.size,
        price: formData.price,
        location: formData.location,
      });
      const landId = created?.landId;
      setSuccess(`Land parcel listed successfully! Submission ID: ${landId}. Waiting for inspector verification.`);
      // Reset
      setFormData({ size: '', price: '', location: '', description: '' });
      setFiles({ additionalDocs: [] });
    } catch (err: any) {
      setError(err.message || 'Failed to list land parcel.');
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
              <input
                id="size"
                name="size"
                type="text"
                required
                value={formData.size}
                onChange={(e) => handleInputChange(e as any)}
                placeholder="e.g., 2.5"
                className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div>
            <Label htmlFor="price">Price (in KES)</Label>
            <div className="relative">
              <input
                id="price"
                name="price"
                type="text"
                required
                value={formData.price}
              
                onChange={(e) => handleInputChange(e as any)}
                placeholder="e.g., 5,000,000"
                className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={(e) => handleInputChange(e as any)}
                placeholder="e.g., Kiambu, Limuru"
                className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => handleInputChange(e as any)}
              placeholder="Describe your land parcel..."
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>

        {/* Document Uploads */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="ownershipProof">Ownership Proof (Required)</Label>
            <div className="relative">
              <input
                id="ownershipProof"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(e as any, 'ownershipProof')}
                required={!files.ownershipProof}
                className="pl-10 w-full"
              />
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            {files.ownershipProof && (
              <div className="flex items-center space-x-2 text-sm mt-1">
                {files.ownershipProof.status === 'success' && files.ownershipProof.hash && (
                  <>
                    <span className="text-green-600 font-semibold">✓ Uploaded</span>
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${files.ownershipProof.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-500"
                    >
                      View on IPFS
                    </a>
                    {!files.ownershipProof.gatewayOk && (
                      <span className="text-yellow-500">(Awaiting IPFS...)</span>
                    )}
                  </>
                )}
                {files.ownershipProof.status === 'error' && (
                  <span className="text-red-500 font-semibold">Failed to verify</span>
                )}
                <span className="text-muted-foreground">{files.ownershipProof.name}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="surveyMap">Survey Map (Required)</Label>
            <div className="relative">
              <input
                id="surveyMap"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(e as any, 'surveyMap')}
                required={!files.surveyMap}
                className="pl-10 w-full"
              />
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            {files.surveyMap && (
              <div className="flex items-center space-x-2 text-sm mt-1">
                {files.surveyMap.status === 'success' && files.surveyMap.hash && (
                  <>
                    <span className="text-green-600 font-semibold">✓ Uploaded</span>
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${files.surveyMap.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-500"
                    >
                      View on IPFS
                    </a>
                    {!files.surveyMap.gatewayOk && (
                      <span className="text-yellow-500">(Awaiting IPFS...)</span>
                    )}
                  </>
                )}
                {files.surveyMap.status === 'error' && (
                  <span className="text-red-500 font-semibold">Failed to verify</span>
                )}
                <span className="text-muted-foreground">{files.surveyMap.name}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="additionalDocs">Additional Documents (Optional)</Label>
            <div className="relative">
              <input
                id="additionalDocs"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleAdditionalFilesUpload}
                multiple
                className="pl-10 w-full"
              />
              <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            {files.additionalDocs.length > 0 && (
              <div className="text-sm text-muted-foreground mt-1">
                {files.additionalDocs.map((doc, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {doc.status === 'success' && doc.hash && (
                      <>
                        <span className="text-green-600 font-semibold">✓ Uploaded</span>
                        <a
                          href={`https://gateway.pinata.cloud/ipfs/${doc.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-blue-500"
                        >
                          View on IPFS
                        </a>
                        {!doc.gatewayOk && (
                          <span className="text-yellow-500">(Awaiting IPFS...)</span>
                        )}
                      </>
                    )}
                    {doc.status === 'error' && <span className="text-red-500 font-semibold">Failed to verify</span>}
                    <span>{doc.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm">
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-500 text-sm">
            {success}
          </motion.p>
        )}

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting || !canSubmit} className="w-full">
          {isSubmitting ? (
            'Submitting...'
          ) : (
            <span className="flex items-center gap-2">List Land Parcel
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>
    </motion.div>
  );
};