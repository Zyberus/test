import mongoose, { Model } from 'mongoose';

// Define the interface for Contact document
interface IContact extends mongoose.Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define static methods
interface ContactModel extends Model<IContact> {
  getInfo(): Promise<{ dbName: string; collectionName: string; count: number }>;
}

const contactSchema = new mongoose.Schema<IContact>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
  },
}, {
  timestamps: true,
  collection: 'contacts', // Explicitly set collection name
  strict: true, // Ensure only schema fields are saved
  versionKey: false, // Don't add __v field
});

// Add indexes
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });

// Add pre-save hook for logging
contactSchema.pre('save', function(next) {
  console.log('Saving contact to collection:', this.collection.name);
  console.log('Contact data:', this.toObject());
  next();
});

// Add post-save hook for logging
contactSchema.post('save', function(doc) {
  console.log('Contact saved successfully to collection:', doc.collection.name);
  console.log('Saved document:', doc.toObject());
});

// Add static method to get database and collection info
contactSchema.static('getInfo', async function() {
  const dbName = this.db.name;
  const collectionName = this.collection.name;
  const count = await this.countDocuments();
  console.log(`Database: ${dbName}, Collection: ${collectionName}, Documents: ${count}`);
  return { dbName, collectionName, count };
});

// Create the model with proper typing
const Contact = mongoose.models.Contact as ContactModel || 
                mongoose.model<IContact, ContactModel>('Contact', contactSchema);

// Log model information
Contact.getInfo().catch(console.error);

export default Contact;
