const mongoose = require('mongoose');
const task = require('./task');

const checklistSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }
  ]
});

module.exports = mongoose.model('Checklist', checklistSchema);
