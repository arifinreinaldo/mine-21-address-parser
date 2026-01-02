# Address Parser - Vercel Project Plan

## Project Overview
A web application to parse Indonesian addresses from Excel files and enrich them with latitude/longitude coordinates using Mapbox Geocoding API.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS
- **Excel Processing**: xlsx (SheetJS)
- **Geocoding**: Mapbox Geocoding API
- **Language**: TypeScript

## Features
1. **File Upload**: Drag & drop or click to upload Excel files (.xlsx, .xls)
2. **Preview**: Display uploaded data in a table before processing
3. **Geocoding**: Parse addresses and fetch lat/long from Mapbox
4. **Progress Indicator**: Show processing status with progress bar
5. **Download**: Export enriched Excel file with lat/long columns

## Project Structure
```
address-parser/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main upload page
│   ├── globals.css         # Global styles
│   └── api/
│       └── geocode/
│           └── route.ts    # Mapbox geocoding endpoint
├── components/
│   ├── FileUpload.tsx      # Drag & drop upload component
│   ├── DataPreview.tsx     # Excel data table preview
│   ├── ProcessingStatus.tsx # Progress indicator
│   └── DownloadButton.tsx  # Download result button
├── lib/
│   ├── excel.ts            # Excel read/write utilities
│   └── mapbox.ts           # Mapbox API client
├── types/
│   └── index.ts            # TypeScript interfaces
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── .env.local              # MAPBOX_ACCESS_TOKEN
```

## API Design

### POST /api/geocode
Geocodes a single address using Mapbox.

**Request:**
```json
{
  "address": "Jl Cideng Timur, Jakarta"
}
```

**Response:**
```json
{
  "latitude": -6.1751,
  "longitude": 106.8272,
  "formatted_address": "Jalan Cideng Timur, Jakarta, Indonesia"
}
```

## User Flow
1. User opens the app
2. User uploads an Excel file with an "address" column
3. App displays preview of the data
4. User clicks "Process" button
5. App iterates through rows, calling Mapbox API for each address
6. Progress bar shows completion status
7. User downloads the enriched Excel file with lat/long columns

## Environment Variables
```
MAPBOX_ACCESS_TOKEN=pk.xxxxx
```

## Rate Limiting Considerations
- Mapbox free tier: 100,000 requests/month
- Implement client-side throttling (e.g., 10 requests/second)
- Add batch processing with delays between requests

## Implementation Phases

### Phase 1: Project Setup
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up project structure

### Phase 2: File Upload & Preview
- [ ] Create FileUpload component with drag & drop
- [ ] Implement Excel parsing with xlsx library
- [ ] Build DataPreview table component

### Phase 3: Geocoding Integration
- [ ] Create Mapbox geocoding API route
- [ ] Implement address processing logic
- [ ] Add progress tracking

### Phase 4: Export & Download
- [ ] Generate enriched Excel file
- [ ] Implement file download functionality

### Phase 5: Polish & Deploy
- [ ] Add error handling and validation
- [ ] Improve UI/UX with loading states
- [ ] Deploy to Vercel

## Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "xlsx": "^0.18.5",
    "react-dropzone": "^14.2.3"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

## Estimated Timeline
- Phase 1: 1 hour
- Phase 2: 2 hours
- Phase 3: 2 hours
- Phase 4: 1 hour
- Phase 5: 1 hour
- **Total: ~7 hours**

---

Ready to start implementation? Run:
```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*"
```
