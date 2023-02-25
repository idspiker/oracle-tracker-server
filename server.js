require('dotenv').config();

const io = require('socket.io')(5002, {
  cors: {
    origin: '*',
  },
});
const { baseData } = require('./data');
const { numberOracles } = require('./utils');

let oracleData = JSON.parse(JSON.stringify(baseData));

io.use((socket, next) => {
  if (socket.handshake.auth.joinCode !== process.env.JOIN_CODE) return;

  next();
});

io.on('connection', (socket) => {
  console.log('User connected');
  socket.emit('oracle-configuration', oracleData);

  // Listen for oracle activations
  socket.on('activate-oracle', (data) => {
    try {
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
    } catch (err) {
      console.log(err);
    }
  });

  // Listen for cycle clears
  socket.on('clear-cycle', (data) => {
    try {
      oracleData[data.encounter].oracles = JSON.parse(
        JSON.stringify(baseData[data.encounter].oracles)
      );
      io.sockets.emit('oracle-configuration', oracleData);
    } catch (err) {
      console.log(err);
    }
  });

  // Listen for atheon planet change
  socket.on('change-planet', (data) => {
    try {
      oracleData.atheon.planet = data.planet;
      io.sockets.emit('oracle-configuration', oracleData);
    } catch (err) {
      console.log(err);
    }
  });
});
