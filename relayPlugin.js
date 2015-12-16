const getbabelRelayPlugin = require('babel-relay-plugin');
import fs from 'fs';
import request from 'sync-request';

// This is a little strange... but we want this http request to be
// synchronous because it needs to write this json file before it gets
// read by the babel plugin
const res = request('GET', 'http://localhost:1337/graphql/schema.json');
fs.writeFileSync('./schema.json', res.getBody());

const schema = require('./schema.json');

module.exports = getbabelRelayPlugin(schema.data);
