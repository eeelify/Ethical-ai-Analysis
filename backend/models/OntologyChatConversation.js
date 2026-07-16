const mongoose = require('mongoose');

const OntologyChatMessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'system'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['needs_more_information', 'completed', 'error'],
    default: undefined
  },
  ontologyResult: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const OntologyChatConversationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['not_started', 'needs_more_information', 'completed', 'error'],
    default: 'not_started',
    index: true
  },
  messages: {
    type: [OntologyChatMessageSchema],
    default: []
  },
  ontologyResult: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  lastOntologyRaw: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, { timestamps: true });

OntologyChatConversationSchema.index({ projectId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.models.OntologyChatConversation ||
  mongoose.model('OntologyChatConversation', OntologyChatConversationSchema);
