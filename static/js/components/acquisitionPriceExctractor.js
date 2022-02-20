

function acquisitionPriceExctractor(element, regime) {
  // extrait les données charges et durée d'amortissement correspondante parregime dans un json
  var children = element.children
  if (regime == "foncier_reel") {
    var amortissement = {}

    for (var i = 0; i < children.length; i++) {
      var cost_name = children[i].className;
      if (children[i].className == "Travaux") {
        var prix = parseInt(children[i].children[1].value)|| 0;
        var nbr_année = parseInt(children[i].children[3].value)|| 1;

        var cat = {
          prix,
          nbr_année
        }
        amortissement[cost_name] = cat;
      }
    }

  } else if (regime == "LMNP") {
    var amortissement = {}

    for (var i = 0; i < children.length; i++) {
      var cost_name = children[i].className;
      var prix = parseInt(children[i].children[1].value)|| 0;
      var nbr_année = parseInt(children[i].children[3].value)|| 1;

      var cat = {
        prix,
        nbr_année
      }
      amortissement[cost_name] = cat;
    }

    }
  return amortissement
}




export { acquisitionPriceExctractor };
