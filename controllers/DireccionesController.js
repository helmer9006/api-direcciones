const axios = require("axios");
const KEY_API_HERE = process.env.APP_KEY_HERE;
const TOKEN_API_MAPBOX = process.env.APP_TOKEN_MAPBOX;

//FUNCIóN PARA TRAER COORDENADAS DE UNA DIRECCIóN
const traerCoordenadas = async (req, res) => {
  console.log("GET - TRAER COORDENADA DE BUSQUEDA ");
  const { perfil, nombre } = req.usuario;
  let direccion = encodeURIComponent(req.query.direccion);
  //Valido perfil
  if (perfil == "administrador") {
    const UrlHere = `https://geocode.search.hereapi.com/v1/geocode?q=${direccion}&apiKey=${KEY_API_HERE}`;
    console.log(UrlHere);
    try {
      const {
        data: { items },
      } = await axios(UrlHere);

      if (items.length < 1) {
        const UrlMapbox = `https://api.mapbox.com/geocoding/v5/mapbox.places/${direccion}.json?access_token=${TOKEN_API_MAPBOX}`;

        const {
          data: { features },
        } = await axios(UrlMapbox);
        let coordenadas = [];
        features.map((item) => {
          const {
            geometry: { coordinates },
          } = item;
          coordenadas.push({ lat: coordinates[1], lng: coordinates[0] });
        });
        return res.status(200).json(coordenadas);
      }
      let coordenadas = [];
      items.map((item) => {
        coordenadas.push({
          lat: item.position.lat,
          lng: item.position.lng,
        });
      });
      return res.status(200).json(coordenadas);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `Ha ocurrido un error`, error: error });
    }
  } else {
    return res.status(403).json({
      msg: `Acceso no autorizado, el usuario ${nombre} con perfil ${perfil} no tiene autorización para realizar la consulta`,
    });
  }
};

module.exports = {
  traerCoordenadas,
};
