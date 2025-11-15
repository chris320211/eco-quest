# Sample Sustainability Data for Testing

Below is example content that you can put in a PDF to test the Haiku extraction. You can use any PDF creator tool to convert this to PDF format.

---

# Monthly Sustainability Report 2023

**Company**: EcoTest Industries
**Location**: California, USA
**Report Period**: January 2023 - December 2023

## Monthly Environmental Metrics

| Month | CO₂ Emissions | Plastic Waste | Water Usage | Energy Consumption |
|-------|---------------|---------------|-------------|-------------------|
| January 2023 | 1,200 kg CO2 | 45 lbs | 5,000 gallons | 2,500 kWh |
| February 2023 | 1,150 kg CO2 | 42 lbs | 4,800 gallons | 2,400 kWh |
| March 2023 | 1,300 kg CO2 | 50 lbs | 5,200 gallons | 2,700 kWh |
| April 2023 | 1,250 kg CO2 | 48 lbs | 5,100 gallons | 2,600 kWh |
| May 2023 | 1,280 kg CO2 | 47 lbs | 5,150 gallons | 2,650 kWh |
| June 2023 | 1,320 kg CO2 | 51 lbs | 5,250 gallons | 2,750 kWh |
| July 2023 | 1,400 kg CO2 | 55 lbs | 5,400 gallons | 2,900 kWh |
| August 2023 | 1,380 kg CO2 | 53 lbs | 5,350 gallons | 2,850 kWh |
| September 2023 | 1,290 kg CO2 | 49 lbs | 5,180 gallons | 2,680 kWh |
| October 2023 | 1,260 kg CO2 | 48 lbs | 5,100 gallons | 2,620 kWh |
| November 2023 | 1,220 kg CO2 | 46 lbs | 4,950 gallons | 2,550 kWh |
| December 2023 | 1,180 kg CO2 | 44 lbs | 4,820 gallons | 2,480 kWh |

## Summary

This report contains monthly environmental data for the full year 2023.

### Key Observations:
- Energy consumption peaked in July (2,900 kWh)
- Lowest water usage was in February (4,800 gallons)
- CO₂ emissions ranged from 1,150 kg to 1,400 kg per month
- Plastic waste averaged approximately 48 lbs per month

---

## How to Use This for Testing

### Option 1: Create PDF Manually
1. Copy the content above
2. Paste into Google Docs or Microsoft Word
3. File → Save As → PDF
4. Upload the PDF to EcoQuest

### Option 2: Use Online PDF Converter
1. Copy the content above
2. Go to https://www.markdowntopdf.com/ or similar
3. Paste and convert to PDF
4. Download and upload to EcoQuest

### Expected Results

When you upload this PDF, Haiku should extract:

**Monthly Data**: 12 records (one for each month)
- Year: 2023
- Month: 1-12
- CO₂: 1,200 kg, 1,150 kg, 1,300 kg, etc.
- Plastic: 45 lbs, 42 lbs, 50 lbs, etc.
- Water: 5,000 gal, 4,800 gal, 5,200 gal, etc.
- Energy: 2,500 kWh, 2,400 kWh, 2,700 kWh, etc.

**Annual Data**: 1 record
- Year: 2023
- CO₂: 15,230 kg (sum of all months)
- Plastic: 578 lbs (sum of all months)
- Water: 61,300 gallons (sum of all months)
- Energy: 31,680 kWh (sum of all months)

### Verification Steps

After uploading:

1. **Check Upload Status**:
   - Should show "Processing" initially
   - Changes to "Processed" within 5-30 seconds

2. **View Analysis**:
   - Click "View" button
   - Should see analysis report
   - Monthly records: 12
   - Annual records: 1
   - Years covered: 2023

3. **Export CSV**:
   - Click "CSV" button
   - Should download monthly data
   - Open in Excel/Google Sheets to verify

4. **Check Database** (if you have access):
   ```javascript
   // In MongoDB
   db.extracteddatas.find({ userId: YOUR_USER_ID })

   // Should return document with:
   // - monthlyData: array of 12 objects
   // - annualData: array of 1 object
   // - analysisReport: markdown text
   ```

### Alternative Test: Multiple Years

You can also create a document with multiple years:

```
| Month | CO₂ Emissions | Energy |
|-------|---------------|--------|
| Jan 2022 | 1,100 kg CO2 | 2,300 kWh |
| Feb 2022 | 1,050 kg CO2 | 2,200 kWh |
...
| Jan 2023 | 1,200 kg CO2 | 2,500 kWh |
| Feb 2023 | 1,150 kg CO2 | 2,400 kWh |
...
```

This should result in:
- Monthly records: 24 (12 for each year)
- Annual records: 2 (one for 2022, one for 2023)

### Troubleshooting Test Document

If extraction fails or returns empty data:

1. **Check Date Format**: Ensure dates are clear
   - ✅ Good: "January 2023", "Jan 2023", "2023-01"
   - ❌ Bad: "Q1 2023", "2023 annual"

2. **Check Units**: Include units with values
   - ✅ Good: "1,200 kg CO2", "500 kWh"
   - ❌ Bad: "1200" (no unit)

3. **Check PDF Quality**: Ensure text is selectable
   - Open PDF and try to select text
   - If you can't select it, it might be a scanned image
   - Use PDFs with actual text, not images of text

4. **Check Server Logs**: Look for extraction details
   ```bash
   # Watch server logs
   npm run server

   # Look for:
   # [Upload xxx] Haiku extracted:
   #   - Monthly records: 12
   #   - Annual records: 1
   ```
