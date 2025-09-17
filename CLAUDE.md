# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (Next.js)
- `npm run build` - Build for production
- `npm start` - Start production server

## Project Architecture

This is a Next.js e-commerce application for customizable hoodie products with 3D visualization.

### Key Technologies
- **Next.js** - React framework with pages router
- **Three.js** - 3D graphics and hoodie model rendering
- **React** - UI components and state management

### Directory Structure
- `pages/` - Next.js pages (index.js, products.js, _app.js)
- `components/` - Reusable React components organized by feature
- `styles/` - Global CSS styles
- `public/` - Static assets including 3D models and images

### Core Components

**Hoodie Component** (`components/Hoodie/`)
- Main 3D hoodie visualization component
- `Hoodie.js` - Main component with color state management
- `hooks/useHoodieModel.js` - Complex 3D scene setup, lighting, model loading, and color customization logic
- `components/ColorCustomization.js` - Color picker interface
- `components/CameraControls.js` - 3D view controls (front, back, 3/4 angles, zoom)
- `config/colorConfig.js` - Color configurations and texture mappings

**3D Model Integration**
- GLTF model loading from `/nua_hoodie_2_colourway 2/nua_hoodie_2_colourway.gltf`
- Advanced lighting setup with key, fill, back, and side lights for studio-quality presentation
- Material customization system that handles different hoodie parts (body, hood interior, zipper details)
- Camera controls with orbit functionality and predefined viewing angles

**Layout Components**
- `Menu/Menu.js` - Navigation header
- `Footer/Footer.js` - Site footer

### Development Notes

**3D Model Handling**
- The hoodie model uses GLTF format and requires specific mesh naming conventions
- Color customization works by traversing the 3D scene and updating materials based on mesh names
- Different material handling for metallic parts (zippers) vs fabric parts
- Texture preloading system for performance

**Component Organization**
- Each major component has its own directory with associated CSS modules
- Hooks are separated for reusability (especially the complex 3D logic)
- Configuration files separate data from logic

**Styling**
- CSS Modules used for component-specific styles
- Global styles in `styles/globals.css`