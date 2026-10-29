(function () {
  "use strict";

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizePartners(payload) {
    var source = Array.isArray(payload)
      ? payload
      : payload && Array.isArray(payload.data)
        ? payload.data
        : [];

    return source.map(function (partner) {
      return {
        id: partner.id || partner.name,
        name: partner.name || "Untitled partner",
        tier: partner.tier || "",
        regions: Array.isArray(partner.regions) ? partner.regions.filter(Boolean) : [],
        website: partner.website || "",
        email: partner.email || ""
      };
    });
  }

  function renderPartner(partner) {
    var tierClass = partner.tier
      ? " partner-card__tier--" + escapeHtml(partner.tier.toLowerCase())
      : "";
    var regions = partner.regions.length
      ? '<ul class="partner-card__regions">' +
        partner.regions
          .map(function (region) {
            return '<li class="partner-card__region">' + escapeHtml(region) + "</li>";
          })
          .join("") +
        "</ul>"
      : "";
    var website = partner.website
      ? '<a class="partner-card__link" href="' +
        escapeHtml(partner.website) +
        '" target="_blank" rel="noopener noreferrer">Visit website</a>'
      : "";
    var email = partner.email
      ? '<a class="partner-card__link" href="mailto:' +
        escapeHtml(partner.email) +
        '">' +
        escapeHtml(partner.email) +
        "</a>"
      : "";

    return (
      '<li class="partner-directory__item">' +
      '<article class="partner-card">' +
      '<div class="partner-card__top">' +
      '<h3 class="partner-card__name">' +
      escapeHtml(partner.name) +
      "</h3>" +
      (partner.tier
        ? '<p class="partner-card__tier' + tierClass + '">' + escapeHtml(partner.tier) + "</p>"
        : "") +
      "</div>" +
      regions +
      '<div class="partner-card__contacts">' +
      website +
      email +
      "</div>" +
      "</article>" +
      "</li>"
    );
  }

  function setStatus(status, message, isError) {
    if (!status) {
      return;
    }

    status.hidden = !message;
    status.textContent = message || "";
    status.classList.toggle("partner-directory__status--error", Boolean(isError));
  }

  function initDirectory(root) {
    var feedUrl = root.getAttribute("data-feed-url");
    var errorMessage =
      root.getAttribute("data-error-message") || "Partner data could not be loaded.";
    var status = root.querySelector(".partner-directory__status");
    var list = root.querySelector(".partner-directory__list");

    if (!feedUrl) {
      setStatus(status, errorMessage, true);
      return;
    }

    fetch(feedUrl, { credentials: "same-origin" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load partner feed");
        }
        return response.json();
      })
      .then(function (payload) {
        var partners = normalizePartners(payload);

        if (!partners.length) {
          list.innerHTML = "";
          list.hidden = true;
          setStatus(status, "No partners were found.", false);
          return;
        }

        list.hidden = false;
        list.innerHTML = partners.map(renderPartner).join("");
        setStatus(status, "", false);
      })
      .catch(function () {
        list.innerHTML = "";
        list.hidden = true;
        setStatus(status, errorMessage, true);
      });
  }

  function boot() {
    var modules = document.querySelectorAll(".partner-directory");
    for (var i = 0; i < modules.length; i += 1) {
      initDirectory(modules[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
