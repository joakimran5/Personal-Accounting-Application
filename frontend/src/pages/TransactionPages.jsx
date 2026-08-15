import { useState, useEffect } from "react";
import TransactionList from "../components/TransactionList";
import TransactionUpdateForm from "../components/TransactionUpdateForm";
import TransactionSheet from "../components/TransactionSheetForm";

function TransactionPage() {
    const [transactionPlatform, setTransactionPlatform] = useState("bank");
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentTransaction, setCurrentTransaction] = useState({})
    const [currentMonth, setCurrentMonth] = useState(() => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - 1);
    return date;
});
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const fetchTransaction = async () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;

    const endpoint =
        transactionPlatform === "bank"
            ? "bankTransactions"
            : "tngTransactions";

    const response = await fetch(
        `http://127.0.0.1:5000/${endpoint}/${year}/${month}`
    );

    const data = await response.json();
    setTransactions(data);
};

  useEffect(() => {
    fetchTransaction();
}, [currentMonth, transactionPlatform]);

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentTransaction({})
  }

  const openEditModal = (contact) => {
    if (!isModalOpen) setIsModalOpen(true)
    if (isModalOpen) return
    setCurrentTransaction(contact)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchTransaction()
  }

      const previousMonth = () => {
    setCurrentMonth(prev => {
        const date = new Date(prev);
        date.setMonth(date.getMonth() - 1);
        return date;
    });
    };

    const nextMonth = () => {
        setCurrentMonth(prev => {
            const date = new Date(prev);
            date.setMonth(date.getMonth() + 1);
            return date;
        });
    };

    const openSheetModal = () => {
    setIsSheetOpen(true);
};

const closeSheetModal = () => {
    setIsSheetOpen(false);
};

return(
<>
  <button onClick={() => setTransactionPlatform("bank")}>
    Bank
</button>

<button onClick={() => setTransactionPlatform("tng")}>
    TnG
</button>
 <TransactionList 
      transactions={transactions} 
      updateTransaction={openEditModal} 
      updateCallback={onUpdate}
      previousMonth={previousMonth}
      nextMonth={nextMonth}
      currentMonth={currentMonth}
      transactionPlatform={transactionPlatform}
      />
      {isModalOpen && <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <TransactionUpdateForm 
          existingTransaction={currentTransaction} 
          updateCallback={onUpdate}
          transactionPlatform={transactionPlatform}
           />
        </div>
      </div>
      }
      <button onClick={openSheetModal}>Open Transaction Sheet</button>
      {isSheetOpen && 
<div className="modal">

    <div className="modal-content">

        <span 
        className="close" 
        onClick={closeSheetModal}>
        &times;
        </span>


        <TransactionSheet 
            transactionPlatform={transactionPlatform}
            currentMonth={currentMonth}
            updateCallback={()=>{
                closeSheetModal();
                fetchTransaction();
            }}
        />


    </div>

</div>
}
</>
)
}
export default TransactionPage;