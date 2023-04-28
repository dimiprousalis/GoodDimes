const deleteBtn = document.querySelectorAll('.del')
const otherAmountBtn = document.querySelector('#otherAmountItem') //<= radio buttons for split
const equallyBtn = document.querySelector('#equallyItem') //<= radio buttons for split
const todoItem = document.querySelectorAll('span.not')
const todoComplete = document.querySelectorAll('span.completed')

// // Add buttons to make transaction entry form a pop out window
// const addButton = document.getElementById("add-transaction-button");
// const addForm = document.getElementById("add-transaction-form");

// // Show the form when the button is clicked
// addButton.addEventListener("click", function () {
//     addForm.classList.remove("hidden");
// });

// // Hide the form when the submit button is clicked
// addForm.addEventListener("submit", function () {
//     addForm.classList.add("hidden");
// });


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


// Array.from(todoItem).forEach((el)=>{
//     el.addEventListener('click', markComplete)
// })

Array.from(todoComplete).forEach((el) => {
    el.addEventListener('click', markIncomplete)
})




async function markComplete() {
    const todoId = this.parentNode.dataset.id
    try {
        const response = await fetch('todos/markComplete', {
            method: 'put',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch (err) {
        console.log(err)
    }
}

async function markIncomplete() {
    const todoId = this.parentNode.dataset.id
    try {
        const response = await fetch('todos/markIncomplete', {
            method: 'put',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch (err) {
        console.log(err)
    }
}