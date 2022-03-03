module.exports.productsDBOptions = {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "productos",
  },
  pool: { min: 0, max: 7 },
};

module.exports.chatMsgsDBOptions = {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "chatmsgs",
  },
  pool: { min: 0, max: 7 },
};

// module.exports.chatMsgsDBOptions = {
//   client: "sqlite3",
//   connection: { filename: "./db/ecommerce" },
// };

// Array con productos de ejemplo
module.exports.products = [
  {
    title: "Telescopio",
    price: 4820.58,
    thumbnail:
      "https://img.icons8.com/external-filled-outline-satawat-anukul/64/000000/external-telescope-education-filled-outline-filled-outline-satawat-anukul-2.png",
  },
  {
    title: "Set de escuadras",
    price: 634.72,
    thumbnail:
      "https://img.icons8.com/external-flat-icons-pause-08/64/000000/external-angle-education-flat-icons-pause-08.png",
  },
  {
    title: "Calculadora",
    price: 734.66,
    thumbnail:
      "https://img.icons8.com/external-others-aquariid/64/000000/external-accounting-education-others-aquariid-2.png",
  },
  {
    title: "Tijera",
    price: 228.7,
    thumbnail:
      "https://img.icons8.com/external-icongeek26-linear-colour-icongeek26/64/000000/external-scissor-kindergarten-icongeek26-linear-colour-icongeek26.png",
  },
  {
    title: "Globo terráqueo",
    price: 916.0,
    thumbnail:
      "https://img.icons8.com/external-filled-line-rakhmat-setiawan/64/000000/external-earth-back-to-school-filled-line-filled-line-rakhmat-setiawan.png",
  },
  {
    title: "Pizarra",
    price: 1213.45,
    thumbnail:
      "https://img.icons8.com/external-flat-icons-pack-pongsakorn-tan/64/000000/external-blackboard-back-to-school-flat-icons-pack-pongsakorn-tan.png",
  },
];
