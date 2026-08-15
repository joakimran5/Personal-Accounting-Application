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

# #Single Row Creation
# @app.route("/create_bankTransaction", methods=["POST"])
# def create_bankTransaction():
#     bankTransaction_date = request.json.get("banktransactionDate")
#     bankTransaction_category = request.json.get("banktransactionCategory")
#     bankTransaction_description = request.json.get("banktransactionDescription")
#     bankTransaction_amount = request.json.get("banktransactionAmount")
#     bankTransaction_type = request.json.get("banktransactionType")
#     bankAmount_balance = request.json.get("banktransactionAmountbalance")


#     if not bankTransaction_date or not bankTransaction_amount or not bankTransaction_type:
#     # if not bankTransaction_date:
#         return (
#             jsonify({"message": "You must include a date, amount and type"}),
#             400,
#         )

#     new_bankTransaction = BankTransactions(
#                                    tsc_dt=bankTransaction_date, 
#                                    tsc_cat=bankTransaction_category, 
#                                    tsc_descrp=bankTransaction_description, 
#                                    tsc_amt=bankTransaction_amount, 
#                                    tsc_type=bankTransaction_type, 
#                                    amt_bal=bankAmount_balance
#                                    )
#     try:
#         db.session.add(new_bankTransaction)
#         db.session.commit()
#     except Exception as e:
#         return jsonify({"message": str(e)}), 400

#     return jsonify({"message": "Transaction History created!"}), 201

# For Bank TransactionSheet Multiple Rows Creation
@app.route("/create_bankTransactions", methods=["POST"])
def create_bankTransactions():

    transactions = request.json

    try:

        for row in transactions:

            new_transaction = BankTransactions(
                tsc_dt=row["banktransactionDate"],
                tsc_cat=row["banktransactionCategory"],
                tsc_descrp=row["banktransactionDescription"],
                tsc_amt=row["banktransactionAmount"],
                tsc_type=row["banktransactionType"],
                amt_bal=row["banktransactionAmountbalance"]
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

    # return jsonify([
    #     category[0] for category in categories
    # ])

@app.route("/update_bankTransaction/<int:tsc_id>", methods=["PATCH"])
def update_bankTransaction(tsc_id):
    bankTransaction = BankTransactions.query.get(tsc_id)

    if not bankTransaction:
        return jsonify({"message": "Bank Transaction not found"}), 404

    data = request.json
    bankTransaction.tsc_dt = data.get("banktransactionDate", bankTransaction.tsc_dt)
    bankTransaction.tsc_descrp = data.get("banktransactionDescription", bankTransaction.tsc_descrp)
    bankTransaction.tsc_amt = data.get("banktransactionAmount", bankTransaction.tsc_amt)
    bankTransaction.tsc_type = data.get("banktransactionType", bankTransaction.tsc_type)
    bankTransaction.amt_bal = data.get("banktransactionAmountbalance", bankTransaction.amt_bal)

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


# if __name__ == "__main__":
#     with app.app_context():
#         db.create_all()

#     app.run(debug=True)
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

# TnG Transaction Creation
@app.route("/create_tngTransaction", methods=["POST"])
def create_tngTransaction():
    tngTransaction_date = request.json.get("tngtransactionDate")
    tngTransaction_category = request.json.get("tngtransactionCategory")
    tngTransaction_description = request.json.get("tngtransactionDescription")
    tngTransaction_amount = request.json.get("tngtransactionAmount")
    tngTransaction_type = request.json.get("tngtransactionType")
    tngAmount_balance = request.json.get("tngtransactionAmountbalance")

    if not tngTransaction_date or not tngTransaction_amount or not tngTransaction_type:
    # if not tngTransaction_date:
        return (
            jsonify({"message": "You must include a date, amount and type"}),
            400,
        )

    new_tngTransaction = TnGTransactions(
                                   tsc_dt=tngTransaction_date, 
                                   tsc_cat=tngTransaction_category, 
                                   tsc_descrp=tngTransaction_description, 
                                   tsc_amt=tngTransaction_amount, 
                                   tsc_type=tngTransaction_type, 
                                   amt_bal=tngAmount_balance
                                   )
    try:
        db.session.add(new_tngTransaction)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "Transaction History created!"}), 201

# Update TnG Transaction
@app.route("/update_tngTransaction/<int:tsc_id>", methods=["PATCH"])
def update_tngTransaction(tsc_id):
    tngTransaction = TnGTransactions.query.get(tsc_id)

    if not tngTransaction:
        return jsonify({"message": "TnG Transaction not found"}), 404

    data = request.json
    tngTransaction.tsc_dt = data.get("tngtransactionDate", tngTransaction.tsc_dt)
    tngTransaction.tsc_descrp = data.get("tngtransactionDescription", tngTransaction.tsc_descrp)
    tngTransaction.tsc_amt = data.get("tngtransactionAmount", tngTransaction.tsc_amt)
    tngTransaction.tsc_type = data.get("tngtransactionType", tngTransaction.tsc_type)
    tngTransaction.amt_bal = data.get("tngtransactionAmountbalance", tngTransaction.amt_bal)
    tngTransaction.tsc_time = data.get("tngtransactionTime", tngTransaction.tsc_time)

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