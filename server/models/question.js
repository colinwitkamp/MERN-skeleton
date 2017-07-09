import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  question: { type: 'String', required: true },
  categories: [String],
  answers: [String],
  dateAdded: { type: 'Date', default: Date.now, required: true }
});

export default mongoose.model('Question', questionSchema);
