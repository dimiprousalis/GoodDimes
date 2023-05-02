const deleteBtn = document.querySelectorAll('.del')
const otherAmountBtn = document.querySelector('#otherAmountItem') //<= radio buttons for split
const equallyBtn = document.querySelector('#equallyItem') //<= radio buttons for split
const todoItem = document.querySelectorAll('span.not')
const todoComplete = document.querySelectorAll('span.completed')


//Adding event listeners to transaction item deletes
Array.from(deleteBtn).forEach((el) => {
    el.addEventListener('click', deleteTransaction)
})

//Delete transactions
async function deleteTransaction() {
    const transactionId = this.parentNode.dataset.id
    try {
        const response = await fetch('transactions/deleteTransaction', {
            method: 'delete',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'transactionIdFromJSFile': transactionId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch (err) {
        console.log(err)
    }
}

//Adding event listeners to equal/other amount radio buttons
otherAmountBtn.addEventListener('click', showOtherAmountOptions)
equallyBtn.addEventListener('click', showOtherAmountOptions)

//If "Other" amount is selected then show additional input; if "equally" selected then remove
function showOtherAmountOptions() {
    const otherAmountForm = document.getElementById('extra-input-form');
    if (otherAmountBtn.checked) {
        otherAmountForm.classList.remove('hidden');
    }
    if (equallyBtn.checked) {
        otherAmountForm.classList.add('hidden');
    }
}

