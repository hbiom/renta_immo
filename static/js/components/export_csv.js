function obj2htmltable(obj) {
  //  creer une table HTML à partir d'un dico creer dans utils/simulation_amortissement ou simulation_abbatement
  var cols = []
  var html = '<table>';
  html += '<tr>'
  html += '<thead>'
  for (var key in obj) {
    var item = obj[key];
      html += '<th>' + key + '</th>';
    cols.push(item)
    var dico_size = Object.keys(item).length - 1
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



export { obj2htmltable, downloadCSV, exportTableToCSV, downloadCSVButon };
