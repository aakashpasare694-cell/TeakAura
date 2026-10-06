import React, { useState } from 'react';
import { UploadCloud, X, Star, Link as LinkIcon, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { uploadImage } from '../../utils/api';

export interface AdminImageItem {
  id?: number;
  image_url: string;
  alt_text?: string;
  display_order: number;
}

interface ImageUploaderProps {
  coverImageUrl: string;
  onSetCoverImage: (url: string) => void;
  images: AdminImageItem[];
  onChangeImages: (images: AdminImageItem[]) => void;
}

export function ImageUploader({
  coverImageUrl,
  onSetCoverImage,
  images,
  onChangeImages,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    try {
      const newItems: AdminImageItem[] = [...images];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 5MB validation
        if (file.size > 5 * 1024 * 1024) {
          setError(`File ${file.name} exceeds 5 MB limit`);
          continue;
        }

        // Upload to R2
        const uploaded = await uploadImage(file, 'products');

        const newItem: AdminImageItem = {
          image_url: uploaded.url,
          alt_text: file.name.split('.')[0],
          display_order: newItems.length + 1,
        };

        newItems.push(newItem);

        // If no cover image yet, set first uploaded as cover
        if (!coverImageUrl) {
          onSetCoverImage(uploaded.url);
        }
      }

      onChangeImages(newItems);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    const newItems = [
      ...images,
      {
        image_url: manualUrl.trim(),
        alt_text: 'Product Image',
        display_order: images.length + 1,
      },
    ];
    if (!coverImageUrl) {
      onSetCoverImage(manualUrl.trim());
    }
    onChangeImages(newItems);
    setManualUrl('');
    setShowUrlInput(false);
  };

  const handleRemoveImage = (index: number) => {
    const target = images[index];
    const updated = images.filter((_, i) => i !== index);
    onChangeImages(updated);

    // If removed image was cover, reset cover to first remaining
    if (coverImageUrl === target.image_url) {
      onSetCoverImage(updated[0]?.image_url || '');
    }
  };

  const handleMoveLeft = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    onChangeImages(updated);
  };

  const handleMoveRight = (index: number) => {
    if (index === images.length - 1) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    onChangeImages(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
            Product Images & Gallery (Cloudflare R2)
          </label>
          <p className="text-xs text-stone-500">
            Drag and drop images, reorder with arrows, or click the star to set as cover photo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-teak-800 hover:text-teak-950 font-medium flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL input' : 'Add via direct URL'}</span>
        </button>
      </div>

      {error && (
        <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      {/* Manual URL Input */}
      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://images.unsplash.com/... or R2 public URL"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 px-3 py-2 text-xs border border-teak-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/40"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-4 py-2 bg-teak-900 text-cream-50 rounded-xl text-xs font-medium hover:bg-teak-800"
          >
            Add Image
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <label className="border-2 border-dashed border-teak-300 hover:border-gold-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-cream-50/50 hover:bg-cream-100/60 transition-colors">
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-gold-600 animate-spin" />
            <span className="text-xs text-stone-600 font-medium">Uploading images to Cloudflare R2...</span>
          </div>
        ) : (
          <>
            <UploadCloud className="w-8 h-8 text-gold-600 mb-2" />
            <span className="text-xs font-semibold text-teak-950">
              Click or drag files here to upload to R2
            </span>
            <span className="text-[11px] text-stone-500 mt-1">
              Supports WebP, JPG, PNG (Max 5MB per file)
            </span>
          </>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={uploading}
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />
      </label>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {images.map((img, idx) => {
            const isCover = coverImageUrl === img.image_url;
            return (
              <div
                key={idx}
                className={`relative rounded-xl overflow-hidden border-2 bg-stone-100 group aspect-square flex flex-col justify-between ${
                  isCover ? 'border-gold-500 shadow-warm-sm' : 'border-stone-200'
                }`}
              >
                <img
                  src={img.image_url}
                  alt={img.alt_text || `Product photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Cover Badge */}
                {isCover && (
                  <div className="absolute top-2 left-2 bg-gold-500 text-charcoal-950 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-charcoal-950" />
                    <span>COVER</span>
                  </div>
                )}

                {/* Action Buttons Overlay */}
                <div className="absolute inset-0 bg-charcoal-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between items-center">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => onSetCoverImage(img.image_url)}
                        className="bg-gold-500 text-charcoal-950 px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 shadow-sm hover:bg-gold-400"
                        title="Set as main cover image"
                      >
                        <Star className="w-3 h-3" />
                        <span>Set Cover</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="ml-auto bg-red-600/90 text-white p-1 rounded-full hover:bg-red-700"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveLeft(idx)}
                      className="bg-white/80 p-1 rounded text-stone-800 hover:bg-white disabled:opacity-30"
                      title="Move left"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMoveRight(idx)}
                      className="bg-white/80 p-1 rounded text-stone-800 hover:bg-white disabled:opacity-30"
                      title="Move right"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
