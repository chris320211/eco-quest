import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const EXTRACTION_PROMPT = `You are a data extraction and normalization assistant for a sustainability analytics platform.

GOAL
You will read one or more sustainability-related files (text from reports, PDFs, Excel/CSV exports, etc.) and extract ONLY monthly environmental metrics, then compute annual totals by summing those monthly values.

We care about four metrics:
- CO₂ emissions
- Plastic waste
- Water usage
- Energy usage

You must:
1. Extract monthly values for these metrics.
2. Normalize units to a standard set.
3. Output a clean MONTHLY data table.
4. Aggregate those monthly records into ANNUAL totals.
5. Output a separate ANNUAL data table.

INPUT
You will receive arbitrary text representing one or more files. It may include:
- Tables
- CSV-like sections
- Narrative paragraphs
- Monthly, quarterly, or annual summaries

You must ONLY create records when:
- A value corresponds clearly to a specific month and year (e.g., "January 2021", "Jan 2021", "2021-01", "2021-01-01").
- You can identify both the metric and its unit.

If a value is for a quarter (Q1 2023) or a full year (2023 total) and not broken down by month, DO NOT create monthly records from it. Ignore such aggregate-only data for this task.

STANDARD UNITS
Normalize everything into these units:

- CO₂ emissions → kilograms (kg_co2)
- Plastic waste → pounds (plastic_lbs)
- Water usage → gallons (water_gal)
- Energy usage → kilowatt-hours (energy_kwh)

UNIT CONVERSIONS
Use these conversions when needed:

- 1 metric ton CO₂e = 1,000 kg CO₂e
- 1 tonne (t) = 1,000 kg
- 1 short ton = 2,000 lbs
- 1 lb = 1 pound (no conversion)
- 1 kg of plastic ≈ 2.20462 lbs (if you must convert)
- 1 m³ of water ≈ 264.172 gallons
- 1 liter of water ≈ 0.264172 gallons
- 1 MWh = 1,000 kWh
- 1 kWh = 1 kWh (no conversion)

If you cannot confidently convert a value to the standard unit, DO NOT include it in the structured data.

WHAT TO EXTRACT
For each monthly entry, look for:

- A clear month + year (e.g., "January 2020", "Jan 2020", "2020-01", "2020-01-01").
- One or more numeric values associated with:
  - CO₂ emissions (CO₂, GHG, greenhouse gas emissions, carbon footprint)
  - Plastic waste (plastic use, packaging waste, plastic disposed)
  - Water usage (water consumption, gallons used)
  - Energy usage (electricity, power usage, kWh, MWh)

STEP-BY-STEP LOGIC
1. Scan the text for any section that looks like a table or monthly listing.
2. For each row/line that looks like a month:
   a. Parse the month and year (e.g., "January 2020" → year=2020, month=1).
   b. Identify each metric present (CO₂, plastic, water, energy).
   c. Capture the numeric value and its unit.
   d. Convert the value into the standard unit.
   e. Create a monthly record for that month.
3. After processing all text:
   - Build annual totals by summing the monthly values for each year and each metric.
   - Only use monthly data YOU extracted (do not mix in any annual/quarterly totals from the text).

OUTPUT FORMAT (IMPORTANT)
You MUST output exactly TWO CSV tables, clearly separated, so they can be saved as two different files.

1) MONTHLY DATA FILE

First, output a header line:

MONTHLY_DATA_CSV

Then, on the next line, start a CSV code block with this exact header row:

\`\`\`csv
year,month,month_label,co2_kg,plastic_lbs,water_gal,energy_kwh
\`\`\`

Then list each monthly record, one per line. Use empty string or "0" if a metric is not available for that month.

Example:

MONTHLY_DATA_CSV
\`\`\`csv
year,month,month_label,co2_kg,plastic_lbs,water_gal,energy_kwh
2020,1,January,1200.5,45.2,5000,2500
2020,2,February,1150.0,42.0,4800,2400
2020,3,March,1300.0,50.0,5200,2700
\`\`\`

2) ANNUAL DATA FILE

After the monthly CSV block, output a blank line, then:

ANNUAL_DATA_CSV

Then, on the next line, start a CSV code block with this exact header row:

\`\`\`csv
year,co2_kg,plastic_lbs,water_gal,energy_kwh
\`\`\`

Then list each annual total, computed by summing the monthly values for each metric.

Example:

ANNUAL_DATA_CSV
\`\`\`csv
year,co2_kg,plastic_lbs,water_gal,energy_kwh
2020,14400.5,540.2,58000,29500
2021,15600.0,580.0,62000,31000
\`\`\`

IMPORTANT RULES
- Do NOT include any commentary or explanation outside these two CSV blocks.
- Do NOT add extra text between the label and the CSV block.
- The CSV must be valid (no missing commas, no extra quotes unless necessary).
- If you find no monthly data at all, output empty CSV blocks with just the headers.
- ONLY extract data you are confident about. If uncertain, omit that data point.

Now process the following document text:`;

interface MonthlyData {
  year: number;
  month: number;
  month_label: string;
  co2_kg: number;
  plastic_lbs: number;
  water_gal: number;
  energy_kwh: number;
}

interface AnnualData {
  year: number;
  co2_kg: number;
  plastic_lbs: number;
  water_gal: number;
  energy_kwh: number;
}

export interface ExtractionResult {
  monthlyData: MonthlyData[];
  annualData: AnnualData[];
  rawResponse: string;
}

/**
 * Parse CSV text into structured data
 */
function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split('\n');
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const data: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: any = {};

    headers.forEach((header, index) => {
      const value = values[index];
      // Convert numeric strings to numbers
      if (value && !isNaN(Number(value))) {
        row[header] = Number(value);
      } else {
        row[header] = value || '';
      }
    });

    data.push(row);
  }

  return data;
}

