from config import db


class BankTransactions(db.Model):
    __tablename__ = "acc1_tsc"
    __table_args__ = {"schema": "bank"}

    tsc_id = db.Column(db.Integer, primary_key=True)
    tsc_dt = db.Column(db.Date, unique=False, nullable=False)
    tsc_cat = db.Column(db.String(80), unique=False, nullable=False)
    tsc_descrp = db.Column(db.String(120), unique=False, nullable=False)
    tsc_amt = db.Column(db.String(80), unique=False, nullable=False)
    tsc_type = db.Column(db.String(80), unique=False, nullable=False)
    amt_bal = db.Column(db.String(120), unique=False, nullable=False)

    def to_json(self):
        return {
            "transactionId": self.tsc_id,
            "transactionDate": self.tsc_dt,
            "transactionCategory": self.tsc_cat,
            "transactionDescription": self.tsc_descrp,
            "transactionAmount": self.tsc_amt,
            "transactionType": self.tsc_type,
            "transactionAmountbalance": self.amt_bal,
        }

class TnGTransactions(db.Model):
    __tablename__ = "tng_tsc"
    __table_args__ = {"schema": "wallet"}

    tsc_id = db.Column(db.Integer, primary_key=True)
    tsc_dt = db.Column(db.Date, unique=False, nullable=False)
    tsc_cat = db.Column(db.String(30), unique=False, nullable=False)
    tsc_descrp = db.Column(db.String(50), unique=False, nullable=False)
    tsc_amt = db.Column(db.Numeric(8,2), unique=False, nullable=False)
    tsc_type = db.Column(db.String(3), unique=False, nullable=False)
    amt_bal = db.Column(db.Numeric(8,2), unique=False, nullable=True)
    tsc_time = db.Column(db.Time, unique=False, nullable=False)

    def to_json(self):
        return {
            "transactionId": self.tsc_id,
            "transactionDate": self.tsc_dt,
            "transactionCategory": self.tsc_cat,
            "transactionDescription": self.tsc_descrp,
            "transactionAmount": self.tsc_amt,
            "transactionType": self.tsc_type,
            "transactionAmountbalance": self.amt_bal,
            "transactionTime": self.tsc_time.strftime("%H:%M") if self.tsc_time else None
        }