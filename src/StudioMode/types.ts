// Studio Mode Type Definitions

export type SectionId = 'entrance' | 'doors' | 'dining' | 'sofas' | 'wardrobes' | 'bed_sanctuary';

export interface StudioProductSpecs {
  woodType: string;
  grade: string;
  dimensions: string;
  thickness: string;
  finish: string;
  color: string;
  weight: string;
  customization: string;
  availability: string;
}

export interface StudioProduct {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  categorySlug: string;
  section: SectionId;
  sectionTitle: string;
  startingPrice: number | null;
  coverImage: string;
  images: string[];
  description: string;
  specifications: StudioProductSpecs;
  displayType: 'door' | 'dining_table' | 'sofa_suite' | 'chair_set' | 'wardrobe' | 'sanctuary_bed';
  // 3D position in the showroom
  position: { x: number; y: number; z: number };
  rotationY: number; // in radians
  scale?: { x: number; y: number; z: number };
  pedestal?: boolean;
}

export interface SectionInfo {
  id: SectionId;
  title: string;
  subtitle: string;
  posZ: number; // Target Z coordinate for teleport
  iconName: string;
}

export type CameraMode = 'walk' | 'explore';
