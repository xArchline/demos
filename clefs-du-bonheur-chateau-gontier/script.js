// Les Clefs du Bonheur — small enhancements. The site is readable without JS.
(function () {
  var EMAIL = ""; // [À confirmer] — the hosts' e-mail address; leave empty until known
  var form = document.getElementById("form-dispo");
  var sel = form && form.querySelector("select[name=hebergement]");

  // "Demander la suite X" buttons preselect the unit; vélo button ticks the box
  document.querySelectorAll("[data-pick]").forEach(function (a) {
    a.addEventListener("click", function () { if (sel) sel.value = a.getAttribute("data-pick"); });
  });
  var veloBtn = document.querySelector("[data-velo]");
  if (veloBtn && form) veloBtn.addEventListener("click", function () { form.velo.checked = true; });

  // Dates: no past dates, departure after arrival
  function iso(d) { return d.toISOString().slice(0, 10); }
  if (form) {
    var today = iso(new Date());
    form.arrivee.min = today; form.depart.min = today;
    form.arrivee.addEventListener("change", function () {
      if (!form.arrivee.value) return;
      var n = new Date(form.arrivee.value); n.setDate(n.getDate() + 1);
      form.depart.min = iso(n);
      if (!form.depart.value || form.depart.value <= form.arrivee.value) form.depart.value = iso(n);
    });
  }

  function fr(v) { if (!v) return "?"; var p = v.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }

  // Demo form: never submits anywhere — shows a message + tel / SMS / mailto fallback
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var err = form.querySelector("[data-form-err]"), ok = form.querySelector("[data-form-ok]");
    var miss = [];
    if (!form.arrivee.value) miss.push("date d'arrivée");
    if (!form.depart.value) miss.push("date de départ");
    if (!form.nom.value.trim()) miss.push("nom");
    if (!form.email.value.trim() || !form.email.checkValidity()) miss.push("e-mail valide");
    if (miss.length) {
      err.textContent = "Merci d'indiquer : " + miss.join(", ") + ".";
      err.hidden = false; ok.hidden = true; return;
    }
    err.hidden = true;
    var txt = "Bonjour, je souhaite séjourner aux Clefs du Bonheur du " + fr(form.arrivee.value) +
      " au " + fr(form.depart.value) + " — " + form.adultes.value + " adulte(s), " + form.enfants.value +
      " enfant(s). Hébergement : " + sel.value + "." + (form.velo.checked ? " Je voyage à vélo." : "") +
      (form.message.value.trim() ? " " + form.message.value.trim() : "") +
      " " + form.nom.value.trim() + " · " + form.email.value.trim() + (form.tel.value.trim() ? " · " + form.tel.value.trim() : "");
    form.querySelector("[data-sms]").href = "sms:+33632381803?&body=" + encodeURIComponent(txt);
    var m = form.querySelector("[data-mailto]");
    if (EMAIL) m.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Demande de disponibilité") + "&body=" + encodeURIComponent(txt);
    else { m.removeAttribute("href"); m.setAttribute("aria-disabled", "true"); m.textContent = "E-mail [À confirmer]"; }
    ok.hidden = false; ok.focus();
  });

  // Lightbox (native <dialog>)
  var dlg = document.querySelector(".lightbox");
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-lb]"));
  if (dlg && dlg.showModal && links.length) {
    var img = dlg.querySelector("img"), cap = dlg.querySelector(".lb-cap"), cur = 0, group = [];
    function show(i) {
      cur = (i + group.length) % group.length;
      var a = group[cur], t = a.querySelector("img").alt;
      img.src = a.href; img.alt = t; cap.textContent = t;
    }
    links.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var g = a.closest("[data-gallery]");
        group = g ? Array.prototype.slice.call(g.querySelectorAll("[data-lb]")) : [a];
        show(group.indexOf(a)); dlg.showModal();
      });
    });
    dlg.querySelector(".lb-close").addEventListener("click", function () { dlg.close(); });
    dlg.querySelector(".lb-prev").addEventListener("click", function () { show(cur - 1); });
    dlg.querySelector(".lb-next").addEventListener("click", function () { show(cur + 1); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
  }
})();
