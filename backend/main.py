import fastapi
from fastapi.middleware.cors import CORSMiddleware
import sqlmodel
from datetime import date
from typing import Optional
from enum import Enum

# SQL MODEL

# connect to database
db_url = "mysql+pymysql://root:root@localhost:3306/skarbonka"
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


def getCategories():
    with sqlmodel.Session(engine) as session:
        statement = sqlmodel.select(Categories)
        results = session.exec(statement)
        return results.all()


@app.get("/categories/")
async def read_categories():
    return getCategories()


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


def getCategoryId(category_name: str):
    categories = getCategories()
    for category in categories:
        if category.category_name == category_name:
            return category.category_id


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
        results_transactions.sort(key=lambda x: x["transaction_id"], reverse=True)
        return results_transactions


@app.get("/transactions/")
async def read_transactions():
    return getTransactions()


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


@app.post("/transactions/add/")
async def add_transaction(transaction: TransactionsCreate):
    with sqlmodel.Session(engine) as session:
        category_names = [category.category_name for category in getCategories()]

        if transaction.category_name not in category_names:
            add_category(transaction.category_name)

        new_transaction = Transactions(
            transaction_date=transaction.transaction_date,
            transaction_value=transaction.transaction_value,
            transaction_type=transaction.transaction_type,
            category_id=getCategoryId(transaction.category_name),
        )

        session.add(new_transaction)
        session.commit()
        return {"message": "Transaction was added"}


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

        current_categories_ids = {
            getCategoryId(transaction["category_name"])
            for transaction in getTransactions()
        }

        if transaction.category_id not in current_categories_ids:
            del_category(transaction.category_id)

        return {"message": "Transaction was deleted"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
