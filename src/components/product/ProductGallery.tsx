import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Play } from 'lucide-react';
import { ProductImage } from '../../types';

interface ProductGalleryProps {
  coverImage: string;
  images?: ProductImage[];
  productName: string;
  videoUrl?: string | null;
}

export function ProductGallery({ coverImage, images = [], productName, videoUrl }: ProductGalleryProps) {
  // Combine cover image with additional images
  const allImages = [
    { id: 0, image_url: coverImage, alt_text: productName, display_order: 0 },
    ...images.filter((img) => img.image_url !== coverImage),
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const currentImage = allImages[selectedIndex] || allImages[0];

  return (
    <div className="space-y-4">
      {/* Main Image Stage */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-teak-100 border border-teak-200/80 shadow-warm-md group">
        {showVideo && videoUrl ? (
          <div className="w-full h-full bg-black flex items-center justify-center">
            {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
              <iframe
                src={videoUrl.replace('watch?v=', 'embed/')}
                title="Workshop Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={videoUrl} controls autoPlay className="w-full h-full object-contain" />
            )}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 bg-charcoal-900/80 text-white p-2 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage?.image_url}
              src={currentImage?.image_url}
              alt={currentImage?.alt_text || productName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover object-center cursor-zoom-in group-hover:scale-105 transition-transform duration-500 ease-out"
              onClick={() => setLightboxOpen(true)}
            />
          </AnimatePresence>
        )}

        {/* Fullscreen Button */}
        {!showVideo && (
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute top-4 right-4 p-2.5 rounded-xl bg-teak-950/70 hover:bg-teak-950 text-cream-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md backdrop-blur-sm"
            aria-label="Enlarge photograph"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}

        {/* Video badge if video exists */}
        {videoUrl && !showVideo && (
          <button
            onClick={() => setShowVideo(true)}
            className="absolute bottom-4 left-4 bg-teak-900/90 text-gold-400 border border-gold-500/40 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 backdrop-blur-sm hover:bg-teak-800 transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-gold-400" />
            <span>Watch Workshop Video</span>
          </button>
        )}
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setShowVideo(false);
                setSelectedIndex(idx);
              }}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                selectedIndex === idx && !showVideo
                  ? 'border-gold-500 ring-2 ring-gold-400/30'
                  : 'border-teak-200/80 hover:border-teak-400 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img.image_url}
                alt={img.alt_text || `Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}

          {videoUrl && (
            <button
              onClick={() => setShowVideo(true)}
              className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center bg-teak-900 text-gold-400 transition-all ${
                showVideo ? 'border-gold-500 ring-2 ring-gold-400/30' : 'border-teak-700 opacity-80'
              }`}
            >
              <Play className="w-5 h-5 fill-gold-400 mb-1" />
              <span className="text-[10px] font-semibold">Video</span>
            </button>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-charcoal-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-cream-100 hover:text-white p-3 rounded-full bg-charcoal-800/80"
            aria-label="Close enlarged preview"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={currentImage?.image_url}
            alt={currentImage?.alt_text || productName}
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
