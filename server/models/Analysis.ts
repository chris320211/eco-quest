import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  period: string;
  dataCoverage: number;
  totalEmissions?: number;
  emissionsUnit: string;
  framework: string;
  summary?: string;
  emissionsBreakdown?: {
    scope1?: number;
    scope2?: number;
    scope3?: number;
  };
  emissionsByCategory?: Array<{
    category: string;
    value: number;
    percentage: number;
  }>;
  missingFields?: string[];
  insights?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const analysisSchema = new Schema<IAnalysis>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    period: {
      type: String,
      required: true,
    },
    dataCoverage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    totalEmissions: {
      type: Number,
    },
    emissionsUnit: {
      type: String,
      default: 'tCO₂e',
    },
    framework: {
      type: String,
      default: 'GHG Basic Protocol / VSME Environmental',
    },
    summary: {
      type: String,
    },
    emissionsBreakdown: {
      scope1: Number,
      scope2: Number,
      scope3: Number,
    },
    emissionsByCategory: [
      {
        category: String,
        value: Number,
        percentage: Number,
      },
    ],
    missingFields: [String],
    insights: [String],
  },
  {
    timestamps: true,
  }
);

// Create compound index for userId and period
analysisSchema.index({ userId: 1, period: 1 }, { unique: true });

const Analysis = mongoose.model<IAnalysis>('Analysis', analysisSchema);

export default Analysis;
