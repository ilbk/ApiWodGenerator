const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  name: { type: String, required: true, unique: true },
  categories: [{ type: String, required: true }],
  equipment: [{ type: String }],
  patrones_movimiento: [{ type: String }],
  musculos_principales: [{ type: String }],
  skill_level: { type: String, enum: ['Principiante', 'Intermedio', 'Avanzado', 'Competidor', 'Elite'] },
  focus: { type: String, enum: ['Tren Superior', 'Tren Inferior', 'Cuerpo Completo', 'N/A'], default: 'N/A' },
  tags: [{ type: String, enum: ['Olímpico', 'Gimnástico', 'Fuerza Pura', 'Cardio', 'Musculación', 'Core', 'Máquina'] }],
  measurement_type: { type: String, enum: ['tiempo', 'reps', 'peso', 'distancia'] },
  allowedSections: [{
    type: String,
    enum: [
      'Calentamiento (Core)', 
      'Levantamiento Olímpico', 
      'Musculación', 
      'WOD Principal', 
      'Flexibilidad (Vuelta a la Calma)',
      'Modo DIOS (Tercera Edad)'
    ]
  }],
  // --- ¡NUEVO CAMPO! ---
  imageUrl: { type: String, default: '' },
}, {
  timestamps: true,
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = Exercise;
