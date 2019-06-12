const knex = require('knex')
const https = require('https');
const http = require('http');
const unirest = require('unirest');
const events = require('events');
const app = require('./app')
const { PORT, DB_URL } = require('./config')
const BeveragesService = require('./Beverages/beverages-service')


const db = knex({
    client: 'pg',
    connection: DB_URL,
});

app.set('db', db)

//external API call to snooth
const getApiWines = (query) => {
    const emitter = new events.EventEmitter();
    const options = {
        host:'api.snooth.com',
        path: '/wines/?akey=kw6zioaksgw0uee40ixihfkucl02cdhcdo19s7b5q9vi9wv3&ip=66.28.234.115&q='+ query,
        method: 'GET',
        headers: {
            'Authorization': "kw6zioaksgw0uee40ixihfkucl02cdhcdo19s7b5q9vi9wv3",
            'Content-Type': "application/json",
            'Port': 443,
        }
    };

    https.get(options, (res) =>  {
        res.on('data', (chunk) => {
                console.log(JSON.parse(chunk));
            emitter.emit('end', JSON.parse(chunk));
        });

    }).on('error', (event) => {
        emitter.emit('error', event)
    });
    return emitter;
}

//link Snooth API call to local endpoint
app.get('/beverages-api-data/:search', (req, res) => {

    //use Snooth API function
    const wineSearch = getApiWines(req.params.search);

    //get data on API call 
    wineSearch.on('end', (newWine) => {
            console.log(newWine.wines);
        //connect to database
            const dbSaveWine = [];
            for(let i=0; i < newWine.wines.length; i++) {
                dbSaveWine[i] = {
                    bev_type: newWine.wines[i].type,
                    bev_name: newWine.wines[i].name,
                    description: newWine.wines[i].varietal,
                    overall_rating: newWine.wines[i].snoothrank,
                    bev_code: newWine.wines[i].code
                }
            }
    BeveragesService.insertBeverages(req.app.get('db'), dbSaveWine)
            .then(newWine => {
                console.log(newWine)
                res.status(201).json(newWine)
            })
            .catch(err => {
                console.log(err);
            });
            res.json(newWine.wines[0].code)
    });

//error handling
    wineSearch.on('error', (code) => {
        res.sendStatus(code)
    });
})

app.listen(process.env.PORT, () => {
    console.log(`Sever is listening at http://localhost:${PORT}`)
})