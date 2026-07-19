const BankTransactionList = ({ 
    transactions,  
    updateTransaction, 
    updateCallback,
    previousMonth,
    nextMonth,
    currentMonth }) => {
    const onDelete = async (tsc_id) => {
        try {
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_bankTransaction/${tsc_id}`, options)
            if (response.status === 200) {
                updateCallback()
            } else {
                console.error("Failed to delete")
            }
        } catch (error) {
            alert(error)
        }
    }

   



    return (
    <div>
        <h2>Bank Transactions List</h2>
         <h2>
    {currentMonth.toLocaleString("default", {
        month: "long",
        year: "numeric",
    })}
</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    {/* <th>Type</th> */}
                    <th>Balance</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((transaction) => (
                    <tr key={transaction.banktransactionId}>
                        <td>{new Date(transaction.banktransactionDate).toLocaleDateString("en-GB")}</td>
                        <td>{transaction.banktransactionDescription}</td>
                        <td
className={
    transaction.banktransactionType === "CDT"
    ? "credit"
    : "debit"
}
>
{
transaction.banktransactionType === "CDT"
? `+${transaction.banktransactionAmount}`
: `-${transaction.banktransactionAmount}`
}
</td>

{/* <td>{transaction.banktransactionType}</td> */}
                        <td
    className={
        transaction.banktransactionType === "CDT"
        ? "balanceCredit"
        : "balanceDebit"
    }
>
    {transaction.banktransactionAmountbalance}
</td>
                        <td>
                            <button onClick={() => updateTransaction(transaction)}>Update</button>
                            <button onClick={() => onDelete(transaction.banktransactionId)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
       

<button onClick={previousMonth}>Previous</button>
<button onClick={nextMonth}>Next</button>
    </div>
    )}

export default BankTransactionList