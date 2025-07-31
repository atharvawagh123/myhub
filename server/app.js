const http = require("http");
const serverConfig = require("../server/config/config.json").servers;
const RoundRobin = require("./Roundrobin");
const port = 6000;

const servers = serverConfig; // ✅ Use directly

const algorithm = "roundrobin";

const server = http.createServer((req, res) => {
  if (algorithm === "roundrobin") {
    RoundRobin(servers, req, res);
  } else {
    console.error("Unsupported load balancing algorithm");
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

server.listen(port, () => {
  console.log(`✅ Load balancer is running on port ${port}`);
});
