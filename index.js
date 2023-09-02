const express = require("express");
const compression = require("compression");
const app = express();
require("dotenv").config();
// const cluster = require("cluster");
// const os = require("os");

// * Cors

app.use((req, res, next) => {
  res.header({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE",
  });
  next();
});

// * receive JSON parsed body

app.use(express.json());

// * compressing for better performance

app.use(
  compression({
    level: 6,
    threshold: 10 * 1000, // * > 10 KB will be compressed.
    filter: (req, res) => {
      return compression.filter(req, res);
    },
  })
);

// * creating clusters to utilize CPUs.

const db = require("./app/models");
const Role = db.role;

app.get("/", (req, res) => {
  console.log("--> Someone tried to access the API without permission");
  res.send(
    `<h1 style="color:red">ACCESSING THE API WITHOUT PROPER PERMISSION IS STRICTLY PROHIBITED!</h1><p>Property of Siksha 'O' Anusandhan University</p>`
  );
});

// * creating user role

const createRoles = async () => {
  Role.estimatedDocumentCount().then((count) => {
    if (count === 0) {
      new Role({
        name: "admin",
      })
        .save()
        .then((resp) => {
          console.log("--> ADMIN CREATED");
        })
        .catch((err) => {
          console.log("ERROR WHILE CREATING ADMIN");
        });

      new Role({
        name: "moderator",
      })
        .save()
        .then((resp) => {
          console.log("--> MODERATOR CREATED");
        })
        .catch((err) => {
          console.log("ERROR WHILE CREATING MODERATOR");
        });

      new Role({
        name: "user",
      })
        .save()
        .then((resp) => {
          console.log("--> USER CREATED");
        })
        .catch((err) => {
          console.log("ERROR WHILE CREATING USER");
        });
    } else {
      console.log("--> Roles already created");
    }
  });
};

// * connection to database

db.mongoose
  .connect(`${process.env.MONGODB_URI}`)
  .then(() => {
    console.log("--> Connected to database");
    createRoles();
  })
  .catch((err) => {
    console.log("--> Error connecting to database", err);
    process.exit();
  });

// * routes

require("./app/routes/test.routes")(app);
require("./app/routes/quiz.routes")(app);
require("./app/routes/teacher-auth.routes")(app);
require("./app/routes/student-auth.routes")(app);

const PORT = process.env.PORT || 5000;

// ? This cluster is not working on vercel, so commented out.
// const cpuCount = os.cpus().length;
// if (cluster.isMaster) {
//   for (let i = 0; i < cpuCount; i++) {
//     cluster.fork();
//   }
//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`--> WORKER ${worker.process.pid} DIED`);
//     cluster.fork();
//   });
// } else {
//   app.listen(PORT, () => {
//     console.log(`--> SERVER ACTIVE ON ${PORT} PID: @${process.pid} `);
//   });
// }
app.listen(PORT, () => {
  console.log(`--> SERVER ACTIVE ON ${PORT} PID: @${process.pid} `);
});
