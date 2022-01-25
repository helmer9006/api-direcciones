const Usuario = require("../models/Usuarios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });
const { validationResult } = require("express-validator");

exports.autenticarUsuario = async (req, res, next) => {
  // Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  // Buscar el usuario para ver si esta registrado
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ email });
  // console.log(usuario);

  if (!usuario) {
    res.status(401).json({ msg: "El Usuario No Existe" });
    return next();
  }

  // Verificar el password y autenticar el usuario

  if (bcrypt.compareSync(password, usuario.password)) {
    // Crear JWT
    const token = jwt.sign(
      {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        perfil: usuario.perfil,
        estado: usuario.estado,
        creacion: usuario.creacion,
        tipoIdentificacion: usuario.tipoIdentificacion,
        identificacion: usuario.identificacion,
      },
      process.env.SECRETA,
      {
        expiresIn: "8h",
      }
    );

    res.json({ token });
  } else {
    res.status(401).json({ msg: "Email o Password Incorrecto" });
    return next();
  }
};

exports.usuarioAutenticado = (req, res, next) => {
  res.json({ usuario: req.usuario });
};
