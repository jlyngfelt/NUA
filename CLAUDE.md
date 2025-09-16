# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the Next.js development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server

## Project Architecture

This is a Next.js application for NUA, a 3D hoodie customization platform. The project structure follows Next.js conventions with pages-based routing.

### Core Structure

- `/pages/` - Next.js pages with file-based routing
  - `_app.js` - Application wrapper with global CSS imports
  - `index.js` - Homepage with image showcase and navigation
  - `products.js` - Product customization page featuring the 3D hoodie viewer
- `/components/` - Reusable React components
  - `Hoodie.js` - Complex 3D viewer component using Three.js
  - `Menu/` - Navigation component with modular CSS
  - `Footer/` - Footer component with modular CSS
- `/styles/` - Global stylesheets
- `/public/` - Static assets including 3D models and images

### Key Technologies

- **Next.js 15** - React framework with file-based routing
- **Three.js** - 3D graphics library for the hoodie viewer
- **React 19** - UI library
- **CSS Modules** - Component-scoped styling

### 3D Hoodie Viewer (`components/Hoodie.js`)

The core feature is a sophisticated 3D hoodie viewer built with Three.js:

- Loads GLTF 3D models from `/public/nua hoodie green test/`
- Features studio-quality lighting setup with multiple directional lights
- Includes orbit controls for mouse interaction
- Provides preset camera views (Front, 3/4 Front, Back, 3/4 Back)
- Implements zoom controls with reasonable limits
- Uses high-quality rendering settings (shadows, tone mapping, antialiasing)
- Camera positioning is automatically calculated based on model bounding box

### Component Architecture

Components use CSS Modules for styling (`ComponentName.module.css`) and follow a consistent structure with reusable Menu and Footer components across pages.

### Static Assets

The project expects 3D model assets in GLTF format in the `/public/` directory. Currently configured to load "nua hoodie green test.gltf" for the hoodie viewer.