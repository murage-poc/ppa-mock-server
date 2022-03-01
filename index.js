const path = require('path');
const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const router = jsonServer.router(path.join(__dirname, 'storage/db.json'),
  { foreignKeySuffix: '_id' });

const port = process.env.PORT ? process.env.PORT : 3000;

router.render = (req, res) => {
  if (Array.isArray(res.locals.data)) {
    res.jsonp({
      data: res.locals.data
    });
  } else {
    res.jsonp({ ...res.locals.data })
  }
}

//middlewares
server.use(jsonServer.rewriter({
  '/api/v1/products/items?*':'/products?$1',
   '/api/v1/*': '/$1', 
  }));
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.query && req.query.search) {
    req.query['q'] = req.query.search;
    req.query['_limit'] = 10;
  }

  //embed
  req.query['_embed']="created_by";

  if (req.method === 'POST') {
    req.body.created_at = Date.now()
  }

  next();
});

server.use(middlewares);
server.use(router);

server.listen(port, () => { console.log('JSON Server is running') })