const cds = require('@sap/cds')
const cds_swagger = require('cds-swagger-ui-express')

require('./Jobs/Scheduler')

cds.on('bootstrap', app => app.use(cds_swagger()))

module.exports = cds.server