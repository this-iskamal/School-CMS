import mongoose from 'mongoose';

const { Schema } = mongoose;

const RecentNoticeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  pdfs: [{
    type: String,
    required: true,
  }],
},{timestamps: true});

const RecentNotice = mongoose.model('RecentNotice', RecentNoticeSchema);

export default RecentNotice;
