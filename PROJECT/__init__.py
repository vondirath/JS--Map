from flask import (Flask, render_template)


app = Flask(__name__, static_folder='static')


@app.route('/', methods=["GET"])
def welcomepage():
    """Renders main template named index"""
    return render_template('index.html')
