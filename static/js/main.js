import { acquisitionPriceExctractor } from './components/acquisitionPriceExctractor.js';
import { obj2htmltable, downloadCSV, exportTableToCSV, downloadCSVButon } from './components/export_csv.js';
import { kpi_display, animateValue } from './components/kpi_display.js';
import { extractResume, colorValue } from './components/extract_value.js';


$(document).ready(function() {

  var compute = document.querySelectorAll('.compute');

  compute.forEach(input => {
    input.addEventListener('input', (event) => {
      var taxe_fonciere = parseInt(document.querySelector('.taxe_fonciere').value) || 0;
      var frais_gestion = parseInt(document.querySelector('.frais_gestion').value) || 0;
      var assurance = parseInt(document.querySelector('.assurance').value) || 0;
      var entretien = parseInt(document.querySelector('.entretien').value) || 0;
      var charge_copro = parseInt(document.querySelector('.charge_copro').value) || 0;
      var autre = parseInt(document.querySelector('.autre').value) || 0;

      var result_prix = parseInt(document.querySelector('.result_prix').innerText);
      var nbrannee = parseInt(document.querySelector('.nbrannee').value) || 1;

      var interet_year =  parseInt(result_prix/nbrannee)
      var pret_bancaire = document.querySelector('.pret_bancaire');
      pret_bancaire.value = interet_year
      var sum_charge = document.querySelector('.sum_charge');
      sum_charge.innerHTML = taxe_fonciere + frais_gestion + assurance + entretien + charge_copro + autre + interet_year;
    });
  });

  var revenu_locatif = document.querySelectorAll('.revenu_locatif');
  revenu_locatif.forEach(input => {
    input.addEventListener('input', (event) => {
      var nbr_mois = document.querySelector('.nbr_mois').value|| 1;
      var loyer_mensuel = document.querySelector('.loyer_mensuel').value|| 0;
      var sum_loyer = nbr_mois * loyer_mensuel;
      var revenu_locatif_annuel = document.querySelector('.revenu_locatif_annuel').value = sum_loyer;
    });
  });


  var bank_input = document.querySelectorAll('.bank_input');
  var simulation_year = document.querySelectorAll('.simulation_year');

  simulation_year.forEach(element => {
    element.addEventListener('click', (event) => {
      var tables = element.closest('.subcontainer').querySelector(".padding-top");
      tables.classList.toggle("collapse");
    });
  });
});


function server_response(response) {
  var r = response
  var result_mensu = document.querySelector('.result_mensu');
  var result_prix = document.querySelector('.result_prix');
  var imposition = document.querySelector('#imposition');
  var impot_revenu = document.querySelector('#impot_revenu_result');
  var impot_revenu_locatif = document.querySelector('#impot_revenu_locatif');

  result_mensu.innerHTML = '<strong id="result">' + r.mensualité + '</strong>';
  result_prix.innerHTML = '<strong id="result">' + r.prix + '</strong>';

  var impot_perso = document.querySelectorAll('.impot_perso');

  impot_perso.forEach(function(item) {
    item.innerHTML = r.impot_sur_le_revenu;
  });

  var list = document.querySelectorAll(".casflow");

  //  Table IMPOT over time
  var tmi = r.TMI
  var tablelmnp = document.querySelector('.tablelmnp');
  var tablefonciereel = document.querySelector('.tablefonciereel');
  var tablemicro_bic = document.querySelector('.tablemicro_bic');
  var tablemicrofoncier = document.querySelector('.tablemicrofoncier');
  var tablemicro_tourisme = document.querySelector('.tablemicro_tourisme');

  tablelmnp.innerHTML = obj2htmltable(r.lmnp)
  tablefonciereel.innerHTML = obj2htmltable(r.regime_Foncier_reel_value)

  tablemicro_bic.innerHTML = obj2htmltable(r.microbic)
  tablemicrofoncier.innerHTML = obj2htmltable(r.microfoncier)
  tablemicro_tourisme.innerHTML = obj2htmltable(r.microtourisme)

  var resumeLMNP = document.querySelector('#resumeLMNP');
  var resumefoncierreel = document.querySelector('#resumefoncierreel');
  var resumemicrobic = document.querySelector('#resumemicrobic');
  var resumemicrofoncier = document.querySelector('#resumemicrofoncier');
  var resumemicrobictourisme = document.querySelector('#resumemicrobictourisme');

  extractResume(r.lmnp, resumeLMNP)
  extractResume(r.regime_Foncier_reel_value, resumefoncierreel)
  extractResume(r.microbic, resumemicrobic)
  extractResume(r.microfoncier, resumemicrofoncier)
  extractResume(r.microtourisme, resumemicrobictourisme)

  var casflow = document.querySelectorAll('.casflow');
  casflow.forEach(item => {colorValue(item)})
}



$(document).ready(function() {

  var compute = document.querySelectorAll('input');

  compute.forEach(item => {
    item.addEventListener('input', (event) => {
      var prix_achat = document.querySelector('.prix_achat').value || 0;
      var apport = document.querySelector('.apport').value || 0;
      var nbrannee = document.querySelector('.nbrannee').value || 1;
      var taux = document.querySelector('.taux').value|| 0;
      var taux_Assurance = document.querySelector('.taux_Assurance').value|| 0;

      var sum_charge = document.querySelector('.sum_charge').innerHTML|| 0;
      var revenu_locatif_annuel = document.querySelector('.revenu_locatif_annuel').value || 0;

      // charges
      var taxe_fonciere = parseInt(document.querySelector('.taxe_fonciere').value) || 0;
      var frais_gestion = parseInt(document.querySelector('.frais_gestion').value) || 0;
      var assurance = parseInt(document.querySelector('.assurance').value) || 0;
      var entretien = parseInt(document.querySelector('.entretien').value) || 0;
      var charge_copro = parseInt(document.querySelector('.charge_copro').value) || 0;
      var autre = parseInt(document.querySelector('.autre').value) || 0;

      var sum_charge_hors_pret = taxe_fonciere + frais_gestion + assurance + entretien + charge_copro + autre;

      var salaire_imposable = document.querySelector('.salaire_imposable').value || 0;
      var nbr_part = document.querySelector('.nbr_part').value || 1;
      var prix_acquisition = document.querySelector('.prix_acquisition');
      var lmnp = acquisitionPriceExctractor(prix_acquisition, "LMNP")
      var Foncier_reel = acquisitionPriceExctractor(prix_acquisition, "foncier_reel")

      var data = { prix_achat: prix_achat,
                    apport: apport,
                    nbrannee: nbrannee,
                    taux:taux,
                    taux_Assurance:taux_Assurance,
                    sum_charge:sum_charge,
                    sum_charge_hors_pret:sum_charge_hors_pret,
                    revenu_locatif_annuel:revenu_locatif_annuel,
                    salaire_imposable:salaire_imposable,
                    nbr_part:nbr_part,
                    lmnp:JSON.stringify(lmnp),
                    Foncier_reel:JSON.stringify(Foncier_reel)
                  }

      console.log(data)

      $.ajax({
          url: '/api',
          data: JSON.stringify(data),
          dataType: 'json',
          type: 'POST',
          success: function(data) {
            server_response(data)
          },
          error: function(error) {
            console.log(error);
          }
      });
    });
  });
  downloadCSVButon()
  kpi_display()
});


