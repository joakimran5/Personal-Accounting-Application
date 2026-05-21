from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import text

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    "mssql+pyodbc://@Indra\\SQLEXPRESS01/"
    "FinanceWarehouseAnalytics"
    "?driver=ODBC+Driver+17+for+SQL+Server"
    "&trusted_connection=yes"
)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db=SQLAlchemy(app)

# with app.app_context():
#     with db.engine.connect() as conn:
#         result = conn.execute(
#             text("SELECT TOP 5 * FROM bank.acc1_tsc")
#         )

#         for row in result:
#             print(dict(row._mapping))