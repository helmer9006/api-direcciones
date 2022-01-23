const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { appConfig } = require("../config");
const usuariosSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  tipoIdentificacion: {
    type: String,
    required: true,
    trim: false,
  },
  identificacion: {
    type: String,
    required: true,
    trim: false,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  foto: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  //administrador(acceso total), estandar(realizan solicitudes de direcciones))
  perfil: {
    type: String,
    required: true,
    trim: true,
  },
  estado: {
    type: Boolean,
    required: true,
    default: true,
  },
  creacion: {
    type: Date,
    default: Date.now,
  },
  actualizacion: {
    type: Date,
  },
});

//metodo para guardar automaticamente los archivos
usuariosSchema.methods.setFotoUrl = function setFotoUrl(filename) {
  const { host, port } = appConfig;
  this.foto = `${host}:${port}/public/${filename}`;
};

module.exports = mongoose.model("Usuarios", usuariosSchema);
