// Roundrobin.js
const httpProxy = require("http-proxy");
const proxy = httpProxy.createProxyServer({});
let currentIndex = 0;

const RoundRobin = (servers, req, res) => {
  const target = servers[currentIndex];
  currentIndex = (currentIndex + 1) % servers.length;

  const targetUrl = `http://${target.host}:${target.port}`;
  console.log(`🔁 Proxying to: ${targetUrl}`);

  proxy.web(req, res, { target: targetUrl }, (err) => {
    console.error(`❌ Error proxying to ${targetUrl}: ${err.message}`);
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("Bad Gateway");
  });
};

module.exports = RoundRobin;
