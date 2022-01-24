const express = require("express");
const router = express.Router();
const direcionesController = require("../controllers/DireccionesController");
const auth = require("../middleware/auth");

//DEVUELVE LAS COORDENADAS DE LA BUSQUEDA
router.get("/", auth, direcionesController.traerCoordenadas);

//DEVUELVE LA DIRECCIóN SEGúN LAS COORDENADAS
router.get("/:longitude/:latitude", auth, direcionesController.traerDireccion);

module.exports = router;
