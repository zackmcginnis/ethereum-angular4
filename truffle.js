// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    dev: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 10000002655765765
    }
  }
}
