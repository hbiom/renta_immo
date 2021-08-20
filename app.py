from flask import Flask
from flask import render_template
#  https://pythonhosted.org/Flask-Scss/
from flask.ext.scss import Scss

app = Flask(__name__)
Scss(app, static_dir='static', asset_dir='assets')



@app.route('/')
def home_page():
    return render_template('index.html')







if __name__ == '__main__':
    app.run(debug=True)
