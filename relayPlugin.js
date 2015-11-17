var getbabelRelayPlugin = require('babel-relay-plugin');

// TODO: GET this relay plugin building
//
//
//
//
var schema = require('./src/server/data/schema.json');

module.exports = getbabelRelayPlugin(schema.data);
