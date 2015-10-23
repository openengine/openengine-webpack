import graphqlServer from './server';
import schema from '../src/server/data/schema.js';

graphqlServer(schema, 8080);
