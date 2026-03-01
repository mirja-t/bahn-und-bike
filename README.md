# Bahn & Bike

## Description of the App

This program displays train lines from Berlin that allow carrying a bike and how they are connected to long distance cycling routes.
There are good apps for getting train connections and for planning and tracking cycling trips, but little to bring them together. This app is meant to bridge the gap and make it easier to plan a trip when you have to bring bike and train connections together.

## Technical Architecture

### Frontend Stack

**Core Technologies:**

- **React 19** with **TypeScript** - Modern React with strict type safety
- **Vite** - Fast build tool and dev server
- **Redux Toolkit** - State management with async thunks
- **SCSS** - Styled components and theming

**Key Libraries:**

- **Framer Motion** - Advanced animations and transitions
- **React Router** - Client-side routing

### Backend & Infrastructure

- **PHP Slim Framework** - REST API endpoints
- **MySQL Database** - Relational data storage for train/cycling route data
- **Docker Compose** - Containerized development environment
    - PHP-Apache container for API
    - MySQL container with health checks
    - Volume persistence for database

### Development Tooling

- **ESLint + TypeScript ESLint** - Code linting with strict rules
- **Vitest** - Unit testing framework
- **Storybook** - Component development and testing
- **Simple Git Hooks** - Pre-commit checks

### Custom Architecture Patterns

**State Management:**

- Feature-based Redux slices (`TrainroutesSlice`, `VeloroutesSlice`, `AppSlice`, `DestinationDetailsSlice`)
- Async thunks for API calls with loading/error states
- Cross-slice communication for route intersections

**Custom Hooks:**

- `useStopNames` - Batch fetch destination names with caching
- `useFetchBatch` - Generic batch API fetching with hashmap preservation
- `useResponsiveSize` - Dynamic sizing with ResizeObserver
- `useZoom` - Map zoom and pan controls

**Data Flow:**

1. API calls via async thunks
2. Coordinate transformation (lat/lng → SVG coordinates)
3. Route processing and grouping
4. Dynamic SVG rendering with animations

## Dynamic SVG Visualization

![dynamically rendered polylines](./assets/images/trainlines.png "Trainlines rendered dynamically")

**Train Routes:**

- Coordinate data converted to SVG polylines
- CSS dasharray animations for visual feedback
- Tree structure with Berlin as root destination
- Interactive hover and selection states

![dynamically rendered polylines](./assets/images/cyclingpath.png "Cycling routes rendered dynamically")

**Cycling Routes:**

- SVG paths with calculated Bézier curves
- Custom bezier calculation based on previous/next stop positions
- Dynamic clipping based on longest route distance
- Intersection detection with train lines

## API Endpoints

The API provides several REST endpoints (examples based on codebase analysis):

- `GET /destinations/ids[]=123&ids[]=456` - Batch destination lookup
- `GET /trainstops/{startId}` - Direct train connections
- `GET /connections/{startId}` - Train connections with transfers
- `GET /connection/{start}&{end}` - Point-to-point connections
- `GET /veloroutes/ids[]=123&ids[]=456` - Cycling routes by station IDs

## Features

- Show all direct train routes from Berlin within chosen time limit
- Show all cycling routes that intersect with selected train lines
- Display available train stations along cycling route segments
- Show cycling route combinations and connections
- Support for train routes with connections/transfers
- Multi-language support (German/English)
- Interactive map with zoom and pan controls
- Mobile-responsive design

## Development Setup

### Prerequisites

- Node.js 22+ with npm
- Docker and Docker Compose (for backend API - not public)

### Getting Started

**Frontend Development:**

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**Storybook Development:**

```bash
# Start Storybook server
npm run storybook
```

Storybook runs on `http://localhost:6006` and provides:

- Component documentation and examples
- Interactive component testing environment
- Visual regression testing with Chromatic
- Accessibility (a11y) addon for compliance testing
- Integration with Vitest for component tests

**Backend API (Not public):**

```bash
# Start containerized backend services
docker compose up --build

# API runs on http://localhost:8080
# PHPMyAdmin available on http://localhost:8081
```

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build production bundle (includes type checking and linting)
- `npm run preview` - Preview production build locally
- `npm run storybook` - Start Storybook development server
- `npm run build-storybook` - Build static Storybook for deployment
- `npm run test` - Run Vitest unit tests
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint code linting
- `npm run check` - Run both typecheck and lint

# Live Site

https://www.bahn-und-bike.info
