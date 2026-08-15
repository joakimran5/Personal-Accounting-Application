import Button from '@mui/material/Button';

const TransactionList = ({ 
    transactions,  
    updateTransaction, 
    updateCallback,
    previousMonth,
    nextMonth,
    currentMonth,
    transactionPlatform

}) => {

    const onDelete = async (tsc_id) => {
        try {

        const endpoint =
            transactionPlatform === "bank"
                ? "delete_bankTransaction"
                : "delete_tngTransaction";

        const url =
            `http://127.0.0.1:5000/${endpoint}/${tsc_id}`;

        const response = await fetch(url, {
            method: "DELETE"
        });

        if (response.ok) {
            updateCallback();
        } else {
            const data = await response.json();
            console.error(data.message || "Failed to delete");
        }

    } catch (error) {
        console.error(error);
        alert(error);
    }
};


    return (
    <div>

        <h2 className="title">
    {transactionPlatform === "bank"
        ? "Bank Transaction List"
        : "TnG Transaction List"}
</h2>

        <h2 className="month-title">
            {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
            })}
        </h2>


        <div className="month-navigation">

            <Button 
                variant="contained"
                color="info"
                onClick={previousMonth}
            >
                Previous
            </Button>


            <Button 
                variant="text"
                onClick={nextMonth}
            >
                Next
            </Button>

        </div>


        <table className="transaction-table">

            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Balance</th>
                    <th>Actions</th>
                </tr>
            </thead>


            <tbody>

            {
            transactions.length === 0 ? (

                <tr>
                    <td class="empty-table" colSpan="5">
                        No transactions found for this month.
                    </td>
                </tr>

            ) : (

                transactions.map((transaction) => (

                    <tr key={transaction.transactionId}>

                        <td>
                            {
                            new Date(
                                transaction.transactionDate
                            ).toLocaleDateString("en-GB")
                            }
                        </td>


                        <td>
                            {transaction.transactionDescription}
                        </td>


                        <td
                        className={
                            transaction.transactionType === "CDT"
                            ? "credit"
                            : "debit"
                        }
                        >

                        {
                        transaction.transactionType === "CDT"
                        ? `+${Number(transaction.transactionAmount)
                            .toLocaleString(undefined,{
                                minimumFractionDigits:0,
                                maximumFractionDigits:2
                            })}`

                        : `-${Number(transaction.transactionAmount)
                            .toLocaleString(undefined,{
                                minimumFractionDigits:0,
                                maximumFractionDigits:2
                            })}`
                        }

                        </td>


                        <td>
                            {transaction.transactionAmountbalance}
                        </td>


                        <td>

                            <button 
                            onClick={() => updateTransaction(transaction)}
                            >
                                Update
                            </button>


                            <button 
                            onClick={() => onDelete(transaction.transactionId)}
                            >
                                Delete
                            </button>

                        </td>


                    </tr>

                ))
            )}

            </tbody>

        </table>



        <div className="month-navigation">

            <Button 
                variant="contained"
                color="info"
                onClick={previousMonth}
            >
                Previous
            </Button>


            <Button 
                variant="text"
                onClick={nextMonth}
            >
                Next
            </Button>

        </div>


    </div>
    );
};

export default TransactionList;