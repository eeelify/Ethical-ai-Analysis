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
    default: null,
    index: true
  },
  title: {
    type: String,
    default: 'New ontology chat'
  },
  projectTitle: {
    type: String,
    default: ''
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
  confirmedFacts: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  unknownFacts: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  factEvidence: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  contradictions: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  assessmentVersion: {
    type: String,
    default: 'ontology-chat-semantic-facts-v2'
  },
  lastOntologyRaw: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, { timestamps: true });

OntologyChatConversationSchema.index({ userId: 1, updatedAt: -1 });
OntologyChatConversationSchema.index({ userId: 1, projectId: 1, updatedAt: -1 });

module.exports = mongoose.models.OntologyChatConversation ||
  mongoose.model('OntologyChatConversation', OntologyChatConversationSchema);
