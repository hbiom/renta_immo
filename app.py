from flask import Flask
from flask import render_template
from flask import request, jsonify

from utility import simulation_mensuelle, prix_du_pret, calcul_impot
from utility import simulation_amortissement, simulation_abbatement
from utility import int_converter, float_converter

#  https://sass.github.io/libsass-python/frameworks/flask.html
from sassutils.wsgi import SassMiddleware

app = Flask(__name__)

app.wsgi_app = SassMiddleware(app.wsgi_app, {
    'app': ('static/sass', 'static/css', '/static/css')
})



@app.route('/api', methods=['POST'])
def callapi():
  if request.method == 'POST':
    print(request.get_json(force=True))
    data = request.get_json(force=True)

    if not data:
      print("empty")
    else:
      prix_achat = int(data['prix_achat'])
      apport = int(data['apport'])
      nbrannee = int(data['nbrannee'])
      taux = float_converter(data['taux'])
      taux_Assurance = float_converter(data['taux_Assurance'])

      simu = simulation_mensuelle(prix_achat, apport, taux, taux_Assurance, nbrannee)
      prix = prix_du_pret(prix_achat, apport, taux, taux_Assurance, nbrannee)

      # revenu locatif imposable
      revenu_locatif = int(data['revenu_locatif_annuel'])
      sum_charge = int(data['sum_charge'])
      sum_charge_hors_pret = int(data['sum_charge_hors_pret'])
      # locatif_imposable = imposition_loyer(revenu_locatif, sum_charge,prix,nbrannee)

      # impot salaire
      salaire_imposable = int(data['salaire_imposable'])
      nbr_part = int(data['nbr_part'])
      impot, TMI = calcul_impot(salaire_imposable,nbr_part)

      regime_lmnp_value = data['lmnp']
      regime_Foncier_reel_value = data['Foncier_reel']

      lmnp = simulation_amortissement(regime_lmnp_value, revenu_locatif=revenu_locatif, charge=sum_charge, charge_hors_interet=sum_charge_hors_pret, année =nbrannee,tmi=TMI,mensualité=simu)
      regime_Foncier_reel_value = simulation_amortissement(regime_Foncier_reel_value, revenu_locatif=revenu_locatif, charge=sum_charge, charge_hors_interet=sum_charge_hors_pret, année =nbrannee,tmi=TMI,mensualité=simu)


      microbic = simulation_abbatement(revenu_locatif=revenu_locatif, charge_hors_interet=sum_charge_hors_pret, année =nbrannee, taux_abbatement=0.50,tmi=TMI,mensualité=simu)
      microfoncier = simulation_abbatement(revenu_locatif=revenu_locatif, charge_hors_interet=sum_charge_hors_pret, année =nbrannee, taux_abbatement=0.70,tmi=TMI,mensualité=simu)
      microtourisme =  simulation_abbatement(revenu_locatif=revenu_locatif, charge_hors_interet=sum_charge_hors_pret, année =nbrannee, taux_abbatement=0.30,tmi=TMI,mensualité=simu)

      json = jsonify({'mensualité': simu,
                      'prix':prix,
                      'impot_sur_le_revenu':impot,
                      'TMI':TMI,
                      'lmnp':lmnp,
                      'regime_Foncier_reel_value':regime_Foncier_reel_value,
                      'microbic':microbic,
                      'microfoncier':microfoncier,
                      'microtourisme':microtourisme})
      print(json)

    return json



@app.route('/')
def home_page():
  return render_template('index.html')







if __name__ == '__main__':
    app.run(debug=True)
