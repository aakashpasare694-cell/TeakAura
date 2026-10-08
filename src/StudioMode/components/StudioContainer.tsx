import { useState, useRef } from 'react';
import { StudioLoadingScreen } from './StudioLoadingScreen';
import { StudioCanvas, StudioCanvasRef } from './StudioCanvas';
import { StudioOverlay } from './StudioOverlay';
import { StudioMiniMap } from './StudioMiniMap';
import { ProductSpecModal } from './ProductSpecModal';
import { StudioProduct, SectionId, CameraMode } from '../types';
import { SHOWROOM_SECTIONS } from '../data/studioProducts';

interface StudioContainerProps {
  onExit: () => void;
  onOpenGlobalEnquiry?: (customProduct?: string) => void;
}

export function StudioContainer({ onExit, onOpenGlobalEnquiry }: StudioContainerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState<SectionId>('entrance');
  const [nearbyProduct, setNearbyProduct] = useState<StudioProduct | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<StudioProduct | null>(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>('walk');
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [teleportTargetZ, setTeleportTargetZ] = useState<number | null>(null);
  const [isAutoTouring, setIsAutoTouring] = useState(false);

  const canvasRef = useRef<StudioCanvasRef>(null);

  const handleTeleportToSection = (secId: SectionId) => {
    const sec = SHOWROOM_SECTIONS.find((s) => s.id === secId);
    if (sec) {
      setTeleportTargetZ(sec.posZ);
      setActiveSectionId(secId);
    }
  };

  const handleRequestQuote = (product: StudioProduct) => {
    setSelectedProduct(null); // Close product spec modal
    if (onOpenGlobalEnquiry) {
      onOpenGlobalEnquiry(`3D Studio Quote Request: ${product.name}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0703] overflow-hidden select-none">
      {/* 1. Loading Screen Preloader */}
      {isLoading ? (
        <StudioLoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <>
          {/* 2. WebGL 3D Showroom Canvas */}
          <StudioCanvas
            ref={canvasRef}
            cameraMode={cameraMode}
            onNearbyProductChange={(prod) => setNearbyProduct(prod)}
            onActiveSectionChange={(secId) => setActiveSectionId(secId)}
            onSelectProduct={(prod) => setSelectedProduct(prod)}
            teleportTargetZ={teleportTargetZ}
            onTeleportComplete={() => setTeleportTargetZ(null)}
            isAutoTouring={isAutoTouring}
          />

          {/* 3. Studio UI Overlay with D-Pad Navigation */}
          <StudioOverlay
            activeSectionId={activeSectionId}
            nearbyProduct={nearbyProduct}
            cameraMode={cameraMode}
            onToggleCameraMode={() =>
              setCameraMode((prev) => (prev === 'walk' ? 'explore' : 'walk'))
            }
            onOpenProductModal={(prod) => setSelectedProduct(prod)}
            onExitStudio={onExit}
            onToggleMap={() => setIsMapVisible((prev) => !prev)}
            isMapVisible={isMapVisible}
            onStepForward={() => canvasRef.current?.stepForward()}
            onStepBackward={() => canvasRef.current?.stepBackward()}
            onTurnLeft={() => canvasRef.current?.turnLeft()}
            onTurnRight={() => canvasRef.current?.turnRight()}
            onStrafeLeft={() => canvasRef.current?.strafeLeft()}
            onStrafeRight={() => canvasRef.current?.strafeRight()}
            onSelectSection={handleTeleportToSection}
            onAutoTourToggle={(touring) => setIsAutoTouring(touring)}
            isAutoTouring={isAutoTouring}
          />

          {/* 4. Mini Map Component */}
          {isMapVisible && (
            <div className="absolute top-20 right-6 z-30 pointer-events-auto hidden sm:block">
              <StudioMiniMap
                playerPos={{ x: 0, z: teleportTargetZ || 0 }}
                playerYaw={0}
                activeSectionId={activeSectionId}
                onTeleportToSection={handleTeleportToSection}
              />
            </div>
          )}

          {/* 5. Product Specification & 360 Inspection Modal */}
          {selectedProduct && (
            <ProductSpecModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onRequestQuote={handleRequestQuote}
            />
          )}
        </>
      )}
    </div>
  );
}
