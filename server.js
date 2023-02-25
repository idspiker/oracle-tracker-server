const io = require('socket.io')(5002, {
  cors: {
    origin: '*',
  },
});
const { baseData } = require('./data');
const { numberOracles } = require('./utils');

let oracleData = JSON.parse(JSON.stringify(baseData));

io.on('connection', (socket) => {
  console.log('User connected');
  socket.emit('oracle-configuration', oracleData);

  // Listen for oracle activations
  socket.on('update', (data) => {
    // Set new data
    oracleData[data.encounter].oracles[data.oracleName].on = true;
    oracleData[data.encounter].oracles[data.oracleName].timestamp =
      data.timestamp;

    // Number oracles
    const numberedOracles = numberOracles(oracleData[data.encounter].oracles);
    for (oracle of numberedOracles) {
      oracleData[data.encounter].oracles[oracle.oracleName].num = oracle.num;
    }

    io.sockets.emit('oracle-configuration', oracleData);
  });

  // Listen for cycle clears
  socket.on('clear-cycle', (data) => {
    oracleData[data.encounter] = JSON.parse(
      JSON.stringify(baseData[data.encounter])
    );
    io.sockets.emit('oracle-configuration', oracleData);
  });
});
