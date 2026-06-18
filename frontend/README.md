# Autonomous Driving Object Detection Dashboard

A modern, professional research dashboard for real-time autonomous driving object detection using YOLOE and knowledge graph zero-shot detection capabilities.

## Features

### Core Functionality
- **Video Upload**: Drag-and-drop interface for video file uploads (MP4, AVI, MOV)
- **Configuration Panel**: 
  - Detection mode selection (Seen/Unseen/Both classes)
  - Confidence threshold slider (0.0 - 1.0)
  - Real-time model status indicator
- **Processing State**: 
  - Animated loading screen with progress tracking
  - 5-stage processing pipeline visualization
  - Estimated time remaining calculation
- **Results Dashboard**:
  - Summary metrics card (processing time, frame count, detection counts)
  - Side-by-side video comparison with bounding box preview
  - 8 performance metrics cards (Precision, Recall, mAP50, mAP50-95, FPS, Inference Time, Avg Confidence, Total Objects)
  - Three Recharts visualizations:
    - Detection metrics over frames (Precision, Recall, mAP)
    - Processing speed (FPS) analysis
    - Class distribution pie chart
  - Searchable, sortable detection results table with frame IDs, class names, confidence scores
  - Download section for processed video, PDF report, and metrics CSV

### Design System
- **Dark Theme**: Professional AI research platform aesthetic inspired by NVIDIA, Tesla, and Waymo
- **Glassmorphism**: Semi-transparent cards with backdrop blur effects
- **Color Palette**:
  - Primary: Deep Blue (#3b82f6)
  - Accent: Cyan (#22d3ee)
  - Secondary: Orange (#f59e0b)
  - Seen Classes: Green (#10b981)
  - Unseen Classes: Pink (#ec4899)
- **Animations**: Smooth transitions and animations via Framer Motion
- **Responsive**: Mobile-first design with breakpoints for tablet and desktop

## Project Structure

```
app/
├── page.tsx                 # Main dashboard page
├── layout.tsx              # Root layout with dark theme
└── globals.css             # Design tokens and theme

components/
├── layout/
│   ├── Header.tsx          # Title, subtitle, feature badges
│   └── Layout.tsx          # Main container wrapper
├── upload/
│   └── VideoUpload.tsx     # Drag-and-drop video upload
├── config/
│   └── ConfigPanel.tsx     # Detection mode & threshold config
├── detection/
│   ├── DetectionButton.tsx # Start detection button
│   └── LoadingState.tsx    # Processing animation & progress
├── results/
│   ├── ResultsCard.tsx     # Summary metrics display
│   ├── VideoComparison.tsx # Two-panel video comparison
│   └── BoundingBoxPreview.tsx # Example bounding boxes
├── metrics/
│   ├── MetricsGrid.tsx     # 8 metric cards display
│   ├── PerformanceCharts.tsx # 3 Recharts visualizations
│   └── DetectionTable.tsx  # Searchable results table
└── download/
    └── DownloadSection.tsx # Export buttons

lib/
├── api.ts                  # API integration scaffolding
├── mockData.ts            # Mock detection results
└── utils.ts               # Utility functions
```

## State Management

The dashboard uses React hooks for state management:
- `pageState`: Tracks view (idle → loading → results)
- `selectedFile`: Current uploaded video file
- `config`: Detection configuration (mode, threshold)
- `progress`: Processing progress percentage
- `currentStep`: Current processing step (1-5)
- `estimatedTimeRemaining`: Estimated seconds until completion
- `jobId`: Unique job identifier for the detection run

## Data Flow

1. **Upload Phase**:
   - User selects or drops a video file
   - Component validates file type and displays file info
   - Page transitions to configuration view

2. **Configuration Phase**:
   - User adjusts detection mode and confidence threshold
   - Can modify model settings before processing

3. **Processing Phase**:
   - "Start Detection" button triggers simulated processing
   - LoadingState overlay shows 5-stage pipeline progress
   - Progress bar, step indicators, and time estimation update in real-time

4. **Results Phase**:
   - Complete results dashboard displays with all metrics
   - Mock data shows example detection results
   - User can download processed video, report, or metrics CSV
   - "Process Another Video" button resets to upload phase

## Mock Data

The dashboard uses mock detection results from `/lib/mockData.ts`:
- Processing time: 45.3 seconds
- Total frames: 1,240
- Objects detected: 3,847 (1,523 seen, 2,324 unseen classes)
- Performance metrics with sample data
- 8 realistic detection entries for table display
- Class distribution data for pie chart

## API Integration (Ready for Backend Connection)

The `/lib/api.ts` file provides scaffolding for backend integration:

```typescript
// Upload and detect video
uploadAndDetectVideo(file: File, config: ConfigParams): Promise<DetectionResponse>

// Get detection results for a job
getDetectionResults(jobId: string): Promise<DetectionResponse>

// Get processed video file
getProcessedVideo(jobId: string): Promise<Blob>

// Get metrics data for a job
getMetricsData(jobId: string): Promise<MetricsData>
```

Currently returns mock data. To connect to a FastAPI backend:
1. Replace mock implementations with actual API calls
2. Update endpoint URLs to your backend server
3. Adjust request/response formats as needed

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with custom design tokens
- **UI Components**: shadcn/ui components
- **Data Visualization**: Recharts (3 charts)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Installation & Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000 in browser
```

The dev server supports hot module replacement (HMR) for instant updates during development.

## Customization

### Theme Colors

Edit the OKLCH color values in `/app/globals.css`:
- Primary blues: `oklch(0.60 0.2 260)`
- Cyan accents: `oklch(0.68 0.22 280)`
- Orange highlights: `oklch(0.75 0.25 20)`

### Mock Processing Duration

In `/app/page.tsx`, adjust `totalDuration` in `handleStartDetection()`:
```typescript
const totalDuration = 3000; // milliseconds
```

### Results Data

Update `/lib/mockData.ts` to change metrics, detection entries, and class distributions used in the results view.

## Browser Compatibility

- Modern browsers with ES2020+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Requires JavaScript enabled
- Supports mobile and tablet viewports

## Performance Notes

- Lazy loads chart components via React
- Optimizes animations with Framer Motion's GPU-accelerated transforms
- Uses `next/image` for potential future image assets
- Responsive design adapts to viewport size

## Next Steps for Production

1. **Connect Backend**: Update `/lib/api.ts` to call your FastAPI detection service
2. **Add Authentication**: Implement user authentication if needed
3. **Database Integration**: Store detection results and job history
4. **File Storage**: Implement video file storage (S3, Blob storage, etc.)
5. **Error Handling**: Add comprehensive error handling and user feedback
6. **Logging**: Implement application logging and monitoring
7. **Testing**: Add unit tests for components and integration tests for flows

## Troubleshooting

### Videos not uploading
- Check file format (MP4, AVI, MOV only)
- Verify file size is under 2GB
- Check browser console for error messages

### Charts not rendering
- Ensure Recharts and dependencies are installed
- Check console for CSS loading errors
- Verify data format matches Recharts expectations

### Slow performance
- Check for large mock data arrays
- Profile with browser DevTools
- Consider virtualizing the detection table for large datasets

## License

Built with v0 - Vercel's AI-powered assistant for web development.
