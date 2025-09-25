# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm start` - Start production server

## Architecture Overview

This is a Next.js React application for a 3D hoodie customization experience. The main architecture consists of:

### Core 3D Implementation
- **3D Engine**: Three.js with GLTF model loading (`/public/hoodie-materials/cotton.gltf`)
- **Main Hook**: `components/Hoodie/hooks/useHoodieModel.js` - Orchestrates all 3D managers (115 lines, down from 697)
- **Modular Architecture**: Separated into specialized managers for maintainability:
  - `managers/sceneManager.js` - Scene setup and lighting configuration
  - `managers/cameraManager.js` - Camera controls, views, zoom, and keyboard navigation
  - `managers/textureManager.js` - Texture preloading and management with anisotropic filtering
  - `managers/materialApplicator.js` - Material and color application to meshes
  - `managers/modelLoader.js` - GLTF model loading with custom loading manager
  - `utils/meshUtils.js` - Mesh type identification utilities

### Material System
- **Material Configuration**: `components/Hoodie/config/materialConfig.js` - Defines cotton/teddy/nylon materials with pricing and texture paths
- **Color Configuration**: `components/Hoodie/config/colorConfig.js` - Maps mesh names to customizable parts (body, hoodInterior, zipperDetails)
- **Texture Loading**: Dynamic texture application with fallback handling for missing lining textures

### Component Structure
- **Pages**: Simple Next.js pages (`pages/index.js`, `pages/products.js`)
- **Main Hoodie Component**: `components/Hoodie/Hoodie.js` - Renders 3D model with controls
- **UI Components**: Modular components for customization (ColorCustomization, CameraControls, Material selection, etc.)

### Key Technical Details
- **Mesh Mapping**: The `partMapping` object in colorConfig.js maps specific mesh names from the 3D model to customizable parts
- **Material Application**: The `getMeshPartType` function (now in utils/meshUtils.js) determines which material/texture to apply to each mesh
- **Texture Paths**: Follow pattern `/hoodie-materials/{material}_{type}_{partId}.png`
- **Keyboard Controls**: Arrow keys for rotation, +/- for zoom (handled by CameraManager)
- **Performance**: Texture preloading, anisotropic filtering, and optimized rendering
- **Manager Pattern**: Each manager handles its own lifecycle, cleanup, and specialization
- **Error Handling**: Custom loading manager handles missing textures gracefully

### Pages Structure
- Landing page with Menu, Landingpage component, and Footer
- Products page (separate hoodie experience)
- Global CSS styling in `styles/globals.css`