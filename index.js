// {
//     text: String,
//     amount: Number,
// }

const addButton = document.getElementById('addButton');
const closeButton = document.getElementById('closeButton')
let expenseTracker = document.getElementById('expenseTracker');
let inputBox = document.getElementById('inputBox')
let historyContainer = document.getElementById('historyContainer');
let toggleAddButton = 0;

let textInput = document.getElementById('text');
let amountInput = document.getElementById('amount');
let addTransaction = document.getElementById('addTransaction');

let transactions = [];

// retrieves data on load of webpage from localStorage.
let transactionsString = localStorage.getItem('transactions');
if (transactionsString)
    transactions = JSON.parse(transactionsString);


const displayTransactions = (obj) => {
    let historyComp = `
    <div class="border-x-[3px] p-4 rounded-md ${obj.amount < 0 ? 'border-red-500' : 'border-green-500 '} m-2 flex justify-between items-center z-0">
        <div>
            <h1 class="text-md font-bold ">${obj.text}</h1>
            <p class="font-bold text-md ${obj.amount < 0 ? 'text-red-500' : 'text-green-500'} ">${obj.amount < 0 ? `-$${obj.amount * -1}` : `+$${obj.amount}`}</p>
        </div>
        <div class = "hover:cursor-pointer" id = del-${obj.id}>
            <i class="fa fa-trash-o" aria-hidden="true"></i>
        </div>
    </div>`

    let div = document.createElement('div');
    div.innerHTML = historyComp;
    historyContainer.appendChild(div);
    document.getElementById(`del-${obj.id}`).addEventListener('click', () => {
        removeTransaction(obj.id);
        removeChild(historyContainer);

        transactions.forEach(obj => displayTransactions(obj));
    });
}

transactions.forEach(obj => displayTransactions(obj));

var totalTransaction = () => {
    let total = {
        credit: 0,
        debit: 0
    }
    transactions.forEach((obj) => {
        if (obj.amount > 0)
            total.credit += obj.amount;
        else
            total.debit += (obj.amount * -1);
    })
    // console.log(total)
    document.getElementById('credit-debit').innerHTML = `$${total.credit - total.debit}`;
    document.getElementById('creditValue').innerHTML = `$${total.credit}`;
    document.getElementById('debitValue').innerHTML = `$${total.debit}`;
    
    let percentage = (total.credit/(total.credit+total.debit))*100;
    expenseTracker.style = `width : ${percentage}%;`
}

totalTransaction();

const onCloseButton = () => {
    inputBox.style.display = "none";
    toggleAddButton = 0;
    addButton.style.display = "";
}

const onAddButton = () => {
    toggleAddButton = 1;
    addButton.style.display = "none";
    inputBox.style.display = "block";
}

//function to remove all child from DOM, from given parent element
const removeChild = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

var removeTransaction = (id) => {
    transactions.splice(id, 1);
    transactions.forEach((obj, i) => { obj.id = i });
    localStorage.setItem('transactions', JSON.stringify(transactions));
    totalTransaction();
}



addButton.addEventListener('click', onAddButton)

closeButton.addEventListener('click', onCloseButton)


//add transaction button
addTransaction.addEventListener('click', () => {
    onCloseButton();
    const text = textInput.value;
    const amount = Number(amountInput.value);
    textInput.value = "";
    amountInput.value = "";
    // console.log(amount)
    const id = transactions.length;
    if (!(text || amount))
        alert('Please Enter Text and Amount...');
    else if (!amount) {
        alert('Please Enter Right Amount...');
    }
    else if (!text) {
        alert('Please Enter the Text...');
    }
    else {
        const transactionObj = {
            id,
            text,
            amount
        }
        displayTransactions(transactionObj)
        transactions.push(transactionObj);
        totalTransaction();
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

})

