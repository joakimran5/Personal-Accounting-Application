import { useState, useEffect } from "react";
import TransactionList from "../components/TransactionList";
import TransactionUpdateForm from "../components/TransactionUpdateForm";
import TransactionSheet from "../components/TransactionSheetForm";
import Button from '@mui/material/Button';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  paddingLeft: '1150px',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

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
<Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
<Button 
                style={{ marginLeft: '950px'}}
                variant="contained"
                color="warning"
                onClick={() => setTransactionPlatform("bank")}
            >
                Bank
            </Button>
<Button 
                style={{ marginLeft: '10px'}}
                variant="contained"
                color="success"
                onClick={() => setTransactionPlatform("tng")}
            >
                TnG
            </Button>
  {/* <button onClick={() => setTransactionPlatform("bank")}>
    Bank
</button>

<button onClick={() => setTransactionPlatform("tng")}>
    TnG
</button> */}
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
      <Button 
                
                style={{ marginTop: '20px' , marginLeft: '120px'}}
                variant="contained"
                color="error"
                onClick={openSheetModal}
            >
                Open Transaction Sheet
            </Button>
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