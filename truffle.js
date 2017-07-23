// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    dev: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 1 //Voting Deployment 0x47958a22e61229b760a462832cb489ec405139e2
    }
  }
}
