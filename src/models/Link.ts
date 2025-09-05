import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  imageUrl: String,
  category: String,
  tags: [String],
  aiSummary: String,
  domain: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['PROCESSING', 'COMPLETED', 'FAILED'],
    default: 'PROCESSING',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Link || mongoose.model('Link', LinkSchema);