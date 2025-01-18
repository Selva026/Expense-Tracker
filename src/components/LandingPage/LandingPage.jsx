import styles from './LandingPage.module.css';
import { useEffect, useState } from "react";
import Card from '../Cards/Cards';
import TransactionList from "../../components/TransactionList/TransactionList";
import ExpenseForm from "../../components/Forms/ExpenseForm/ExpenseForm";
import Modal from "../../components/Modal/Modal";
import AddBalanceForm from "../../components/Forms/AddBalanceForm/AddBalanceForm";
import PieChart from "../../components/PieChart/PieChart";
import BarChart from "../../components/BarChart/BarChart";

function LandingPage() {
  const [balance, setBalance] = useState(() => {
    const localBalance = localStorage.getItem("balance");
    return localBalance ? Number(localBalance) : 5000; // Default balance
  });
  const [expense, setExpense] = useState(0);
  const [expenseList, setExpenseList] = useState(() => {
    const items = JSON.parse(localStorage.getItem("expenses"));
    return items || []; // Default expense list
  });
  const [isMounted, setIsMounted] = useState(false);

  const [isOpenExpense, setIsOpenExpense] = useState(false);
  const [isOpenBalance, setIsOpenBalance] = useState(false);

  const [categorySpends, setCategorySpends] = useState({
    food: 0,
    entertainment: 0,
    travel: 0,
  });
  const [categoryCount, setCategoryCount] = useState({
    food: 0,
    entertainment: 0,
    travel: 0,
  });

  // Initial setup for localStorage data
  useEffect(() => {
    try {
      const localBalance = localStorage.getItem("balance");
      const localExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

      if (localBalance) {
        setBalance(Number(localBalance));
      } else {
        setBalance(5000); // Default value
        localStorage.setItem("balance", 5000);
      }

      setExpenseList(localExpenses);
    } catch (error) {
      console.error("LocalStorage error:", error);
      setBalance(5000); // Default fallback
      setExpenseList([]);
    }
    setIsMounted(true);
  }, []);

  // Watch expenseList and calculate expenses + category breakdown
  useEffect(() => {
    if (expenseList.length > 0 || isMounted) {
      localStorage.setItem("expenses", JSON.stringify(expenseList));
    }

    // Calculate total expenses
    const totalExpense = expenseList.reduce(
      (accumulator, currentValue) => accumulator + Number(currentValue.price),
      0
    );
    setExpense(totalExpense);

    // Calculate category breakdown
    const categoryBreakdown = expenseList.reduce(
      (acc, item) => {
        acc.spends[item.category] =
          (acc.spends[item.category] || 0) + Number(item.price);
        acc.count[item.category] = (acc.count[item.category] || 0) + 1;
        return acc;
      },
      { spends: { food: 0, entertainment: 0, travel: 0 }, count: {} }
    );

    setCategorySpends(categoryBreakdown.spends);
    setCategoryCount(categoryBreakdown.count);
  }, [expenseList, isMounted]);

  // Watch balance and persist to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("balance", balance);
    }
  }, [balance, isMounted]);

  return (
    <div className={styles.container}>
      <h1>Expense Tracker</h1>

      <div className={styles.cardsWrapper}>
        <Card
          title="Wallet Balance"
          money={balance}
          buttonText="+ Add Income"
          buttonType="success"
          handleClick={() => {
            setIsOpenBalance(true);
          }}
        />

        <Card
          title="Expenses"
          money={expense}
          buttonText="+ Add Expense"
          buttonType="failure"
          success={false}
          handleClick={() => {
            setIsOpenExpense(true);
          }}
        />

        <PieChart
          data={[
            { name: "Food", value: categorySpends.food || 0 },
            { name: "Entertainment", value: categorySpends.entertainment || 0 },
            { name: "Travel", value: categorySpends.travel || 0 },
          ]}
        />
      </div>

      <div className={styles.transactionsWrapper}>
        <TransactionList
          transactions={expenseList}
          editTransactions={setExpenseList}
          title="Recent Transactions"
          balance={balance}
          setBalance={setBalance}
        />

        <BarChart
          data={[
            { name: "Food", value: categorySpends.food || 0 },
            { name: "Entertainment", value: categorySpends.entertainment || 0 },
            { name: "Travel", value: categorySpends.travel || 0 },
          ]}
        />
      </div>

      <Modal isOpen={isOpenExpense} setIsOpen={setIsOpenExpense}>
        <ExpenseForm
          setIsOpen={setIsOpenExpense}
          expenseList={expenseList}
          setExpenseList={setExpenseList}
          setBalance={setBalance}
          balance={balance}
        />
      </Modal>

      <Modal isOpen={isOpenBalance} setIsOpen={setIsOpenBalance}>
        <AddBalanceForm setIsOpen={setIsOpenBalance} setBalance={setBalance} />
      </Modal>
    </div>
  );
}

export default LandingPage;
