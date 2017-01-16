// Get environment here or put them into a separate config.js file
// const SOME_CONFIG = process.env.SOME_CONFIG || 'some-default-value' 
const NODE_ENV = process.env.NODE_ENV || 'development'
const TEST = NODE_ENV === 'test'

const path = require('path')
const seneca = require('seneca')(/*{log: {level:'debug'}}*/)
const express = require('express')
const web = require('seneca-web')
const bodyParser = require('body-parser')
const cors = require('cors')
const _ = require('lodash')
const services = require('rest-tool-common').services

const plugin = require('./services/plugin')
const config = require('./config')

const api = services.load(path.resolve(__dirname, config.restapiRoot), path.resolve(__dirname, config.restapiRoot) + '/services')
const routes = []

_.forIn(api, function(value, key) {
    const route = {
        prefix: `${config.restPrefix}/${key.split('/')[1]}`,
        pin: `role:${key.split('/')[1]},cmd:*`,
    }

    route.map = {}
    route.map[`${key.split('/')[2]}`] = {}

    _.forIn(value.methods, function(value, method) {
        route.map[`${key.split('/')[2]}`][method] = true
    })

    routes.push(route)
})
console.log(routes)

const app = express()
app.use(cors())
app.use(bodyParser.json())

const senecaWebConfig = {
    routes: routes,
    adapter: require('seneca-web-adapter-express'),
    context: app
}

seneca
    .use(plugin)
    .use(web, senecaWebConfig)
    .ready(function() {
        const server = seneca.export('web/context')()

        server.listen(config.port, function() {
            console.log(`server started on: ${config.port}`)
        })
    })
