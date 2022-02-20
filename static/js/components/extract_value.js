function extractResume(obj, divElement) {
  var cashflow = obj["Cashflow"][0];
  var impot = obj["Impot"][0];

  var classimpot = divElement.getElementsByClassName("impot")[0];
  classimpot.innerHTML = impot

  var classimpot = divElement.getElementsByClassName("casflow")[0];
  classimpot.innerHTML = cashflow
};



function colorValue(value) {
  var valueCashflow = parseInt(value.innerHTML)
  if (valueCashflow < 0) {
    value.classList.remove("green");
    value.classList.add("red");
  } else if (valueCashflow > 0) {
    value.classList.remove("red");
    value.classList.add("green");
  }
}


export { extractResume, colorValue };
