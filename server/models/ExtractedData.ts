import mongoose, { Document, Schema } from 'mongoose';

export interface IMonthlyData {
  year: number;
  month: number;
  month_label: string;
  co2_kg: number;
  plastic_lbs: number;
  water_gal: number;
  energy_kwh: number;
}

export interface IAnnualData {
  year: number;
  co2_kg: number;
  plastic_lbs: number;
  water_gal: number;
  energy_kwh: number;
}

export interface IExtractedData extends Document {
  uploadId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  monthlyData: IMonthlyData[];
  annualData: IAnnualData[];
  analysisReport: string;
  rawResponse?: string;
  extractedAt: Date;
}

const monthlyDataSchema = new Schema<IMonthlyData>(
  {
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    month_label: { type: String, required: true },
    co2_kg: { type: Number, default: 0 },
    plastic_lbs: { type: Number, default: 0 },
    water_gal: { type: Number, default: 0 },
    energy_kwh: { type: Number, default: 0 },
  },
  { _id: false }
);

const annualDataSchema = new Schema<IAnnualData>(
  {
    year: { type: Number, required: true },
    co2_kg: { type: Number, default: 0 },
    plastic_lbs: { type: Number, default: 0 },
    water_gal: { type: Number, default: 0 },
    energy_kwh: { type: Number, default: 0 },
  },
  { _id: false }
);

const extractedDataSchema = new Schema<IExtractedData>(
  {
    uploadId: {
      type: Schema.Types.ObjectId,
      ref: 'Upload',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    monthlyData: [monthlyDataSchema],
    annualData: [annualDataSchema],
    analysisReport: {
      type: String,
      required: true,
    },
    rawResponse: {
      type: String,
    },
    extractedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ExtractedData = mongoose.model<IExtractedData>('ExtractedData', extractedDataSchema);

export default ExtractedData;
