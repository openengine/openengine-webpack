import express from 'express';
import schema from './data/schema';
import graphQLHTTP from 'express-graphql';

console.log('aaaaaaa', schema);
const app = express();
app.use('/', graphQLHTTP({ schema: { schema }, pretty: true }));
app.listen(8080, (err) => {
  if (err)
    return console.error(err);
  console.log('GraphQL Server is now running on localhost:8080');
});
