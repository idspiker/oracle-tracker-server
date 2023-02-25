const numberOracles = (oracles) => {
  // Get oracles into an array for iteration
  let oracleArray = Object.entries(oracles);

  // Sort oracles array by timestamp
  oracleArray.sort((a, b) => {
    if (a[1].timestamp < b[1].timestamp) {
      return -1;
    }
    if (a[1].timestamp > b[1].timestamp) {
      return 1;
    }
    return 0;
  });

  // Create array of numbered oracles
  let count = 0;
  let numberedOracles = [];
  for (oracle of oracleArray) {
    if (oracle[1].timestamp !== 0 && oracle[1].on === true) {
      count += 1;
      numberedOracles.push({ oracleName: oracle[0], num: count });
    }
  }

  return numberedOracles;
};

module.exports = { numberOracles };
