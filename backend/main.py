from flask import request, jsonify
from config import app, db
from models import BankTransactions

@app.route("/bankTransactions", methods=["GET"])
def get_bankTransactions():
    bankTransactions = BankTransactions.query.all()

    json_bankTransactions = list(
        map(lambda x: x.to_json(), bankTransactions)
    )

    return jsonify({
        "bankTransactions": json_bankTransactions
    })


@app.route("/create_bankTransaction", methods=["POST"])
def create_bankTransaction():
    bankTransaction_date = request.json.get("banktransactionDate")
    bankTransaction_category = request.json.get("banktransactionCategory")
    bankTransaction_description = request.json.get("banktransactionDescription")
    bankTransaction_amount = request.json.get("banktransactionAmount")
    bankTransaction_type = request.json.get("banktransactionType")
    bankAmount_balance = request.json.get("banktransactionAmountbalance")


    if not bankTransaction_date or not bankTransaction_amount or not bankTransaction_type:
    # if not bankTransaction_date:
        return (
            jsonify({"message": "You must include a date, amount and type"}),
            400,
        )

    new_bankTransaction = BankTransactions(
                                   tsc_dt=bankTransaction_date, 
                                   tsc_cat=bankTransaction_category, 
                                   tsc_descrp=bankTransaction_description, 
                                   tsc_amt=bankTransaction_amount, 
                                   tsc_type=bankTransaction_type, 
                                   amt_bal=bankAmount_balance
                                   )
    try:
        db.session.add(new_bankTransaction)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "Transaction History created!"}), 201


@app.route("/update_bankTransaction/<int:tsc_id>", methods=["PATCH"])
def update_bankTransaction(tsc_id):
    bankTransaction = BankTransactions.query.get(tsc_id)

    if not bankTransaction:
        return jsonify({"message": "Transaction not found"}), 404

    data = request.json
    bankTransaction.tsc_dt = data.get("banktransactionDate", bankTransaction.tsc_dt)
    bankTransaction.tsc_amt = data.get("banktransactionCategory", bankTransaction.tsc_amt)
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
        return jsonify({"message": "User not found"}), 404

    db.session.delete(bankTransaction)
    db.session.commit()

    return jsonify({"message": "User deleted!"}), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)