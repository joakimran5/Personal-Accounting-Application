from config import db


class BankTransactions(db.Model):
    __tablename__ = "acc1_tsc"
    __table_args__ = {"schema": "bank"}

    tsc_id = db.Column(db.Integer, primary_key=True)
    tsc_dt = db.Column(db.String(80), unique=False, nullable=False)
    tsc_cat = db.Column(db.String(80), unique=False, nullable=False)
    tsc_descrp = db.Column(db.String(120), unique=False, nullable=False)
    tsc_amt = db.Column(db.String(80), unique=False, nullable=False)
    tsc_type = db.Column(db.String(80), unique=False, nullable=False)
    amt_bal = db.Column(db.String(120), unique=False, nullable=False)

    def to_json(self):
        return {
            "banktransactionId": self.tsc_id,
            "banktransactionDate": self.tsc_dt,
            "banktransactionCategory": self.tsc_cat,
            "banktransactionDescription": self.tsc_descrp,
            "banktransactionAmount": self.tsc_amt,
            "banktransactionType": self.tsc_type,
            "banktransactionAmountbalance": self.amt_bal,
        }