/**
 * Extract monthly and annual data from document text using Claude Haiku
 */
export async function extractSustainabilityData(
  documentText: string
): Promise<ExtractionResult> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: EXTRACTION_PROMPT + '\n\n' + documentText,
        },
      ],
    });

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // Parse the response to extract CSV data
    const monthlyMatch = responseText.match(/MONTHLY_DATA_CSV\s*```csv\s*([\s\S]*?)```/);
    const annualMatch = responseText.match(/ANNUAL_DATA_CSV\s*```csv\s*([\s\S]*?)```/);

    let monthlyData: MonthlyData[] = [];
    let annualData: AnnualData[] = [];

    if (monthlyMatch && monthlyMatch[1]) {
      monthlyData = parseCSV(monthlyMatch[1]) as MonthlyData[];
    }

    if (annualMatch && annualMatch[1]) {
      annualData = parseCSV(annualMatch[1]) as AnnualData[];
    }

    return {
      monthlyData,
      annualData,
      rawResponse: responseText,
    };
  } catch (error: any) {
    console.error('Haiku extraction error:', error);
    throw new Error(`Failed to extract data: ${error.message}`);
  }
}

/**
 * Generate sustainability analysis report from extracted data
 */
export async function generateAnalysisReport(
  monthlyData: MonthlyData[],
  annualData: AnnualData[]
): Promise<string> {
  // If no data, return early message
  if (monthlyData.length === 0 && annualData.length === 0) {
    return 'No sustainability data could be extracted from the provided document. Please ensure the document contains monthly environmental metrics (CO₂ emissions, plastic waste, water usage, or energy usage) with clear dates and values.';
  }

  const years = annualData.map(d => d.year).sort();
  const latestYear = years[years.length - 1];
  const latestAnnual = annualData.find(d => d.year === latestYear);

  let report = `# Sustainability Analysis Report\n\n`;

  // 1. Headline Summary
  report += `## Headline Summary\n\n`;
  report += `This analysis covers data from ${years.join(', ')}. `;
  report += `We successfully extracted ${monthlyData.length} monthly records across ${years.length} year(s). `;

  if (latestAnnual) {
    const dominantMetric = getDominantMetric(latestAnnual);
    report += `For ${latestYear}, ${dominantMetric}.\n\n`;
  }

  // 2. Annual Overview
  if (annualData.length > 0) {
    report += `## Annual Totals\n\n`;
    report += `| Year | CO₂ (kg) | Plastic (lbs) | Water (gal) | Energy (kWh) |\n`;
    report += `|------|----------|---------------|-------------|-------------|\n`;

    annualData.forEach(annual => {
      report += `| ${annual.year} | ${annual.co2_kg.toLocaleString()} | ${annual.plastic_lbs.toLocaleString()} | ${annual.water_gal.toLocaleString()} | ${annual.energy_kwh.toLocaleString()} |\n`;
    });
    report += `\n`;
  }

  // 3. Data Coverage
  report += `## Data Coverage\n\n`;
  report += `- Total monthly records: ${monthlyData.length}\n`;
  report += `- Years covered: ${years.join(', ')}\n`;
  report += `- Average records per year: ${(monthlyData.length / years.length).toFixed(1)}\n\n`;

  // 4. Key Insights
  if (latestAnnual && annualData.length > 1) {
    report += `## Key Insights\n\n`;
    const previousYear = annualData.find(d => d.year === latestYear - 1);

    if (previousYear) {
      report += generateYearOverYearComparison(previousYear, latestAnnual);
    }
  }

  report += `\n## Notes\n\n`;
  report += `This analysis is based on the data extracted from your sustainability documents. `;
  report += `All values have been normalized to standard units (CO₂ in kg, plastic in lbs, water in gallons, energy in kWh). `;
  report += `For regulatory compliance or formal reporting, please consult with a qualified sustainability professional.\n`;

  return report;
}

function getDominantMetric(annual: AnnualData): string {
  const metrics = [
    { name: 'CO₂ emissions', value: annual.co2_kg, unit: 'kg' },
    { name: 'plastic waste', value: annual.plastic_lbs, unit: 'lbs' },
    { name: 'water usage', value: annual.water_gal, unit: 'gallons' },
    { name: 'energy consumption', value: annual.energy_kwh, unit: 'kWh' },
  ];

  const sorted = metrics.sort((a, b) => b.value - a.value);
  return `total ${sorted[0].name} was ${sorted[0].value.toLocaleString()} ${sorted[0].unit}`;
}

function generateYearOverYearComparison(previous: AnnualData, current: AnnualData): string {
  let comparison = '';

  const compareMetric = (name: string, prevValue: number, currValue: number, unit: string) => {
    const change = currValue - prevValue;
    const percentChange = ((change / prevValue) * 100).toFixed(1);
    const direction = change > 0 ? 'increased' : 'decreased';
    const absChange = Math.abs(change).toLocaleString();

    return `- **${name}**: ${direction} by ${absChange} ${unit} (${Math.abs(Number(percentChange))}% ${direction})\n`;
  };

  comparison += `Compared to ${previous.year}:\n\n`;
  comparison += compareMetric('CO₂ emissions', previous.co2_kg, current.co2_kg, 'kg');
  comparison += compareMetric('Plastic waste', previous.plastic_lbs, current.plastic_lbs, 'lbs');
  comparison += compareMetric('Water usage', previous.water_gal, current.water_gal, 'gallons');
  comparison += compareMetric('Energy consumption', previous.energy_kwh, current.energy_kwh, 'kWh');
  comparison += '\n';

  return comparison;
}
