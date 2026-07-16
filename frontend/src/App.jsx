import { useState, useEffect } from "react";
import BankTransactionList from "./BankTransactionList";
import "./App.css";
import BankTransactionForm from "./BankTransactionForm";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState({})
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // const fetchTransaction = async () => {
  //   const response = await fetch("http://127.0.0.1:5000/bankTransactions");
  //   const data = await response.json();
  //   setTransactions(data.bankTransactions);
  // };

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

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (contact) => {
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


  return (
    <>
      <BankTransactionList 
      transactions={transactions} 
      updateTransaction={openEditModal} 
      updateCallback={onUpdate}
      previousMonth={previousMonth}
      nextMonth={nextMonth}
      currentMonth={currentMonth}
      />
      <button onClick={openCreateModal}>Create New Transaction</button>
      {isModalOpen && <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <BankTransactionForm existingTransaction={currentTransaction} updateCallback={onUpdate} />
        </div>
      </div>
      }
    </>
  );
}

export default App;