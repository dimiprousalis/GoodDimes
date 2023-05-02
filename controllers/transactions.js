const Transaction = require('../models/Transaction')

module.exports = {
    getTransactions: async (req,res)=>{
        console.log(req.user)
        try{
            const transactionItems = await Transaction.find({userId:req.user.id});
            //Calculate the dollar splits between how much user/friend consumed and how much they spent
            const totalAmount = transactionItems.reduce((a, obj) => a + obj.amount, 0);
            const totalUserAmount = transactionItems.reduce((a, obj) => a + obj.userPortion, 0);
            const totalFriendAmount = transactionItems.reduce((a, obj) => a + obj.friendPortion, 0);
            const totalUserSpent = transactionItems.filter(obj => obj.payer === "user").reduce((a, obj) => a + obj.amount, 0);
            const totalFriendSpent = totalAmount - totalUserSpent;

            res.render('transactions.ejs', {
                transactions: transactionItems, 
                user: req.user, 
                amountSum: totalAmount, 
                userAmountSum: totalUserAmount,
                friendAmountSum: totalFriendAmount,
                userSpentSum: totalUserSpent,
                friendSpentSum: totalFriendSpent})
        }catch(err){
            console.log(err)
        }
    },
    createTransaction: async (req, res)=>{
        try{
            console.log(req.body)
            // Calculates transaction split amount
            const userAmt = req.body.splitItem === "equally"? req.body.amountItem/2 : req.body.userAmountItem;
            const friendAmt = req.body.splitItem === "equally"? req.body.amountItem/2 : req.body.amountItem - req.body.userAmountItem;
            // Creates a new transaction record in the database
            await Transaction.create({date: req.body.dateItem, transaction: req.body.transactionItem, amount: req.body.amountItem, payer: req.body.payerItem, userPortion: userAmt, friendPortion: friendAmt, userId: req.user.id})
            console.log('Transaction has been added!')
            res.redirect('/transactions')
        }catch(err){
            console.log(err)
        }
    },
    deleteTransaction: async (req, res)=>{
        console.log(req.body.transactionIdFromJSFile)
        try{
            await Transaction.findOneAndDelete({_id:req.body.transactionIdFromJSFile})
            console.log('Deleted Transaction')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    }
}    