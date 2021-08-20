from flask import Flask
from flask import render_template
from utility import simulation_mensuelle, prix_du_pret, calcul_impot
from utility import simulation_amortissement, simulation_abbatement
from utility import int_converter, float_converter

#  https://sass.github.io/libsass-python/frameworks/flask.html
from sassutils.wsgi import SassMiddleware

app = Flask(__name__)

app.wsgi_app = SassMiddleware(app.wsgi_app, {
    'app': ('static/sass', 'static/css', '/static/css')
})


@app.route('/')
def home_page():
    return render_template('index.html')







if __name__ == '__main__':
    app.run(debug=True)
