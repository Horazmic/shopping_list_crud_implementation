const express = require("express");
const app = require("./src/app");

const PORT = 3000;

const server = express();
server.use(express.json());

server.use("/api", app);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
