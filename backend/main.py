from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Date,
    DECIMAL,
    Enum,
    SmallInteger,
    ForeignKey,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship

# Database configuration
DATABASE_URL = "mysql+pymysql://user:user@db/skarbonka"  # Adjust your credentials

# Setup SQLAlchemy
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Define Category model
class Category(Base):
    __tablename__ = "categories"
    category_id = Column(SmallInteger, primary_key=True, index=True)
    category_name = Column(String(32))


# Define Transaction model
class Transaction(Base):
    __tablename__ = "transactions"
    transaction_id = Column(Integer, primary_key=True, index=True)
    transaction_date = Column(Date)
    transaction_value = Column(DECIMAL(65, 2))
    transaction_type = Column(String(16))
    category_id = Column(SmallInteger, ForeignKey("categories.category_id"))

    category = relationship("Category")


# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI()


# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Response schema for transactions
class TransactionResponse:
    transaction_id: int
    transaction_date: str
    transaction_value: float
    transaction_type: str
    category_name: str


# Route to display all transactions
@app.get("/transactions/", response_model=list[TransactionResponse])
def read_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transactions = db.query(Transaction).join(Category).offset(skip).limit(limit).all()
    return [
        {
            "transaction_id": trans.transaction_id,
            "transaction_date": trans.transaction_date.strftime(
                "%Y-%m-%d"
            ),  # Formatting date
            "transaction_value": float(trans.transaction_value),
            "transaction_type": trans.transaction_type,
            "category_name": trans.category.category_name,
        }
        for trans in transactions
    ]


# Route to delete a transaction by ID
@app.delete("/del_transaction/{transaction_id}", status_code=204)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = (
        db.query(Transaction)
        .filter(Transaction.transaction_id == transaction_id)
        .first()
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(transaction)
    db.commit()
    return
