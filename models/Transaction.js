const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
  transaction: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Transaction', TransactionSchema)