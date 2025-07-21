const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Sub-esquema para Récords Personales (PRs)
const prSchema = new Schema({
  backSquat: { type: Number, default: 0 },
  deadlift: { type: Number, default: 0 },
  benchPress: { type: Number, default: 0 },
  militaryPress: { type: Number, default: 0 },
  snatch: { type: Number, default: 0 },
  cleanAndJerk: { type: Number, default: 0 },
}, { _id: false });

// Sub-esquema para Permisos
const permissionsSchema = new Schema({
  canUseOly: { type: Boolean, default: true },
  canUseBodybuilding: { type: Boolean, default: true },
  canUseFlexibility: { type: Boolean, default: true },
  maxWodsPerSession: { type: Number, default: 5, min: 2, max: 5 },
  minTrainingTime: { type: Number, default: 20, min: 20, max: 180 },
  maxTrainingTime: { type: Number, default: 180, min: 20, max: 180 },
  canSelectTrainingType: { type: Boolean, default: true },
  canUseGymMode: { type: Boolean, default: true },
  canUseGymFlexibility: { type: Boolean, default: true },
  canUseSeniorMode: { type: Boolean, default: true }, // <-- Nuevo Permiso
}, { _id: false });

// Esquema Principal de Usuario
const userSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  personalRecords: { type: prSchema, default: () => ({}) },
  permissions: {
    type: permissionsSchema,
    default: () => ({})
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
