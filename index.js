const path = require('path');
const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

const router = jsonServer.router(dbPath(),
    {foreignKeySuffix: '_id', watch: dbPath()});

const port = process.env.PORT ? process.env.PORT : 3000;

router.render = (req, res) => {
    if (Array.isArray(res.locals.data)) {
        res.jsonp({
            data: res.locals.data
        });
    } else {
        res.jsonp({...res.locals.data})
    }
}

//middlewares
server.use(jsonServer.rewriter({
    '/api/v1/products/items?*': '/products?$1',
    '/api/v1/*': '/$1',
}));
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
    if (req.query && req.query.search) {
        req.query['q'] = req.query.search;
    }

    if (req.method === 'POST') {
        req.body.created_at = Date.now();
        req.body.created_by_id = req.body.created_by_id||'10001';

    }

    next();
});

server.use(middlewares);
server.use(router);

function dbPath() {
    return path.join(__dirname, 'storage/db.json');
}

server.listen(port, () => {
    console.log('JSON Server is running')
});