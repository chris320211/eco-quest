import mongoose, { Document, Schema } from 'mongoose';

export interface IUpload extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  status: 'uploading' | 'processing' | 'processed' | 'error';
  errorMessage?: string;
  uploadedAt: Date;
  processedAt?: Date;
}

const uploadSchema = new Schema<IUpload>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['uploading', 'processing', 'processed', 'error'],
      default: 'uploading',
    },
    errorMessage: {
      type: String,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Upload = mongoose.model<IUpload>('Upload', uploadSchema);

export default Upload;
