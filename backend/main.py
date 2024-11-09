import fastapi
from fastapi.middleware.cors import CORSMiddleware
import sqlmodel
from datetime import date
from typing import Optional
from enum import Enum

# SQL MODEL

# connect to database
db_url = "mysql+pymysql://root:root@db:3306/skarbonka"
engine = sqlmodel.create_engine(db_url, echo=True)


# SQLModel models
class Categories(sqlmodel.SQLModel, table=True):
    category_id: Optional[int] = sqlmodel.Field(default=None, primary_key=True)
    category_name: str = sqlmodel.Field(max_length=32)


class TransactionType(str, Enum):
    income = "income"
    expense = "expense"


class Transactions(sqlmodel.SQLModel, table=True):
    transaction_id: Optional[int] = sqlmodel.Field(default=None, primary_key=True)
    transaction_date: date
    transaction_value: float
    transaction_type: TransactionType
    category_id: Optional[int] = sqlmodel.Field(
        default=None, foreign_key="categories.category_id"
    )


class TransactionsCreate(sqlmodel.SQLModel):
    transaction_date: date
    transaction_value: float
    transaction_type: TransactionType
    category_name: str


# FAST API

app = fastapi.FastAPI()


# returns all categories
def getCategories():
    with sqlmodel.Session(engine) as session:
        statement = sqlmodel.select(Categories)
        results = session.exec(statement)
        return results.all()


# endpoint to get all categories
@app.get("/categories/")
async def read_categories():
    return getCategories()


# endpoint to get category by id
@app.get("/categories/{category_id}/")
async def read_category(category_id: int):
    with sqlmodel.Session(engine) as session:
        statement = sqlmodel.select(Categories).where(
            Categories.category_id == category_id
        )
        results = session.exec(statement)
        category = results.first()
        if category is None:
            raise fastapi.HTTPException(status_code=404, detail="Category not found")
        return category


# get category id by name
def getCategoryId(category_name: str):
    categories = getCategories()
    for category in categories:
        if category.category_name == category_name:
            return category.category_id


# add new category
def add_category(category_name):
    with sqlmodel.Session(engine) as session:
        if category_name is None:
            raise fastapi.HTTPException(
                status_code=400, detail="Category name cannot be empty"
            )
        new_category = Categories(category_name=category_name)
        session.add(new_category)
        session.commit()
        return {"message": "Category was added"}


# delete category
def del_category(category_id: int):
    with sqlmodel.Session(engine) as session:
        statement = sqlmodel.select(Categories).where(
            Categories.category_id == category_id
        )
        results = session.exec(statement)
        category = results.first()
        if category is None:
            raise fastapi.HTTPException(status_code=404, detail="Category not found")
        session.delete(category)
        session.commit()
        return {"message": "Category was deleted"}


# get all transactions
def getTransactions():
    with sqlmodel.Session(engine) as session:
        statement = sqlmodel.select(
            Transactions.transaction_id,
            Transactions.transaction_date,
            Transactions.transaction_value,
            Transactions.transaction_type,
            Categories.category_name,
        ).join(Categories, Transactions.category_id == Categories.category_id)
        results = session.exec(statement)

        # create list of result transactions
        results_transactions = [
            {
                "transaction_id": row.transaction_id,
                "transaction_date": row.transaction_date,
                "transaction_value": row.transaction_value,
                "transaction_type": row.transaction_type,
                "category_name": row.category_name,
            }
            for row in results
        ]

        # sort the result transactions by id in descending order
        results_transactions.sort(key=lambda x: x["transaction_id"], reverse=True)

        return results_transactions


# endpoint to get all transactions
@app.get("/transactions/")
async def read_transactions():
    return getTransactions()


# endpoint to get transaction by id
@app.get("/transactions/{transaction_id}/")
async def read_transaction(transaction_id: int):
    with sqlmodel.Session(engine) as session:
        statement = sqlmodel.select(Transactions).where(
            Transactions.transaction_id == transaction_id
        )
        results = session.exec(statement)
        transaction = results.first()
        if transaction is None:
            raise fastapi.HTTPException(status_code=404, detail="Transaction not found")
        return transaction


# endpoint to add a new transaction
@app.post("/transactions/add/")
async def add_transaction(transaction: TransactionsCreate):
    with sqlmodel.Session(engine) as session:
        # get all current category names from table Categories
        category_names = [category.category_name for category in getCategories()]

        # if the new transaction has category which is not in the current categories, add the new category
        if transaction.category_name not in category_names:
            add_category(transaction.category_name)

        new_transaction = Transactions(
            transaction_date=transaction.transaction_date,
            transaction_value=transaction.transaction_value,
            transaction_type=transaction.transaction_type,
            # Transactions table requires category id, not name - translate category name to id
            category_id=getCategoryId(transaction.category_name),
        )

        session.add(new_transaction)
        session.commit()
        return {"message": "Transaction was added"}


# endpoint to delete transaction by id
@app.delete("/transactions/del/{transaction_id}/")
async def del_transactions(transaction_id: int):
    with sqlmodel.Session(engine) as session:
        statement = sqlmodel.select(Transactions).where(
            Transactions.transaction_id == transaction_id
        )
        results = session.exec(statement)
        transaction = results.first()
        if transaction is None:
            raise fastapi.HTTPException(status_code=404, detail="Transaction not found")
        session.delete(transaction)
        session.commit()

        # get set of existing categories in the Transactions table
        current_categories_ids = {
            getCategoryId(transaction["category_name"])
            for transaction in getTransactions()
        }

        # if category of the deleted transaction is not in the set of category names, delete the category from Categories table
        if transaction.category_id not in current_categories_ids:
            del_category(transaction.category_id)

        return {"message": "Transaction was deleted"}


# allow origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
