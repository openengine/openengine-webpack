import graphqlServer from './server';
import { Schema } from '../src/server/data/schema.js';

graphqlServer(Schema, 8080);
