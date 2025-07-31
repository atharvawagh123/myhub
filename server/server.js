const express = require('express');
const http = require('http');
const mongoose = require("mongoose");
const cors = require('cors');
const dotenv = require("dotenv");
const authRouter = require('./routes/authRouter');
const postRouter = require('./routes/postRouter');
const serverConfig = require("../server/config/config.json").servers;
const RoundRobin = require("./loadbalancer/Roundrobin");


dotenv.config();
const servers = serverConfig; // ✅ Use directly
const port = process.argv[2] ||  4000; // Default port if not provided
const app = express();


const server = http.createServer(app);

// Middleware
app.use(cors());

// Load Balancer Middleware
app.use("/api/proxy", (req, res) => {
  RoundRobin(servers, req, res);
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.get('/', (req, res) => {
  res.send('Welcome to the MyHub API');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected  MongoDB");
    server.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
  });
  
  

  
