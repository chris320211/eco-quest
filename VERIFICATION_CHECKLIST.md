# Document Upload & Haiku Analysis Verification Checklist

This document outlines the complete data flow and verification points for document upload, Haiku analysis, and database storage.

## Complete Data Flow

```
┌─────────────────┐
│ User uploads    │
│ PDF document    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ Step 1: File Upload (uploadController.ts:104-149)      │
│ ------------------------------------------------        │
│ • Multer saves file to /uploads directory               │
│ • Creates Upload document in MongoDB                    │
│   - fileName, fileType, fileSize, filePath              │
│   - status: 'processing'                                │
│   - userId (linked to current user)                     │
│ • Returns upload ID to frontend                         │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ Step 2: Background Processing (uploadController:54-113)│
│ ------------------------------------------------        │
│ processFileWithHaiku() is called asynchronously         │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ Step 3: File Parsing (fileParser.ts:22-41)             │
│ ------------------------------------------------        │
│ • For PDFs: Uses pdf-parse library                      │
│ • Extracts raw text from document                       │
│ • Returns document text string                          │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ Step 4: Haiku Analysis (haikuAnalysisService.ts:199-242)│
│ ------------------------------------------------        │
│ extractSustainabilityData():                            │
│ • Sends document text to Claude Haiku 4.5               │
│ • Prompt asks for MONTHLY and ANNUAL CSV data           │
│ • Parses response for two CSV blocks:                   │
│   - MONTHLY_DATA_CSV (monthly records)                  │
│   - ANNUAL_DATA_CSV (annual totals)                     │
│ • Returns: { monthlyData[], annualData[], rawResponse } │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ Step 5: Report Generation (haikuAnalysisService.ts:247)│
│ ------------------------------------------------        │
│ generateAnalysisReport():                               │
│ • Creates markdown report with:                         │
│   - Headline summary                                    │
│   - Annual totals table                                 │
│   - Data coverage metrics                               │
│   - Year-over-year comparison                           │
│   - Key insights                                        │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ Step 6: Database Storage (uploadController:86-94)      │
│ ------------------------------------------------        │
│ ExtractedData.create():                                 │
│ • Saves to MongoDB 'extracteddatas' collection          │
│ • Document structure:                                   │
│   {                                                     │
│     uploadId: ObjectId (references Upload)              │
│     userId: ObjectId (references User)                  │
│     monthlyData: [                                      │
│       {                                                 │
│         year, month, month_label,                       │
│         co2_kg, plastic_lbs, water_gal, energy_kwh      │
│       }                                                 │
│     ],                                                  │
│     annualData: [                                       │
│       {                                                 │
│         year,                                           │
│         co2_kg, plastic_lbs, water_gal, energy_kwh      │
│       }                                                 │
│     ],                                                  │
│     analysisReport: "markdown text...",                 │
│     rawResponse: "Haiku's full response...",            │
│     extractedAt: Date                                   │
│   }                                                     │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ Step 7: Update Upload Status (uploadController:97-100) │
│ ------------------------------------------------        │
│ • Updates Upload document:                              │
│   - status: 'processed'                                 │
│   - processedAt: current timestamp                      │
└─────────────────────────────────────────────────────────┘
```

## Database Collections

