// Import router to manage all setting routes
const router = require('express').Router()

// Add POST method to save new setting
const save = require('./save.js')
router.post('/', save)

module.exports = router
