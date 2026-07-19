import Button from '@mui/material/Button';

const BankTransactionList = ({ 
    transactions,  
    updateTransaction, 
    updateCallback,
    previousMonth,
    nextMonth,
    currentMonth 
}) => {

    const onDelete = async (tsc_id) => {
        try {
            const options = {
                method: "DELETE"
            };

            const response = await fetch(
                `http://127.0.0.1:5000/delete_bankTransaction/${tsc_id}`,
                options
            );

            if (response.status === 200) {
                updateCallback();
            } else {
                console.error("Failed to delete");
            }

        } catch (error) {
            alert(error);
        }
    };


    return (
    <div>

        <h2 className="title">
            Bank Transactions List
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

                    <tr key={transaction.banktransactionId}>

                        <td>
                            {
                            new Date(
                                transaction.banktransactionDate
                            ).toLocaleDateString("en-GB")
                            }
                        </td>


                        <td>
                            {transaction.banktransactionDescription}
                        </td>


                        <td
                        className={
                            transaction.banktransactionType === "CDT"
                            ? "credit"
                            : "debit"
                        }
                        >

                        {
                        transaction.banktransactionType === "CDT"
                        ? `+${Number(transaction.banktransactionAmount)
                            .toLocaleString(undefined,{
                                minimumFractionDigits:0,
                                maximumFractionDigits:2
                            })}`

                        : `-${Number(transaction.banktransactionAmount)
                            .toLocaleString(undefined,{
                                minimumFractionDigits:0,
                                maximumFractionDigits:2
                            })}`
                        }

                        </td>


                        <td>
                            {transaction.banktransactionAmountbalance}
                        </td>


                        <td>

                            <button 
                            onClick={() => updateTransaction(transaction)}
                            >
                                Update
                            </button>


                            <button 
                            onClick={() => onDelete(transaction.banktransactionId)}
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


export default BankTransactionList;