




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
  console.log("jbj kjb")
  return amortissement
}




export { acquisitionPriceExctractor };
