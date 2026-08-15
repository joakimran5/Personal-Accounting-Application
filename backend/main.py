from datetime import date

from flask import request, jsonify
from config import app, db
from models import BankTransactions, TnGTransactions


# Bank Transaction History API Endpoints
@app.route("/bankTransactions", methods=["GET"])
def get_bankTransactions():
    bankTransactions = BankTransactions.query.all()

    json_bankTransactions = list(
        map(lambda x: x.to_json(), bankTransactions)
    )

    return jsonify({
        "bankTransactions": json_bankTransactions
    })

@app.route("/bankTransactions/<int:year>/<int:month>")
def get_transactions(year, month):

    start = date(year, month, 1)

    if month == 12:
        end = date(year + 1, 1, 1)
    else:
        end = date(year, month + 1, 1)

    transactions = BankTransactions.query.filter(
    BankTransactions.tsc_dt >= start,
    BankTransactions.tsc_dt < end
    ).all()

    return jsonify([
        transaction.to_json() for transaction in transactions
    ])

# For Bank TransactionSheet Multiple Rows Creation
@app.route("/create_bankTransactions", methods=["POST"])
def create_bankTransactions():

    transactions = request.json

    try:

        for row in transactions:

            new_transaction = BankTransactions(
                tsc_dt=row["transactionDate"],
                tsc_cat=row["transactionCategory"],
                tsc_descrp=row["transactionDescription"],
                tsc_amt=row["transactionAmount"],
                tsc_type=row["transactionType"],
                amt_bal=row["transactionAmountbalance"]
            )

            db.session.add(new_transaction)

        db.session.commit()

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": str(e)
        }),400


    return jsonify({
        "message":"Transactions created"
    }),201

#Dropdown for Transaction Categories
@app.route("/transactionCategories", methods=["GET"])
def get_transactionCategories():

    categories = db.session.query(
        BankTransactions.tsc_cat
    ).distinct().all()

    return jsonify([
        category[0] for category in categories
    ])

#Dropdown for Transaction Descriptions
@app.route("/transactionDescriptions", methods=["GET"])
def get_transactionDescriptions():

    descriptions = db.session.query(
        BankTransactions.tsc_descrp
    ).distinct().all()

    return jsonify([
        description[0] for description in descriptions
    ])

@app.route("/update_bankTransaction/<int:tsc_id>", methods=["PATCH"])
def update_bankTransaction(tsc_id):
    bankTransaction = BankTransactions.query.get(tsc_id)

    if not bankTransaction:
        return jsonify({"message": "Bank Transaction not found"}), 404

    data = request.json
    bankTransaction.tsc_dt = data.get("transactionDate", bankTransaction.tsc_dt)
    bankTransaction.tsc_cat = data.get("transactionCategory", bankTransaction.tsc_cat)
    bankTransaction.tsc_descrp = data.get("transactionDescription", bankTransaction.tsc_descrp)
    bankTransaction.tsc_amt = data.get("transactionAmount", bankTransaction.tsc_amt)
    bankTransaction.tsc_type = data.get("transactionType", bankTransaction.tsc_type)
    bankTransaction.amt_bal = data.get("transactionAmountbalance", bankTransaction.amt_bal)

    db.session.commit()

    return jsonify({"message": "Bank Transaction History updated."}), 200


@app.route("/delete_bankTransaction/<int:tsc_id>", methods=["DELETE"])
def delete_bankTransaction(tsc_id):
    bankTransaction = BankTransactions.query.get(tsc_id)

    if not bankTransaction:
        return jsonify({"message": "Bank Transaction not found"}), 404

    db.session.delete(bankTransaction)
    db.session.commit()

    return jsonify({"message": "Bank Transaction deleted!"}), 200

#######################################################################################
#######################################################################################
# TnG E-wallet Transaction History API Endpoints
# retrieve all TnG transactions
@app.route("/tngTransactions", methods=["GET"])
def get_tngTransactions():
    tngTransactions = TnGTransactions.query.all()

    json_tngTransactions = list(
        map(lambda x: x.to_json(), tngTransactions)
    )

    return jsonify({
        "tngTransactions": json_tngTransactions
    })

@app.route("/tngTransactions/<int:year>/<int:month>")
def get_tngtransactions(year, month):

    start = date(year, month, 1)

    if month == 12:
        end = date(year + 1, 1, 1)
    else:
        end = date(year, month + 1, 1)

    transactions = TnGTransactions.query.filter(
    TnGTransactions.tsc_dt >= start,
    TnGTransactions.tsc_dt < end
    ).all()

    return jsonify([
        transaction.to_json() for transaction in transactions
    ])

# TnG Transaction Creation
@app.route("/create_tngTransactions", methods=["POST"])
def create_tngTransactions():

    tng_transactions = request.json

    try:

        for row in tng_transactions:

            new_transaction = TnGTransactions(
                tsc_dt=row["transactionDate"],
                tsc_cat=row["transactionCategory"],
                tsc_descrp=row["transactionDescription"],
                tsc_amt=row["transactionAmount"],
                tsc_type=row["transactionType"],
                # amt_bal=row["transactionAmountbalance"],
                tsc_time=row["transactionTime"]
            )

            db.session.add(new_transaction)

        db.session.commit()

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": str(e)
        }),400


    return jsonify({
        "message":"TnG Transactions created"
    }),201

# Update TnG Transaction
@app.route("/update_tngTransaction/<int:tsc_id>", methods=["PATCH"])
def update_tngTransaction(tsc_id):
    tngTransaction = TnGTransactions.query.get(tsc_id)

    if not tngTransaction:
        return jsonify({"message": "TnG Transaction not found"}), 404

    data = request.json
    tngTransaction.tsc_dt = data.get("transactionDate", tngTransaction.tsc_dt)
    tngTransaction.tsc_descrp = data.get("transactionDescription", tngTransaction.tsc_descrp)
    tngTransaction.tsc_amt = data.get("transactionAmount", tngTransaction.tsc_amt)
    tngTransaction.tsc_type = data.get("transactionType", tngTransaction.tsc_type)
    tngTransaction.amt_bal = data.get("transactionAmountbalance", tngTransaction.amt_bal)
    tngTransaction.tsc_time = data.get("transactionTime", tngTransaction.tsc_time)

    db.session.commit()

    return jsonify({"message": "TnG Transaction updated."}), 200

# Delete TnG Transaction
@app.route("/delete_tngTransaction/<int:tsc_id>", methods=["DELETE"])
def delete_tngTransaction(tsc_id):
    tngTransaction = TnGTransactions.query.get(tsc_id)

    if not tngTransaction:
        return jsonify({"message": "TnG Transaction not found"}), 404

    db.session.delete(tngTransaction)
    db.session.commit()

    return jsonify({"message": "TnG Transaction deleted!"}), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)