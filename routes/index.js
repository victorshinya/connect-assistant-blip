// Import router to manage all app routes
const router = require('express').Router()

// Add setting routes to router
const setting = require('./setting')
router.use('/setting', setting)

module.exports = router
