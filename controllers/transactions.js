const Transaction = require('../models/Transaction')

module.exports = {
    getTransactions: async (req, res) => {
        try {
            const [transactions, sums] = await Promise.all([
                Transaction.find({ userId: req.user.id }),
                Transaction.aggregate([
                    { $match: { userId: req.user.id } },
                    {
                        $group: {
                            _id: null,
                            totalAmount: { $sum: { $ifNull: ["$amount", 0] } },
                            totalUserAmount: { $sum: { $ifNull: ["$userPortion", 0] } },
                            totalFriendAmount: { $sum: { $ifNull: ["$friendPortion", 0] } },
                            totalUserSpent: {
                                $sum: {
                                    $cond: [{ $eq: ["$payer", "user"] }, "$amount", 0]
                                }
                            }
                        }
                    }
                ])
            ]);

            const { totalAmount = 0, totalUserAmount = 0, totalFriendAmount = 0, totalUserSpent = 0 } = sums[0] || {};

            res.render('transactions.ejs', {
                transactions,
                user: req.user,
                amountSum: totalAmount,
                userAmountSum: totalUserAmount,
                friendAmountSum: totalFriendAmount,
                userSpentSum: totalUserSpent,
                friendSpentSum: totalAmount - totalUserSpent
            })
        } catch (err) {
            console.log(err)
        }
    },

    createTransaction: async (req, res) => {
        try {
            // Calculates transaction split amount
            const userAmt = req.body.splitItem === "equally" ? req.body.amountItem / 2 : req.body.userAmountItem;
            const friendAmt = req.body.splitItem === "equally" ? req.body.amountItem / 2 : req.body.amountItem - req.body.userAmountItem;
            // Creates a new transaction record in the database
            await Transaction.create({ date: req.body.dateItem, transaction: req.body.transactionItem, amount: req.body.amountItem, payer: req.body.payerItem, userPortion: userAmt, friendPortion: friendAmt, userId: req.user.id })
            console.log('Transaction has been added!')
            res.redirect('/transactions')
        } catch (err) {
            console.log(err)
        }
    },
    
    deleteTransaction: async (req, res) => {
        try {
            await Transaction.findOneAndDelete({ _id: req.body.transactionIdFromJSFile })
            console.log('Deleted Transaction')
            res.json('Deleted It')
        } catch (err) {
            console.log(err)
        }
    }
}    