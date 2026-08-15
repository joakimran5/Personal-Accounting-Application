import { useState, useEffect } from "react";
import TransactionList from "../components/TransactionList";
import TransactionUpdateForm from "../components/TransactionUpdateForm";
import TransactionSheet from "../components/TransactionSheetForm";

function TransactionPage() {
    const [transactionType, setTransactionType] = useState("bank");
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

    const response = await fetch(
        `http://127.0.0.1:5000/bankTransactions/${year}/${month}`
    );

    const data = await response.json();
    setTransactions(data);
};

  useEffect(() => {
    fetchTransaction();
}, [currentMonth]);

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
console.log("transactionType:", transactionType)
return(
<>
  <button onClick={() => setTransactionType("bank")}>
    Bank
</button>

<button onClick={() => setTransactionType("tng")}>
    TnG
</button>
 <TransactionList 
      transactions={transactions} 
      updateTransaction={openEditModal} 
      updateCallback={onUpdate}
      previousMonth={previousMonth}
      nextMonth={nextMonth}
      currentMonth={currentMonth}
      transactionType={transactionType}
      />
      {isModalOpen && <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <TransactionUpdateForm 
          existingTransaction={currentTransaction} 
          updateCallback={onUpdate}
          transactionType={transactionType}
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
            transactionType={transactionType}
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