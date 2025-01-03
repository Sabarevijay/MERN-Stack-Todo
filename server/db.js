const Pool =require("pg").Pool;

// const pool= new Pool({
//     user:"postgres",
//     password:"bit",
//     host:"localhost",
//     port:5433,
//     database:"perntodo"
// });

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });



module.exports = pool;