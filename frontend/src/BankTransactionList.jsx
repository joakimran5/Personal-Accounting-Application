// import React from "react"

const BankTransactionList = ({ transactions, updateTransaction, updateCallback }) => {
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

    return <div>
        <h2>Bank Transactions List</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Balance</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((transaction) => (
                    <tr key={transaction.banktransactionId}>
                        <td>{new Date(transaction.banktransactionDate).toLocaleDateString("en-GB")}</td>
                        <td>{transaction.banktransactionDescription}</td>
                        <td>{transaction.banktransactionAmount}</td>
                        <td>{transaction.banktransactionType}</td>
                        <td>{transaction.banktransactionAmountbalance}</td>
                        <td>
                            <button onClick={() => updateTransaction(transaction)}>Update</button>
                            <button onClick={() => onDelete(transaction.banktransactionId)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

export default BankTransactionList