import express from 'express';
import path from 'path';

// This "app" configuraiton is for Heroku deployment of static
const app = express();
const staticPath = path.join(__dirname, '../build', 'public');
app.use(express.static(staticPath))
.get('/*', (req, res) => {
  res.sendFile('index.html', {
    root: staticPath,
  });
}).listen(process.env.PORT || 7777, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:7777');
});

// const graphqlapp = express();

// graphqlapp.use('/', graphQLHTTP({ schema: { schema }, pretty: true }));

// graphqlapp.listen(9090, (err) => {
//   if (err)
//     return console.error(err);
//   console.log('GraphQL Server is now running on localhost:9090');
// });
