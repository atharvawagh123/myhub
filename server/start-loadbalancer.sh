
#!/bin/bash

echo "🔄 Starting backend servers on ports 4001, 4002, and 4003..."

# Start 3 instances of server.js
node server.js 4001 &
node server.js 4002 &
node server.js 4003 &

# Wait for servers to initialize (optional but useful)
sleep 2

echo "🚀 Starting Load Balancer on port 5000..."
node Roundrobin.js

# If you want to keep script running until loadbalancer exits
wait

