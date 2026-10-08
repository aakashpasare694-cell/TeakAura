import * as THREE from 'three';
import { STUDIO_PRODUCTS, SHOWROOM_SECTIONS } from '../data/studioProducts';
import { StudioProduct } from '../types';

/**
 * Procedural Texture Generator for Rich Teakwood & Marble Materials
 */
function createTeakWoodTexture(type: 'dark' | 'natural' | 'parquet' = 'natural'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (type === 'parquet') {
    // Teak Parquet Floor Pattern
    ctx.fillStyle = '#4a2511';
    ctx.fillRect(0, 0, 512, 512);

    const tileSize = 64;
    for (let x = 0; x < 512; x += tileSize) {
      for (let y = 0; y < 512; y += tileSize) {
        const isHorizontal = ((x / tileSize) + (y / tileSize)) % 2 === 0;
        ctx.save();
        ctx.translate(x, y);

        // Base tile tone variation
        const shade = Math.floor(Math.random() * 20) - 10;
        ctx.fillStyle = `rgb(${75 + shade}, ${40 + shade}, ${20 + shade})`;
        ctx.fillRect(0, 0, tileSize, tileSize);

        // Wood grain lines
        ctx.strokeStyle = `rgba(30, 15, 5, 0.35)`;
        ctx.lineWidth = 1;
        const plankCount = 4;
        const plankW = tileSize / plankCount;

        for (let p = 0; p < plankCount; p++) {
          if (isHorizontal) {
            ctx.fillStyle = p % 2 === 0 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
            ctx.fillRect(0, p * plankW, tileSize, plankW);
          } else {
            ctx.fillStyle = p % 2 === 0 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
            ctx.fillRect(p * plankW, 0, plankW, tileSize);
          }
        }

        // Tile border line
        ctx.strokeStyle = 'rgba(20, 10, 5, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(0, 0, tileSize, tileSize);

        ctx.restore();
      }
    }
  } else {
    // Continuous Teak Wood Grain Texture
    const baseColor = type === 'dark' ? '#3d1e0d' : '#8c481d';
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    // Grain rings and waves
    for (let i = 0; i < 60; i++) {
      const y = Math.random() * 512;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(40, 15, 5, 0.25)' : 'rgba(180, 110, 40, 0.15)';
      ctx.fillRect(0, y, 512, Math.random() * 4 + 1);
    }

    // Organic grain curves
    ctx.strokeStyle = 'rgba(30, 10, 2, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      const startY = Math.random() * 512;
      ctx.moveTo(0, startY);
      ctx.bezierCurveTo(150, startY + 30, 350, startY - 30, 512, startY + 10);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createMarbleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#f2efea';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = 'rgba(180, 170, 160, 0.3)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 256, 0);
    ctx.bezierCurveTo(
      Math.random() * 256,
      75,
      Math.random() * 256,
      175,
      Math.random() * 256,
      256
    );
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export class ShowroomBuilder {
  public scene: THREE.Scene;
  public productMeshes: Map<number, THREE.Object3D> = new Map();
  public interactiveObjects: THREE.Object3D[] = [];
  public floorMesh: THREE.Mesh | null = null;

  // Materials Cache
  private teakParquetTex: THREE.CanvasTexture;
  private teakWoodTex: THREE.CanvasTexture;
  private darkTeakTex: THREE.CanvasTexture;
  private marbleTex: THREE.CanvasTexture;

  public teakMaterial: THREE.MeshStandardMaterial;
  public darkTeakMaterial: THREE.MeshStandardMaterial;
  public goldBrassMaterial: THREE.MeshStandardMaterial;
  public marbleMaterial: THREE.MeshStandardMaterial;
  public wallMaterial: THREE.MeshStandardMaterial;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    this.teakParquetTex = createTeakWoodTexture('parquet');
    this.teakParquetTex.repeat.set(12, 60);

    this.teakWoodTex = createTeakWoodTexture('natural');
    this.teakWoodTex.repeat.set(2, 4);

    this.darkTeakTex = createTeakWoodTexture('dark');
    this.darkTeakTex.repeat.set(2, 4);

    this.marbleTex = createMarbleTexture();
    this.marbleTex.repeat.set(2, 2);

    // Standard Materials
    this.teakMaterial = new THREE.MeshStandardMaterial({
      map: this.teakWoodTex,
      roughness: 0.45,
      metalness: 0.1,
      color: 0xffffff,
    });

    this.darkTeakMaterial = new THREE.MeshStandardMaterial({
      map: this.darkTeakTex,
      roughness: 0.5,
      metalness: 0.1,
      color: 0xd9d9d9,
    });

    this.goldBrassMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.85,
    });

    this.marbleMaterial = new THREE.MeshStandardMaterial({
      map: this.marbleTex,
      roughness: 0.2,
      metalness: 0.05,
    });

    this.wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4f0ea, // Warm off-white architectural lime plaster
      roughness: 0.8,
      metalness: 0.02,
    });
  }

  public buildShowroom() {
    this.buildGlobalLighting();
    this.buildArchitecture();
    this.buildSectionSigns();
    this.buildProductExhibits();
  }

  /**
   * Powerful Warm Luxury Lighting System (Ambient + Hemisphere + Directional)
   */
  private buildGlobalLighting() {
    // 1. Warm Ambient Light (Ensures everything is visible & rich)
    const ambient = new THREE.AmbientLight(0xfff5ea, 3.0);
    this.scene.add(ambient);

    // 2. Hemisphere Light (Soft ceiling warm glow + teak wood ground bounce)
    const hemi = new THREE.HemisphereLight(0xfff8ee, 0x4a2511, 2.0);
    this.scene.add(hemi);

    // 3. Main Entrance Directional Light
    const mainDir = new THREE.DirectionalLight(0xffeedd, 2.5);
    mainDir.position.set(0, 16, 12);
    this.scene.add(mainDir);

    // 4. Mid-Corridor Directional Light
    const midDir = new THREE.DirectionalLight(0xffe8d0, 2.0);
    midDir.position.set(0, 14, -60);
    this.scene.add(midDir);

    // 5. Back Sanctuary Directional Light
    const backDir = new THREE.DirectionalLight(0xffe0c2, 2.0);
    backDir.position.set(0, 14, -120);
    this.scene.add(backDir);
  }

  /**
   * Builds lobby walls, floor, ceiling, wooden beams, and recessed lighting
   */
  private buildArchitecture() {
    const corridorWidth = 28;
    const corridorHeight = 7.5;
    const corridorDepth = 145; // Z: +10 to -135

    // 1. Flooring
    const floorGeo = new THREE.PlaneGeometry(corridorWidth, corridorDepth);
    const floorMat = new THREE.MeshStandardMaterial({
      map: this.teakParquetTex,
      roughness: 0.3, // Glossy polished wood polish
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -corridorDepth / 2 + 10);
    floor.receiveShadow = true;
    this.scene.add(floor);
    this.floorMesh = floor; // Saved for floor click raycasting!

    // 2. Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(corridorWidth, corridorDepth);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x1a120c, // Dark teak ceiling slab
      roughness: 0.9,
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, corridorHeight, -corridorDepth / 2 + 10);
    this.scene.add(ceiling);

    // Exposed Architectural Ceiling Beams
    const beamGeo = new THREE.BoxGeometry(0.6, 0.4, corridorDepth);
    for (let x = -corridorWidth / 2 + 3; x <= corridorWidth / 2 - 3; x += 5.5) {
      const beam = new THREE.Mesh(beamGeo, this.darkTeakMaterial);
      beam.position.set(x, corridorHeight - 0.2, -corridorDepth / 2 + 10);
      this.scene.add(beam);
    }

    // Cross Beams every 15 meters with emissive light fixtures (No GPU lag!)
    const crossBeamGeo = new THREE.BoxGeometry(corridorWidth, 0.5, 0.6);
    const lightGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.15, 12);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xfff0dd });

    for (let z = 5; z >= -130; z -= 15) {
      const crossBeam = new THREE.Mesh(crossBeamGeo, this.darkTeakMaterial);
      crossBeam.position.set(0, corridorHeight - 0.25, z);
      this.scene.add(crossBeam);

      // Recessed Spotlight Fixtures under cross beams
      for (let lx = -9; lx <= 9; lx += 6) {
        const fixture = new THREE.Mesh(lightGeo, this.goldBrassMaterial);
        fixture.position.set(lx, corridorHeight - 0.5, z);

        const glow = new THREE.Mesh(lightGeo, lightMat);
        glow.scale.set(0.8, 0.2, 0.8);
        glow.position.set(lx, corridorHeight - 0.58, z);
        this.scene.add(fixture);
        this.scene.add(glow);
      }
    }

    // 3. Side Walls with Architectural Teak Skirting & Acoustic Panels
    const wallGeo = new THREE.PlaneGeometry(corridorDepth, corridorHeight);

    // Left Wall
    const leftWall = new THREE.Mesh(wallGeo, this.wallMaterial);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-corridorWidth / 2, corridorHeight / 2, -corridorDepth / 2 + 10);
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(wallGeo, this.wallMaterial);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(corridorWidth / 2, corridorHeight / 2, -corridorDepth / 2 + 10);
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);

    // Back Feature Wall (Z = -135)
    const backWallGeo = new THREE.PlaneGeometry(corridorWidth, corridorHeight);
    const backWall = new THREE.Mesh(backWallGeo, this.wallMaterial);
    backWall.position.set(0, corridorHeight / 2, -135);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Teak Baseboards (Skirting)
    const skirtingGeo = new THREE.BoxGeometry(0.15, 0.4, corridorDepth);
    const leftSkirting = new THREE.Mesh(skirtingGeo, this.darkTeakMaterial);
    leftSkirting.position.set(-corridorWidth / 2 + 0.08, 0.2, -corridorDepth / 2 + 10);
    this.scene.add(leftSkirting);

    const rightSkirting = new THREE.Mesh(skirtingGeo, this.darkTeakMaterial);
    rightSkirting.position.set(corridorWidth / 2 - 0.08, 0.2, -corridorDepth / 2 + 10);
    this.scene.add(rightSkirting);

    // Vertical Teak Wall Accent Slats behind Display Bays
    for (let z = -15; z >= -125; z -= 25) {
      // Left Bay Slats
      for (let s = -4; s <= 4; s += 0.8) {
        const slatGeo = new THREE.BoxGeometry(0.1, corridorHeight - 1, 0.2);
        const leftSlat = new THREE.Mesh(slatGeo, this.teakMaterial);
        leftSlat.position.set(-corridorWidth / 2 + 0.1, corridorHeight / 2, z + s);
        this.scene.add(leftSlat);

        const rightSlat = new THREE.Mesh(slatGeo, this.teakMaterial);
        rightSlat.position.set(corridorWidth / 2 - 0.1, corridorHeight / 2, z + s);
        this.scene.add(rightSlat);
      }
    }

    // Entrance Lobby Portal (Z = 5)
    const portalGeo = new THREE.BoxGeometry(1.2, corridorHeight, 0.8);
    const leftPillar = new THREE.Mesh(portalGeo, this.darkTeakMaterial);
    leftPillar.position.set(-6, corridorHeight / 2, 5);
    this.scene.add(leftPillar);

    const rightPillar = new THREE.Mesh(portalGeo, this.darkTeakMaterial);
    rightPillar.position.set(6, corridorHeight / 2, 5);
    this.scene.add(rightPillar);

    const archGeo = new THREE.BoxGeometry(13.2, 1.2, 0.8);
    const arch = new THREE.Mesh(archGeo, this.darkTeakMaterial);
    arch.position.set(0, corridorHeight - 0.6, 5);
    this.scene.add(arch);

    // Welcome Plaque Banner at Entrance
    const plaqueGeo = new THREE.BoxGeometry(7, 1.5, 0.1);
    const plaqueMat = new THREE.MeshStandardMaterial({
      color: 0x241208,
      roughness: 0.3,
    });
    const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaque.position.set(0, 5.2, 4.5);
    this.scene.add(plaque);

    const brassFrameGeo = new THREE.BoxGeometry(7.2, 1.7, 0.05);
    const brassFrame = new THREE.Mesh(brassFrameGeo, this.goldBrassMaterial);
    brassFrame.position.set(0, 5.2, 4.45);
    this.scene.add(brassFrame);
  }

  /**
   * Suspended Illuminated Section Signage
   */
  private buildSectionSigns() {
    SHOWROOM_SECTIONS.forEach((sec) => {
      if (sec.id === 'entrance') return;

      const signGroup = new THREE.Group();
      signGroup.position.set(0, 5.8, sec.posZ);

      // Brass Hangers from Ceiling
      const wireGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.4);
      const wire1 = new THREE.Mesh(wireGeo, this.goldBrassMaterial);
      wire1.position.set(-3.5, 0.7, 0);
      signGroup.add(wire1);

      const wire2 = new THREE.Mesh(wireGeo, this.goldBrassMaterial);
      wire2.position.set(3.5, 0.7, 0);
      signGroup.add(wire2);

      // Signboard Panel
      const signGeo = new THREE.BoxGeometry(8, 1.2, 0.15);
      const signMat = new THREE.MeshStandardMaterial({
        color: 0x1c0f08,
        roughness: 0.3,
        metalness: 0.2,
      });
      const signPanel = new THREE.Mesh(signGeo, signMat);
      signGroup.add(signPanel);

      const borderGeo = new THREE.BoxGeometry(8.2, 1.35, 0.1);
      const border = new THREE.Mesh(borderGeo, this.goldBrassMaterial);
      signGroup.add(border);

      // Glow light under sign
      const light = new THREE.PointLight(0xffc87c, 1.2, 6);
      light.position.set(0, -0.7, 0);
      signGroup.add(light);

      this.scene.add(signGroup);
    });
  }

  /**
   * Generates procedural 3D furniture exhibits for all studio products
   */
  private buildProductExhibits() {
    STUDIO_PRODUCTS.forEach((product) => {
      const exhibitGroup = new THREE.Group();
      exhibitGroup.position.set(product.position.x, product.position.y, product.position.z);
      exhibitGroup.rotation.y = product.rotationY;

      // 1. Pedestal Base
      if (product.pedestal) {
        const pedW = product.displayType === 'sanctuary_bed' ? 6.5 : product.displayType === 'dining_table' ? 6 : 4.5;
        const pedD = product.displayType === 'sanctuary_bed' ? 7 : product.displayType === 'dining_table' ? 5 : 4.5;

        const pedGeo = new THREE.BoxGeometry(pedW, 0.25, pedD);
        const pedestal = new THREE.Mesh(pedGeo, this.marbleMaterial);
        pedestal.position.y = 0.125;
        pedestal.receiveShadow = true;
        pedestal.castShadow = true;
        exhibitGroup.add(pedestal);

        // Brass Rim Trim around pedestal
        const rimGeo = new THREE.BoxGeometry(pedW + 0.1, 0.08, pedD + 0.1);
        const rim = new THREE.Mesh(rimGeo, this.goldBrassMaterial);
        rim.position.y = 0.04;
        exhibitGroup.add(rim);
      }

      // 2. Procedural 3D Furniture Model
      const modelGroup = this.createProceduralModel(product);
      modelGroup.position.y += product.pedestal ? 0.25 : 0;
      exhibitGroup.add(modelGroup);

      // 3. Floating Interactive Bounding Mesh for Raycasting
      const boundGeo = new THREE.BoxGeometry(4, 3.5, 4);
      const boundMat = new THREE.MeshBasicMaterial({ visible: false });
      const boundMesh = new THREE.Mesh(boundGeo, boundMat);
      boundMesh.position.y = 1.75;
      boundMesh.userData = { product };
      this.scene.add(exhibitGroup);
      this.productMeshes.set(product.id, exhibitGroup);
      this.interactiveObjects.push(boundMesh);
    });
  }

  /**
   * Builds realistic procedural 3D teak models for each category type
   */
  private createProceduralModel(product: StudioProduct): THREE.Group {
    const group = new THREE.Group();

    switch (product.displayType) {
      case 'door': {
        // Architectural Teak Door Frame & Double/Single Carved Door
        const frameW = 2.4;
        const frameH = 3.6;
        const frameD = 0.25;

        // Frame jambs
        const jambGeo = new THREE.BoxGeometry(0.18, frameH, frameD);
        const leftJamb = new THREE.Mesh(jambGeo, this.darkTeakMaterial);
        leftJamb.position.set(-frameW / 2, frameH / 2, 0);
        group.add(leftJamb);

        const rightJamb = new THREE.Mesh(jambGeo, this.darkTeakMaterial);
        rightJamb.position.set(frameW / 2, frameH / 2, 0);
        group.add(rightJamb);

        const topJambGeo = new THREE.BoxGeometry(frameW + 0.36, 0.2, frameD);
        const topJamb = new THREE.Mesh(topJambGeo, this.darkTeakMaterial);
        topJamb.position.set(0, frameH + 0.1, 0);
        group.add(topJamb);

        // Door Leaf Panels (2 Leaves)
        const leafW = (frameW - 0.08) / 2;
        const leafH = frameH - 0.08;
        const leafGeo = new THREE.BoxGeometry(leafW, leafH, 0.12);

        // Left Leaf
        const leftLeaf = new THREE.Mesh(leafGeo, this.teakMaterial);
        leftLeaf.position.set(-leafW / 2 - 0.02, leafH / 2 + 0.04, 0);
        leftLeaf.castShadow = true;
        group.add(leftLeaf);

        // Right Leaf (Ajar slightly for realism)
        const rightLeaf = new THREE.Mesh(leafGeo, this.teakMaterial);
        rightLeaf.position.set(leafW / 2 + 0.02, leafH / 2 + 0.04, 0);
        rightLeaf.rotation.y = -0.3; // slightly open
        rightLeaf.castShadow = true;
        group.add(rightLeaf);

        // Carved Recessed Panel Accents on door
        const panelGeo = new THREE.BoxGeometry(leafW - 0.3, 0.8, 0.15);
        for (let py = 0.8; py <= 2.8; py += 1.1) {
          const p1 = new THREE.Mesh(panelGeo, this.darkTeakMaterial);
          p1.position.set(-leafW / 2 - 0.02, py, 0);
          group.add(p1);

          const p2 = new THREE.Mesh(panelGeo, this.darkTeakMaterial);
          p2.position.set(leafW / 2 + 0.02, py, 0);
          p2.rotation.y = -0.3;
          group.add(p2);
        }

        // Antique Brass Handles & Locks
        const handleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.4);
        const handle1 = new THREE.Mesh(handleGeo, this.goldBrassMaterial);
        handle1.position.set(-0.1, 1.8, 0.1);
        group.add(handle1);

        const handle2 = new THREE.Mesh(handleGeo, this.goldBrassMaterial);
        handle2.position.set(0.1, 1.8, 0.1);
        handle2.rotation.y = -0.3;
        group.add(handle2);

        break;
      }

      case 'dining_table': {
        // Solid Teak Slab Dining Table + Chairs
        const tableW = 3.6;
        const tableD = 1.6;
        const tableH = 1.2;

        // Table Top Slab
        const slabGeo = new THREE.BoxGeometry(tableW, 0.12, tableD);
        const slab = new THREE.Mesh(slabGeo, this.teakMaterial);
        slab.position.y = tableH;
        slab.castShadow = true;
        group.add(slab);

        // Chamfered Edge trim
        const trimGeo = new THREE.BoxGeometry(tableW + 0.04, 0.06, tableD + 0.04);
        const trim = new THREE.Mesh(trimGeo, this.darkTeakMaterial);
        trim.position.y = tableH - 0.04;
        group.add(trim);

        // Trestle Pedestal Legs
        const legGeo = new THREE.BoxGeometry(0.2, tableH - 0.12, tableD - 0.3);
        const leg1 = new THREE.Mesh(legGeo, this.darkTeakMaterial);
        leg1.position.set(-tableW / 3, (tableH - 0.12) / 2, 0);
        leg1.castShadow = true;
        group.add(leg1);

        const leg2 = new THREE.Mesh(legGeo, this.darkTeakMaterial);
        leg2.position.set(tableW / 3, (tableH - 0.12) / 2, 0);
        leg2.castShadow = true;
        group.add(leg2);

        // Stretcher Bar
        const barGeo = new THREE.BoxGeometry(tableW - 0.4, 0.1, 0.1);
        const bar = new THREE.Mesh(barGeo, this.goldBrassMaterial);
        bar.position.set(0, 0.4, 0);
        group.add(bar);

        // Chairs around table
        for (let cx = -1.2; cx <= 1.2; cx += 1.2) {
          // Chair Side A
          const chairA = this.createChairMesh();
          chairA.position.set(cx, 0, tableD / 2 + 0.45);
          chairA.rotation.y = 0;
          group.add(chairA);

          // Chair Side B
          const chairB = this.createChairMesh();
          chairB.position.set(cx, 0, -tableD / 2 - 0.45);
          chairB.rotation.y = Math.PI;
          group.add(chairB);
        }
        break;
      }

      case 'sofa_suite': {
        // Teak & Cane 3-Seater Sofa Suite + Coffee Table
        const sofaW = 3.2;
        const sofaD = 1.3;
        const sofaH = 1.3;

        // Sofa Teak Frame
        const frameGeo = new THREE.BoxGeometry(sofaW, 0.12, sofaD);
        const baseFrame = new THREE.Mesh(frameGeo, this.darkTeakMaterial);
        baseFrame.position.y = 0.35;
        group.add(baseFrame);

        // Armrests
        const armGeo = new THREE.BoxGeometry(0.15, 0.8, sofaD);
        const leftArm = new THREE.Mesh(armGeo, this.teakMaterial);
        leftArm.position.set(-sofaW / 2 + 0.075, 0.75, 0);
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, this.teakMaterial);
        rightArm.position.set(sofaW / 2 - 0.075, 0.75, 0);
        group.add(rightArm);

        // Back Rest
        const backGeo = new THREE.BoxGeometry(sofaW, 0.8, 0.12);
        const backRest = new THREE.Mesh(backGeo, this.teakMaterial);
        backRest.position.set(0, 0.85, -sofaD / 2 + 0.06);
        group.add(backRest);

        // Fabric Cushion Seats (Belgian Linen cream tone)
        const cushionMat = new THREE.MeshStandardMaterial({
          color: 0xeee7db,
          roughness: 0.9,
        });

        const cushionW = (sofaW - 0.35) / 3;
        for (let c = 0; c < 3; c++) {
          const seatCushionGeo = new THREE.BoxGeometry(cushionW - 0.05, 0.25, sofaD - 0.2);
          const cushion = new THREE.Mesh(seatCushionGeo, cushionMat);
          const cx = -sofaW / 2 + 0.25 + c * cushionW + cushionW / 2;
          cushion.position.set(cx, 0.5, 0.05);
          cushion.castShadow = true;
          group.add(cushion);

          // Back Pillows
          const backPillowGeo = new THREE.BoxGeometry(cushionW - 0.05, 0.55, 0.2);
          const backPillow = new THREE.Mesh(backPillowGeo, cushionMat);
          backPillow.position.set(cx, 0.85, -sofaD / 2 + 0.2);
          group.add(backPillow);
        }

        // Coffee Table in front of Sofa
        const ctGeo = new THREE.BoxGeometry(1.6, 0.08, 0.9);
        const ct = new THREE.Mesh(ctGeo, this.teakMaterial);
        ct.position.set(0, 0.45, sofaD / 2 + 0.7);
        group.add(ct);

        const ctLegGeo = new THREE.BoxGeometry(0.08, 0.45, 0.08);
        for (let lx of [-0.7, 0.7]) {
          for (let lz of [-0.35, 0.35]) {
            const leg = new THREE.Mesh(ctLegGeo, this.goldBrassMaterial);
            leg.position.set(lx, 0.225, sofaD / 2 + 0.7 + lz);
            group.add(leg);
          }
        }
        break;
      }

      case 'chair_set': {
        // Pair of Colonial Armchairs facing each other
        const chair1 = this.createChairMesh(true);
        chair1.position.set(-0.9, 0, 0);
        chair1.rotation.y = 0.4;
        group.add(chair1);

        const chair2 = this.createChairMesh(true);
        chair2.position.set(0.9, 0, 0);
        chair2.rotation.y = -0.4;
        group.add(chair2);

        // Teak Side Table between them
        const stGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.6, 24);
        const st = new THREE.Mesh(stGeo, this.teakMaterial);
        st.position.set(0, 0.3, 0.3);
        group.add(st);
        break;
      }

      case 'wardrobe': {
        // 3-Door Louvred Teak Wardrobe Armoire
        const wW = 2.8;
        const wH = 3.6;
        const wD = 1.1;

        // Body Carcass
        const bodyGeo = new THREE.BoxGeometry(wW, wH, wD);
        const body = new THREE.Mesh(bodyGeo, this.darkTeakMaterial);
        body.position.y = wH / 2;
        body.castShadow = true;
        group.add(body);

        // Crown Moulding Top
        const crownGeo = new THREE.BoxGeometry(wW + 0.2, 0.2, wD + 0.15);
        const crown = new THREE.Mesh(crownGeo, this.teakMaterial);
        crown.position.y = wH + 0.1;
        group.add(crown);

        // 3 Louvred Door Panels
        const doorW = (wW - 0.15) / 3;
        for (let d = 0; d < 3; d++) {
          const dx = -wW / 2 + 0.08 + d * doorW + doorW / 2;
          const doorGeo = new THREE.BoxGeometry(doorW - 0.04, wH - 0.4, 0.06);
          const door = new THREE.Mesh(doorGeo, this.teakMaterial);
          door.position.set(dx, wH / 2 - 0.05, wD / 2 + 0.03);
          group.add(door);

          // Keyhole Brass Hardware
          const keyGeo = new THREE.BoxGeometry(0.04, 0.12, 0.02);
          const keyhole = new THREE.Mesh(keyGeo, this.goldBrassMaterial);
          keyhole.position.set(dx + doorW / 3, wH / 2, wD / 2 + 0.07);
          group.add(keyhole);
        }
        break;
      }

      case 'sanctuary_bed': {
        // Malabar Royal Teak Bed & Suite
        const bedW = 3.6;
        const bedD = 3.8;
        const bedH = 0.55;

        // Teak Bed Platform Frame
        const frameGeo = new THREE.BoxGeometry(bedW, 0.3, bedD);
        const bedFrame = new THREE.Mesh(frameGeo, this.darkTeakMaterial);
        bedFrame.position.y = 0.25;
        bedFrame.castShadow = true;
        group.add(bedFrame);

        // Architectural Canted Headboard
        const hbW = bedW + 0.6;
        const hbH = 2.2;
        const hbGeo = new THREE.BoxGeometry(hbW, hbH, 0.18);
        const headboard = new THREE.Mesh(hbGeo, this.teakMaterial);
        headboard.position.set(0, hbH / 2 + 0.2, -bedD / 2 + 0.09);
        headboard.rotation.x = -0.05; // Canted tilt
        headboard.castShadow = true;
        group.add(headboard);

        // Headboard Teak Slat Panels
        for (let s = -hbW / 2 + 0.3; s <= hbW / 2 - 0.3; s += 0.4) {
          const slatGeo = new THREE.BoxGeometry(0.15, hbH - 0.4, 0.06);
          const slat = new THREE.Mesh(slatGeo, this.darkTeakMaterial);
          slat.position.set(s, hbH / 2 + 0.2, -bedD / 2 + 0.19);
          slat.rotation.x = -0.05;
          group.add(slat);
        }

        // Mattress (White Belgian Linen)
        const matMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.9,
        });
        const mattressGeo = new THREE.BoxGeometry(bedW - 0.2, 0.35, bedD - 0.4);
        const mattress = new THREE.Mesh(mattressGeo, matMat);
        mattress.position.set(0, 0.45, 0.1);
        mattress.castShadow = true;
        group.add(mattress);

        // Luxury Pillows
        for (let px of [-0.9, 0.9]) {
          const pillowGeo = new THREE.BoxGeometry(1.2, 0.18, 0.6);
          const pillow = new THREE.Mesh(pillowGeo, matMat);
          pillow.position.set(px, 0.68, -bedD / 2 + 0.7);
          pillow.rotation.x = -0.2;
          group.add(pillow);
        }

        // Nightstand Side Tables
        for (let nx of [-bedW / 2 - 0.45, bedW / 2 + 0.45]) {
          const nsGeo = new THREE.BoxGeometry(0.7, 0.5, 0.6);
          const ns = new THREE.Mesh(nsGeo, this.teakMaterial);
          ns.position.set(nx, 0.25, -bedD / 2 + 0.4);
          group.add(ns);

          // Warm Brass Lamp on Nightstand
          const lampBaseGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.3, 16);
          const lampBase = new THREE.Mesh(lampBaseGeo, this.goldBrassMaterial);
          lampBase.position.set(nx, 0.65, -bedD / 2 + 0.4);
          group.add(lampBase);

          const shadeGeo = new THREE.ConeGeometry(0.25, 0.3, 16);
          const shadeMat = new THREE.MeshBasicMaterial({ color: 0xffedd8 });
          const shade = new THREE.Mesh(shadeGeo, shadeMat);
          shade.position.set(nx, 0.9, -bedD / 2 + 0.4);
          group.add(shade);
        }
        break;
      }
    }

    return group;
  }

  /**
   * Helper for creating detailed chair models
   */
  private createChairMesh(isArmchair = false): THREE.Group {
    const chair = new THREE.Group();
    const cW = isArmchair ? 0.9 : 0.6;
    const cD = isArmchair ? 0.9 : 0.6;
    const cH = 1.0;

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.035, 0.025, 0.45, 12);
    for (let lx of [-cW / 2 + 0.05, cW / 2 - 0.05]) {
      for (let lz of [-cD / 2 + 0.05, cD / 2 - 0.05]) {
        const leg = new THREE.Mesh(legGeo, this.darkTeakMaterial);
        leg.position.set(lx, 0.225, lz);
        leg.castShadow = true;
        chair.add(leg);
      }
    }

    // Seat
    const seatGeo = new THREE.BoxGeometry(cW, 0.06, cD);
    const seat = new THREE.Mesh(seatGeo, this.teakMaterial);
    seat.position.y = 0.48;
    chair.add(seat);

    // Backrest
    const backGeo = new THREE.BoxGeometry(cW, 0.5, 0.05);
    const back = new THREE.Mesh(backGeo, this.teakMaterial);
    back.position.set(0, 0.75, -cD / 2 + 0.03);
    chair.add(back);

    if (isArmchair) {
      // Armrests
      const armGeo = new THREE.BoxGeometry(0.08, 0.04, cD);
      const armL = new THREE.Mesh(armGeo, this.teakMaterial);
      armL.position.set(-cW / 2, 0.68, 0);
      chair.add(armL);

      const armR = new THREE.Mesh(armGeo, this.teakMaterial);
      armR.position.set(cW / 2, 0.68, 0);
      chair.add(armR);
    }

    return chair;
  }
}
