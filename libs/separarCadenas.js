module.exports = (cadena, separador) => {
  var arrayDeCadenas = cadena.split(separador);
  const split = arrayDeCadenas[0].split("/");
  const extension = split[1].split(";");
  return { extension: extension[0], file: arrayDeCadenas[1] };
};

