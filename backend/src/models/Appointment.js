const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: { 
    type: Date, 
    required: true 
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled' // Isso é muito importante!
  },
  weatherForecast: {
    condition: { type: String },
    willRain: { type: Boolean, default: false }
  },
  notes: { 
    type: String 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Appointment', appointmentSchema);