### 1. Uploads Collection
**Collection**: `uploads`
**Purpose**: Track uploaded files and their processing status

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Who uploaded it
  fileName: "report.pdf",     // Original filename
  fileType: "application/pdf",
  fileSize: 1024000,          // Size in bytes
  filePath: "/path/to/file",  // Server file path
  status: "processed",        // processing | processed | error
  errorMessage: null,         // Error if status='error'
  uploadedAt: Date,
  processedAt: Date
}
```

### 2. ExtractedData Collection
**Collection**: `extracteddatas`
**Purpose**: Store Haiku's extracted sustainability data

```javascript
{
  _id: ObjectId,
  uploadId: ObjectId,         // Links to Upload document
  userId: ObjectId,           // Who owns this data
  monthlyData: [
    {
      year: 2023,
      month: 1,
      month_label: "January",
      co2_kg: 1200.5,
      plastic_lbs: 45.2,
      water_gal: 5000,
      energy_kwh: 2500
    },
    // ... more months
  ],
  annualData: [
    {
      year: 2023,
      co2_kg: 14400.5,
      plastic_lbs: 540.2,
      water_gal: 58000,
      energy_kwh: 29500
    }
  ],
  analysisReport: "# Sustainability Analysis Report\n\n...",
  rawResponse: "MONTHLY_DATA_CSV\n```csv\n...",
  extractedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Verification Steps

### 1. Check Upload Tracking

```bash
# In MongoDB shell or Compass
db.uploads.find({ userId: YOUR_USER_ID }).sort({ uploadedAt: -1 })
```

**Expected**: You should see documents with:
- ✅ `fileName` matching your uploaded file
- ✅ `status: 'processed'` (after processing completes)
- ✅ `filePath` pointing to file in uploads/ directory
- ✅ `processedAt` timestamp when complete

### 2. Check Extracted Data Storage

```bash
# In MongoDB shell or Compass
db.extracteddatas.find({ userId: YOUR_USER_ID }).sort({ extractedAt: -1 })
```

**Expected**: You should see documents with:
- ✅ `uploadId` matching the Upload document's _id
- ✅ `monthlyData` array with extracted monthly records
- ✅ `annualData` array with yearly totals
- ✅ `analysisReport` containing markdown text
- ✅ `rawResponse` containing Haiku's full output

### 3. Verify API Endpoints

#### Get Extraction by Upload ID
```bash
GET /api/extractions/:uploadId
Authorization: Bearer YOUR_TOKEN
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "uploadId": "...",
    "monthlyData": [...],
    "annualData": [...],
    "analysisReport": "...",
    "extractedAt": "2025-11-15T..."
  }
}
```

#### Export as CSV
```bash
GET /api/extractions/:uploadId/export/monthly
Authorization: Bearer YOUR_TOKEN
```

**Expected**: Downloads CSV file with monthly data

### 4. Check Server Logs

When a file is uploaded, you should see logs like:

```
[Upload 674e1234abcd5678] Starting Haiku processing...
[Upload 674e1234abcd5678] File: /path/to/uploads/..., Type: application/pdf
[Upload 674e1234abcd5678] Step 1: Parsing file...
[Upload 674e1234abcd5678] Extracted 5432 characters of text
[Upload 674e1234abcd5678] Step 2: Calling Claude Haiku API...
[Upload 674e1234abcd5678] Haiku extracted:
  - Monthly records: 12
  - Annual records: 1
[Upload 674e1234abcd5678] Step 3: Generating analysis report...
[Upload 674e1234abcd5678] Report length: 1523 characters
[Upload 674e1234abcd5678] Step 4: Saving to database...
[Upload 674e1234abcd5678] Saved ExtractedData with ID: 674e1234abcd9999
[Upload 674e1234abcd5678] ✅ Successfully processed!
```

### 5. Frontend Verification

1. **Upload Page**:
   - ✅ File uploads successfully
   - ✅ Status shows "Processing" → "Processed"
   - ✅ "View" button appears when processed
   - ✅ "CSV" button downloads data

2. **Analysis Dialog**:
   - ✅ Shows analysis report
   - ✅ Displays monthly record count
   - ✅ Shows years covered
   - ✅ Export buttons work

## Troubleshooting

### Upload Creates but Doesn't Process

**Check**:
1. Is `ANTHROPIC_API_KEY` set in `.env`?
2. Check server logs for errors
3. Verify file is a supported type (PDF)

```bash
# Check if Anthropic SDK is installed
npm list @anthropic-ai/sdk

# Check environment variable
echo $ANTHROPIC_API_KEY
```

### Haiku Returns Empty Data

**Possible Causes**:
1. Document doesn't contain monthly data with clear dates
2. Metrics don't have recognizable units
3. Data is quarterly/annual only (not monthly)

**Solution**:
- Check `rawResponse` field in database to see Haiku's full output
- Verify document has monthly data like "January 2023: 500 kWh"

### Database Save Fails

**Check**:
1. MongoDB connection is active
2. User has write permissions
3. Data matches schema (check logs for validation errors)

```bash
# Test MongoDB connection
mongosh "YOUR_MONGODB_URI"

# Check collections exist
db.getCollectionNames()
```

### File Not Found Error

**Check**:
1. `uploads/` directory exists and is writable
2. File path is absolute, not relative
3. Multer is saving files correctly

```bash
# Check uploads directory
ls -la uploads/

# Verify file permissions
chmod 755 uploads/
```

## Expected Haiku Response Format

Haiku should return text like this:

```
MONTHLY_DATA_CSV
```csv
year,month,month_label,co2_kg,plastic_lbs,water_gal,energy_kwh
2023,1,January,1200.5,45.2,5000,2500
2023,2,February,1150.0,42.0,4800,2400
...
```

ANNUAL_DATA_CSV
```csv
year,co2_kg,plastic_lbs,water_gal,energy_kwh
2023,14400.5,540.2,58000,29500
```
```

## Test Document Requirements

For successful extraction, your test document should contain:

1. **Monthly dates**: "January 2023", "Jan 2023", "2023-01"
2. **Metrics with units**:
   - CO₂: "500 kg CO2", "1.2 metric tons CO2e"
   - Plastic: "25 lbs plastic", "15 kg packaging"
   - Water: "1000 gallons", "500 liters", "2 m³"
   - Energy: "2500 kWh", "2.5 MWh"

3. **Format**: PDF with readable text (not scanned images)

## Success Criteria

✅ **Upload is tracked**:
- Upload document created in MongoDB
- File saved to uploads/ directory
- Status updates from 'processing' to 'processed'

✅ **Haiku analyzes correctly**:
- API call succeeds (check server logs)
- Returns monthly and annual data
- CSV parsing works correctly

✅ **Data is stored**:
- ExtractedData document created in MongoDB
- monthlyData and annualData arrays populated
- analysisReport generated
- Links to Upload via uploadId

✅ **Data is retrievable**:
- GET /api/extractions/:uploadId returns data
- CSV export works
- Frontend displays analysis correctly
