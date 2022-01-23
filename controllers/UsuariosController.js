const Usuario = require("../models/Usuarios");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const nuevoUsuario = async (req, res) => {
  // Mostrar mensajes de error de express validator
  console.log("POST - CREAR USUARIO")
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  // Verificar si el usuario ya estuvo registrado
  const { email, password, identificacion } = req.body;

  //validar que el usuario no esté creado previamente

  // return
  
  let usuario = await Usuario.findOne({ $or: [{ email }, { identificacion }] });
  if (usuario) {
    return res.status(400).json({ msg: "El usuario ya esta registrado" });
  }

  // Crear un nuevo usuario
  usuario = new Usuario(req.body);

  if (req.foto !== '') {
    usuario.setFotoUrl(req.filename);
  }

  // Hashear el password
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salt);

  try {
    await usuario.save();
    res.json({ msg: "Usuario Creado Correctamente" });
  } catch (error) {
    return res.status(500).json({ msg: `Ha ocurrido un error`, error: error });
  }
};

//***************MODIFICAR USUARIO***************
const actualizarUsuario = async (req, res) => {
  console.log("PUT - ACTUALIZAR USUARIO POR ID");
  let usuario = req.body;
  let password = req.body.password;
  const idUsuario = req.body._id;
  usuario.actualizacion = Date.now();
  console.log(usuario);

  if (password) {
    // Hashear el password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
  }
  usuario = new Usuario(req.body);
  if (req.foto !== '') {
    //#region 
     //pendiente borrar archivo imagen antes de gaurdar url nuevo archivo
    // const userOld = await Usuario.find({_id: idUsuario});
    // const foto = userOld.foto
    // const fotoBorrar = foto.replace(/xmas/i, "Christmas");
    // http://localhost:4000/public/0.98aqj3eqy1i.png
    //#endregion

    usuario.setFotoUrl(req.filename);
  }

  try {
    Usuario.findByIdAndUpdate(
      idUsuario,
      usuario,
      (error, usuarioActualizado) => {
        if (error) {
          return res
            .status(500)
            .json({ msg: `Error al actualizar el usuario:`, error: error });
        }
        if (!usuarioActualizado) {
          return res
            .status(500)
            .json({ msg: `No se retornó ningún objeto actualizado` });
        }
        return res.status(200).json({
          msg: `Usuario actualizado correctamente`,
          usuario: usuarioActualizado,
        });
      }
    );
  } catch (error) {
    return res.status(500).json({ msg: `Ha ocurrido un error`, error: error });
  }
};

const traerUsuario = async (req, res) => {
  try {
    const usuarios = await Usuario.find({});
    res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ msg: `Ha ocurrido un error, ${error} ` });
  }
};

module.exports = {
  nuevoUsuario,
  traerUsuario,
  actualizarUsuario,
};
