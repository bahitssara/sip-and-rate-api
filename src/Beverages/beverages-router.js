const express = require('express')
const BeveragesService = require('./beverages-service')
const logger = require('../logger')

const beveragesRouter = express.Router()
const jsonBodyParser = express.json()

const serializeBeverage = beverage => ({
    id: beverage.id,
    bev_type: beverage.bev_type,
    bev_name: beverage.bev_name,
    description: beverage.description,
    overall_rating: beverage.overall_rating
})

beveragesRouter   
    .route('/beverages') 
    .get((req,res, next) => {
        BeveragesService.getAllBeverages(req.app.get('db'))
            .then(beverage => {
                res.json(beverage.map(serializeBeverage))
            })
            .catch(next)
    })
    .post(jsonBodyParser, (req, res, next) => {
        const newBeverage = {...req.body}
        
        for (const [key, value] of Object.entries(newBeverage))
        if (value == null)
            return res.status(400).json({
                error: `Missing '${key}' in request body`
            })
        return BeveragesService
            .insertBeverages(req.app.get('db'), newBeverage)
                .then(newBeverage => {
                    res
                    .status(201)
                    .location(`/beverages/${beverage.id}`)
                    .json(newBeverage)
                })
                .catch(next)
    })

beveragesRouter
    .route('/beverages/:id')
    .all((req, res, next) => {
        const { id } = req.params;
        BeveragesService.getById(req.app.get('db'), id)
            .then(beverage => {
                if(!beverage) {
                    logger.info(`Beverage with ${id} doesn't exist`);
                    return res
                        .status(404)
                        .send({ error: { message: `Beverage doesn't exist` } })
                }
                res.beverage = beverage
                next()
            })
            .catch(next)
    })
    .get((req, res) => {
        return res
        .status(200)
        .json(serializeBeverage(res.beverage))       
    })
    .delete((req, res, next) => {
        const { id } = req.params;
        BeveragesService.deleteBeverages(
            req.app.get('db'),
            id
        )
        .then(numRowsAffected => {
            logger.info(`Beverage with id ${id} deleted`)
            res.status(204).end()
        })
        .catch(next)
    })


module.exports = beveragesRouter