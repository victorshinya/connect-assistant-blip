// BASE SETUP
// =============================================================================
// https://www.npmjs.com/package/body-parser
const bodyParser = require('body-parser')
// https://www.npmjs.com/package/cors
const cors = require('cors')
// https://www.npmjs.com/package/express
const express = require('express')
const app = express()
// https://www.npmjs.com/package/helmet
const helmet = require('helmet')
// https://nodejs.org/api/path.html
const path = require('path')
// https://www.npmjs.com/package/dot-env
require('dotenv').config()

// Configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Configure app to use helmet()
app.use(helmet())

// Configure app to use cors()
if (process.env.NODE_ENV === 'dev') {
    app.use(cors())
}

// Expose React app
app.use(express.static(path.join(__dirname, 'build')))

// ROUTES FOR OUR API
// =============================================================================
// Register all routes with /api prefix
const routes = require('./routes')
app.use('/api', routes)

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 3000
const host = process.env.HOST || '0.0.0.0'
app.listen(port, host, () => {
    console.log(`App is up and running at port ${port}`)
})
