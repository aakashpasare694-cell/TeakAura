import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { ShowroomBuilder } from '../engine/ShowroomBuilder';
import { PlayerController } from '../engine/PlayerController';
import { ProductManager } from '../engine/ProductManager';
import { StudioProduct, SectionId, CameraMode } from '../types';
import { SHOWROOM_SECTIONS, STUDIO_PRODUCTS } from '../data/studioProducts';

export interface StudioCanvasRef {
  stepForward: () => void;
  stepBackward: () => void;
  turnLeft: () => void;
  turnRight: () => void;
  strafeLeft: () => void;
  strafeRight: () => void;
  teleportToZ: (z: number) => void;
  teleportToProduct: (prod: StudioProduct) => void;
}

interface StudioCanvasProps {
  cameraMode: CameraMode;
  onNearbyProductChange: (prod: StudioProduct | null) => void;
  onActiveSectionChange: (sectionId: SectionId) => void;
  onSelectProduct: (prod: StudioProduct) => void;
  teleportTargetZ: number | null;
  onTeleportComplete: () => void;
  isAutoTouring: boolean;
}

export const StudioCanvas = forwardRef<StudioCanvasRef, StudioCanvasProps>(
  (
    {
      cameraMode,
      onNearbyProductChange,
      onActiveSectionChange,
      onSelectProduct,
      teleportTargetZ,
      onTeleportComplete,
      isAutoTouring,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const playerControllerRef = useRef<PlayerController | null>(null);
    const productManagerRef = useRef<ProductManager | null>(null);

    // Auto Tour Refs
    const isAutoTouringRef = useRef(isAutoTouring);
    const autoTourIndexRef = useRef(0);
    const lastTourStepTimeRef = useRef(0);

    // Keep ref synced without re-triggering component mount
    useEffect(() => {
      isAutoTouringRef.current = isAutoTouring;
    }, [isAutoTouring]);

    useImperativeHandle(ref, () => ({
      stepForward: () => playerControllerRef.current?.stepForward(),
      stepBackward: () => playerControllerRef.current?.stepBackward(),
      turnLeft: () => playerControllerRef.current?.turnLeft(),
      turnRight: () => playerControllerRef.current?.turnRight(),
      strafeLeft: () => playerControllerRef.current?.strafeLeft(),
      strafeRight: () => playerControllerRef.current?.strafeRight(),
      teleportToZ: (z: number) => playerControllerRef.current?.teleportTo(z),
      teleportToProduct: (prod: StudioProduct) => {
        const targetZ = prod.position.z + 3.2;
        const targetYaw = prod.position.x < 0 ? -Math.PI / 4 : Math.PI / 4;
        playerControllerRef.current?.glideTo(0, targetZ, targetYaw);
      },
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      // 1. Scene Setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x28180e);
      scene.fog = new THREE.FogExp2(0x28180e, 0.003);
      sceneRef.current = scene;

      // 2. Camera
      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        200
      );
      cameraRef.current = camera;

      // 3. WebGL Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.shadowMap.enabled = false;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // 4. Build Showroom Architecture & Furniture Exhibits
      const builder = new ShowroomBuilder(scene);
      builder.buildShowroom();

      // 5. Initialize Controllers
      const playerController = new PlayerController(camera, renderer.domElement);
      playerControllerRef.current = playerController;

      const productManager = new ProductManager(scene, camera, builder.interactiveObjects);
      productManagerRef.current = productManager;

      // Floor Click Navigation Indicator Ring
      const raycaster = new THREE.Raycaster();
      const pointerVec = new THREE.Vector2();

      const ringGeo = new THREE.RingGeometry(0.35, 0.55, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      });
      const targetRing = new THREE.Mesh(ringGeo, ringMat);
      targetRing.rotation.x = -Math.PI / 2;
      targetRing.position.y = 0.04;
      scene.add(targetRing);

      let targetRingAlpha = 0;
      let dragStartX = 0;
      let dragStartY = 0;

      const handlePointerDown = (e: PointerEvent) => {
        dragStartX = e.clientX;
        dragStartY = e.clientY;
      };

      const handlePointerUp = (e: PointerEvent) => {
        // Calculate drag distance to separate look-around drag from tap/click
        const dist = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);
        if (dist > 8) return; // User was dragging to rotate camera

        // 1. Check if user clicked a 3D product exhibit
        const clickedProd = productManager.getProductAtScreenPoint(e.clientX, e.clientY);
        if (clickedProd) {
          onSelectProduct(clickedProd);
          return;
        }

        // 2. Raycast floor for click-to-walk navigation
        if (builder.floorMesh) {
          pointerVec.x = (e.clientX / window.innerWidth) * 2 - 1;
          pointerVec.y = -(e.clientY / window.innerHeight) * 2 + 1;

          raycaster.setFromCamera(pointerVec, camera);
          const intersects = raycaster.intersectObject(builder.floorMesh);

          if (intersects.length > 0) {
            const hitPoint = intersects[0].point;
            playerController.glideTo(hitPoint.x, hitPoint.z);

            // Trigger visual target ring on floor
            targetRing.position.set(hitPoint.x, 0.05, hitPoint.z);
            targetRing.scale.set(1.5, 1.5, 1.5);
            targetRingAlpha = 1.0;
          }
        }
      };

      renderer.domElement.addEventListener('pointerdown', handlePointerDown);
      renderer.domElement.addEventListener('pointerup', handlePointerUp);

      // 6. Animation Render Loop
      let animationFrameId: number;
      let lastTime = performance.now();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const now = performance.now();
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        // Animate Floor Target Ring Fade Out
        if (targetRingAlpha > 0) {
          targetRingAlpha -= dt * 2.5;
          ringMat.opacity = Math.max(0, targetRingAlpha);
          const currentScale = targetRing.scale.x;
          if (currentScale > 1.0) {
            targetRing.scale.setScalar(Math.max(1.0, currentScale - dt * 1.5));
          }
        }

        // Auto Tour Progression
        if (isAutoTouringRef.current && now - lastTourStepTimeRef.current > 3800) {
          lastTourStepTimeRef.current = now;
          const nextIndex = (autoTourIndexRef.current + 1) % STUDIO_PRODUCTS.length;
          autoTourIndexRef.current = nextIndex;
          const targetProd = STUDIO_PRODUCTS[nextIndex];
          playerController.glideTo(0, targetProd.position.z + 3.5, 0);
        }

        // Update Player Physics & Movement
        playerController.update(dt);

        // Update Product Proximity Check
        const event = productManager.update(playerController.position);
        onNearbyProductChange(event.product);

        // Active Section Identification
        const currentZ = playerController.position.z;
        let closestSec = SHOWROOM_SECTIONS[0];
        let minZDist = Infinity;

        SHOWROOM_SECTIONS.forEach((sec) => {
          const d = Math.abs(currentZ - sec.posZ);
          if (d < minZDist) {
            minZDist = d;
            closestSec = sec;
          }
        });
        onActiveSectionChange(closestSec.id);

        renderer.render(scene, camera);
      };

      animate();

      // Handle Resize
      const handleResize = () => {
        if (!renderer || !camera) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
        renderer.domElement.removeEventListener('pointerup', handlePointerUp);
        playerController.dispose();
        renderer.dispose();
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };
    }, []); // Run ONLY once on mount!

    useEffect(() => {
      if (teleportTargetZ !== null && playerControllerRef.current) {
        playerControllerRef.current.teleportTo(teleportTargetZ);
        onTeleportComplete();
      }
    }, [teleportTargetZ]);

    return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
  }
);
