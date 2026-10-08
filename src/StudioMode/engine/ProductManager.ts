import * as THREE from 'three';
import { StudioProduct } from '../types';

export interface NearbyProductEvent {
  product: StudioProduct | null;
  distance: number;
}

export class ProductManager {
  private camera: THREE.PerspectiveCamera;
  private interactiveObjects: THREE.Object3D[];
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  public hoveredProduct: StudioProduct | null = null;
  public nearestProduct: StudioProduct | null = null;
  private highlightRing: THREE.Mesh | null = null;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, interactiveObjects: THREE.Object3D[]) {
    this.camera = camera;
    this.interactiveObjects = interactiveObjects;

    // Create subtle golden brass highlight ring for active product pedestal
    const ringGeo = new THREE.RingGeometry(2.4, 2.7, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    this.highlightRing = new THREE.Mesh(ringGeo, ringMat);
    this.highlightRing.rotation.x = -Math.PI / 2;
    this.highlightRing.position.y = 0.28; // just above pedestal surface
    scene.add(this.highlightRing);
  }

  /**
   * Evaluates nearest product relative to player position and raycast under crosshair
   */
  public update(playerPosition: THREE.Vector3, mousePos?: { x: number; y: number }): NearbyProductEvent {
    let closestProduct: StudioProduct | null = null;
    let minDistance = Infinity;

    // 1. Proximity Check (Distance from player to exhibit centers)
    this.interactiveObjects.forEach((obj) => {
      const prod = obj.userData.product as StudioProduct;
      if (!prod) return;

      const dist = playerPosition.distanceTo(new THREE.Vector3(prod.position.x, 1.7, prod.position.z));
      if (dist < minDistance) {
        minDistance = dist;
        closestProduct = prod;
      }
    });

    // 2. Mouse Raycast Check for Hover Highlight
    if (mousePos) {
      this.mouse.x = (mousePos.x / window.innerWidth) * 2 - 1;
      this.mouse.y = -(mousePos.y / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        this.hoveredProduct = hit.userData.product || null;
      } else {
        this.hoveredProduct = null;
      }
    }

    // Determine active product (either hovered or within interaction threshold < 5m)
    const active = this.hoveredProduct || (minDistance < 5.2 ? closestProduct : null);
    this.nearestProduct = active;

    // Update Highlight Ring Visual
    if (this.highlightRing && active) {
      this.highlightRing.position.set(active.position.x, 0.28, active.position.z);
      (this.highlightRing.material as THREE.MeshBasicMaterial).opacity = 0.8;
    } else if (this.highlightRing) {
      (this.highlightRing.material as THREE.MeshBasicMaterial).opacity = 0;
    }

    return {
      product: active,
      distance: minDistance,
    };
  }

  /**
   * Raycasts directly from screen coordinate to select a product
   */
  public getProductAtScreenPoint(screenX: number, screenY: number): StudioProduct | null {
    this.mouse.x = (screenX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(screenY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      return intersects[0].object.userData.product || null;
    }
    return null;
  }
}
