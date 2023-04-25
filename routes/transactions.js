const express = require('express')
const router = express.Router()
const tranController = require('../controllers/transactions') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, tranController.getTransactions)

router.post('/createTransaction', tranController.createTransaction)

// router.put('/markComplete', todosController.markComplete)

// router.put('/markIncomplete', todosController.markIncomplete)

// router.delete('/deleteTodo', todosController.deleteTodo)

module.exports = router