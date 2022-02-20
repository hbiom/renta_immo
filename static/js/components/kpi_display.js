
function animateValue(kpiValue, start, duration) {
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


function kpi_display() {
  $(window).on('scroll', function() {
      var element_position = $('.kpi-section').offset().top -650;
      var y_scroll_pos = window.pageYOffset;
      var scroll_pos_test = element_position;

      if(y_scroll_pos > scroll_pos_test) {
        var kpiValue = document.querySelectorAll('.kpi-value');
        animateValue(kpiValue, 0, 2000);
        $(window).off("scroll");
      }
  });
};


export { animateValue, kpi_display };

