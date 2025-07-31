// load.js
const http = require("http");
const RoundRobin = require("./loadbalancer/Roundrobin");
const serverConfig = require("./config/config.json").servers;

const PORT = 5000; // Port for load balancer
const servers = serverConfig; // Array of backend servers

const server = http.createServer((req, res) => {
  RoundRobin(servers, req, res);
});

server.listen(PORT, () => {
  console.log(`🚀 Load Balancer running on http://localhost:${PORT}`);
});
