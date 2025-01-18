import mongoose from 'mongoose';
import dbConnect from '../lib/mongodb';

let Visitor;

const VisitorSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  country: String,
  city: String,
  region: String,
  browser: String,
  os: String,
  device: String,
  path: String,
  referrer: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  language: String,
  screenResolution: String,
});

async function getModel() {
  await dbConnect();
  if (!Visitor) {
    Visitor = mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);
  }
  return Visitor;
}

export default async function getVisitorModel() {
  return await getModel();
}
