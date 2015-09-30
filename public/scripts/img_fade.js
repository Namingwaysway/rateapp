
var terms = ["AWFUL", "Magical", "Hot!!!", "Fun", "Sexy ;)", "Exciting", "Crazy", "Horrible!!", "the worst"]; //array of terms to rotate
function rotateTerm() {
  var ct = $("#rotate").data("term") || 0;
  $("#rotate").data("term", ct == terms.length -1 ? 0 : ct + 1).text(terms[ct])
              .fadeIn().delay(2000).fadeOut(200, rotateTerm);
}
$(rotateTerm); //start it on document.ready