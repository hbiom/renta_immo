

function acquisitionPriceExctractor(element, regime) {
  // extrait les données charges et durée d'amortissement correspondante parregime dans un json
  if (regime == "foncier_reel") {
    var amortissement = {}
    for (child of element.children) {
      var cost_name = child.className;
      if (child.className == "Travaux") {
        // console.log(cost_name)
        var prix = parseInt(child.children[1].value)|| 0;
        var nbr_année = parseInt(child.children[3].value)|| 1;

        var cat = {
          prix,
          nbr_année
        }
        amortissement[cost_name] = cat;
      }
    }
  } else if (regime == "LMNP") {
    var amortissement = {}
      for (child of element.children) {
        var cost_name = child.className;
        var prix = parseInt(child.children[1].value)|| 0;
        var nbr_année = parseInt(child.children[3].value)|| 1;

        var cat = {
          prix,
          nbr_année
        }
        amortissement[cost_name] = cat;
      }
    }
  return amortissement
}


function obj2htmltable(obj) {
  //  creer une table HTML à partir d'un dico creer dans utils/simulation_amortissement ou simulation_abbatement
  cols = []
  var html = '<table>';
  html += '<tr>'
  html += '<thead>'
  for (var key in obj) {
    var item = obj[key];
      html += '<th>' + key + '</th>';
    cols.push(item)
    dico_size = Object.keys(item).length - 1
  };
  html += '<tr>'
  html += '</thead>'
    for (let i =0; i <= dico_size; i++) {
      html += '<tr>'
      for (const element of cols) {
        html += '<td>' + element[i] + '</td>';
      }
      html += '</tr>'
    };
  html += '</table>';
  return html;
};


// adapted from https://www.codexworld.com/export-html-table-data-to-csv-using-javascript/#:~:text=JavaScript%20Code&text=The%20downloadCSV()%20function%20takes,data%20in%20a%20CSV%20file.&text=The%20exportTableToCSV()%20function%20creates,using%20the%20downloadCSV()%20function.
function downloadCSV(csv, filename) {
  // Télécharge table en csv
  var csvFile;
  var downloadLink;

  // CSV file
  csvFile = new Blob([csv], {type: "text/csv"});

  // Download link
  downloadLink = document.createElement("a");

  // File name
  downloadLink.download = filename;

  // Create a link to the file
  downloadLink.href = window.URL.createObjectURL(csvFile);

  // Hide download link
  downloadLink.style.display = "none";

  // Add the link to DOM
  document.body.appendChild(downloadLink);

  // Click download link
  downloadLink.click();
}


function exportTableToCSV(filename, table) {
  // Télécharge table en csv
  var csv = [];
  var rows = table.querySelectorAll("table tr");


  for (var i = 0; i < rows.length; i++) {
    var row = [], cols = rows[i].querySelectorAll("td, th");

    for (var j = 0; j < cols.length; j++)
        row.push(cols[j].innerText);

    csv.push(row.join(","));
  }
  // Download CSV file
  downloadCSV(csv.join("\n"), filename);
}

function extractResume(obj, divElement) {
  var cashflow = obj["Cashflow"][0];
  var impot = obj["Impot"][0];

  var classimpot = divElement.getElementsByClassName("impot")[0];
  classimpot.innerHTML = impot

  var classimpot = divElement.getElementsByClassName("casflow")[0];
  classimpot.innerHTML = cashflow
};

function downloadCSVButon() {
  var buttonCsv = document.querySelectorAll('.buttonCsv');
  buttonCsv.forEach(element => {
    element.addEventListener('click', (event) => {
      var table = element.parentElement
      var filename = table.className.split(" ")[0] + ".csv" ;
      exportTableToCSV(filename, table)
    });
  });
};

function animateValue(obj, start, duration) {
  let startTimestamp = null;
  kpiValue.forEach(element=> {
    let end = parseInt(element.innerHTML)
    let step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      element.innerHTML = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
  window.requestAnimationFrame(step);
  })
}

function colorValue(value) {
  valueCashflow = parseInt(value.innerHTML)
  console.log(value.innerHTML)
  if (valueCashflow < 0) {
    value.classList.remove("green");
    value.classList.add("red");
  } else if (valueCashflow > 0) {
    value.classList.remove("red");
    value.classList.add("green");
  }
}

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
      // pret_bancaire.setAttribute(interet_year, 0);

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
      // to refracto
      var table = element.parentElement.parentElement.parentElement.parentElement.children[2];
      console.log(table)
      table.classList.toggle("collapse");
    });
  });

});


function server_response(response) {
  // convert to json format
  var r = response
  // console.log(response)
  console.log(response)

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


  // AJAX
  // you can verify the data in the browser console
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
      // var Foncier_reel_value = document.querySelector('.Foncier_reel');

      var lmnp = acquisitionPriceExctractor(prix_acquisition, regime = "LMNP")
      var Foncier_reel = acquisitionPriceExctractor(prix_acquisition, regime = "foncier_reel")
      // var microbic = document.querySelector('.microbic');

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
      console.log(typeof data);

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
});

// Simulation Table
var tablelmnp = document.querySelector('.tablelmnp');
var tablefonciereel = document.querySelector('.tablefonciereel');
var tablemicro_bic = document.querySelector('.tablemicro_bic');
var tablemicrofoncier = document.querySelector('.tablemicrofoncier');
var tablemicro_tourisme = document.querySelector('.tablemicro_tourisme');



downloadCSVButon()
