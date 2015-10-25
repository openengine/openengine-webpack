import express from 'express';
import schema from './data/schema';
import path from "path"
import graphQLHTTP from 'express-graphql';

// This "app" configuraiton is for Heroku deployment of static
const app = express();
const static_path = path.join(__dirname, '../build', 'public');
app.use(express.static(static_path))
  .get('/*', function (req, res) {
    res.sendFile('index.html', {
      root: static_path
    });
  }).listen(process.env.PORT || 7777, function (err) {
    if (err) { console.log(err) };
    console.log('Listening at localhost:7777');
});

// const graphqlapp = express();

// graphqlapp.use('/', graphQLHTTP({ schema: { schema }, pretty: true }));

// graphqlapp.listen(9090, (err) => {
//   if (err)
//     return console.error(err);
//   console.log('GraphQL Server is now running on localhost:9090');
// });
