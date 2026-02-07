# Bahn & Bike - AI Agent Instructions

## Project Overview

This is a full-stack transportation visualization app combining German train lines from Berlin that allow bikes with long-distance cycling routes. The app uses dynamic SVG rendering to visualize train connections and cycling paths on a map.

## Architecture

- **Frontend**: React 19 + TypeScript, Redux Toolkit, Vite build system
- **Backend**: PHP Slim framework API (`/api`) with MySQL database
- **Development**: Docker Compose with PHP-Apache, MySQL, and PHPMyAdmin services

## Key Technical Patterns

## Coding style

- TypeScript: strict types, no `any` unless justified

### State Management (Redux Slices)

The app uses feature-based Redux slices:

- `AppSlice.tsx`: Global app state (theme, language)
- `TrainroutesSlice.tsx`: Train route data, connections, active selections
- `VeloroutesSlice.tsx`: Cycling route data and train line intersections

State shape follows this pattern: `{ app, trainroutes, veloroutes }` in [store.tsx](src/store.tsx).

### Data Flow Architecture

1. **API calls** via async thunks (e.g., `loadVeloroutes`, `loadTrainroutesAlongVeloroute`)
2. **Coordinate transformation** in [utils/addXYValues.js](src/utils/addXYValues.js) (lat/lng → SVG coordinates)
3. **Route processing** via [utils/makeVeloRoute.js](src/utils/makeVeloRoute.js) for grouping stops into route segments
4. **SVG rendering** with custom path calculations and CSS dasharray animations

### Map Visualization System

- Train stops converted to tree structure with Berlin as root
- Dynamic SVG polylines for train routes with coordinates from database
- Cycling routes rendered as SVG paths with calculated bezier curves
- Map clipping calculated via custom hook based on longest distance from starting point

## Development Workflows

### Commands

- `npm run dev` - Start Vite dev server
- `npm run build` - TypeScript compilation + Vite build
- `docker-compose up` - Full stack with API (port 8080) and DB (port 3307)

### Environment Setup

API configuration uses environment variables in [src/config/config.tsx](src/config/config.tsx):

- `VITE_API_DEV` / `VITE_API_PROD` - API endpoints
- `VITE_API_AUTH` - Basic auth credentials

### File Conventions

- **Component structure**: Stateless components in `stateless/`, feature components in dedicated folders
- **Type definitions**: In each component file
- **File types**: Utils are `.ts`, components/slices are `.tsx`
- **SCSS styling**: Component-level `.scss` files, [App.scss](src/App.scss) for global styles
- **API structure**: REST endpoints in [api/app/routes.php](api/app/routes.php) (`/lang`, `/destination/{id}`, `/veloroutes/{qry}`)

## Critical Integration Points

### Frontend-Backend Communication

- API uses Basic Auth headers from config
- Async thunks handle all API calls with error states
- Data transformations happen in utils before Redux storage

### SVG Coordinate System

Custom coordinate transformation pipeline:

1. Database lat/lng coordinates
2. [addXYValues.js](src/utils/addXYValues.js) converts to SVG x/y
3. [getRoutePath.js](src/utils/getRoutePath.js) generates SVG path strings
4. Custom hooks calculate bezier curves for smooth route rendering

### State Cross-Connections

Routes and veloroutes are interconnected:

- Selecting a train route loads intersecting cycling routes
- Clicking cycling route segments loads available train stations
- State resets via `resetState()` function in [App.tsx](src/App.tsx) on navigation

## Domain-Specific Logic

- **Stop name normalization**: Removes German railway terms (`Bahnhof`, `Hbf`, etc.) via [utils/utils.js](src/utils/utils.js)
- **Route grouping**: Cycling routes split into segments based on train line intersections
- **Tree data structures**: Train connections organized hierarchically from Berlin starting point
