const Transaction = require('../models/Transaction')

module.exports = {
    getTransactions: async (req,res)=>{
        console.log(req.user)
        try{
            const transactionItems = await Transaction.find({userId:req.user.id})
            //const itemsLeft = await Transaction.countDocuments({userId:req.user.id,completed: false})
            res.render('transactions.ejs', {transactions: transactionItems, user: req.user})
        }catch(err){
            console.log(err)
        }
    },
    createTransaction: async (req, res)=>{
        try{
            await Transaction.create({transaction: req.body.transactionItem, userId: req.user.id})
            console.log('Transaction has been added!')
            res.redirect('/transactions')
        }catch(err){
            console.log(err)
        }
    }
}    