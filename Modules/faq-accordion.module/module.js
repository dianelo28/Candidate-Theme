(function () {
  "use strict";

  function isOpen(button) {
    return button.getAttribute("aria-expanded") === "true";
  }

  function setOpen(item, button, panel, open) {
    button.setAttribute("aria-expanded", open ? "true" : "false");
    item.classList.toggle("is-open", open);

    if (open) {
      panel.removeAttribute("hidden");
    } else {
      panel.setAttribute("hidden", "");
    }
  }

  function initAccordion(root) {
    var buttons = root.querySelectorAll(".faq-accordion__trigger");

    function toggleFromButton(button) {
      var item = button.closest(".faq-accordion__item");
      var panelId = button.getAttribute("aria-controls");
      var panel = panelId ? document.getElementById(panelId) : null;

      if (!item || !panel) {
        return;
      }

      setOpen(item, button, panel, !isOpen(button));
    }

    function focusButton(index) {
      if (!buttons.length) {
        return;
      }

      var next = (index + buttons.length) % buttons.length;
      buttons[next].focus();
    }

    for (var i = 0; i < buttons.length; i += 1) {
      (function (index) {
        var button = buttons[index];

        button.addEventListener("click", function () {
          toggleFromButton(button);
        });

        button.addEventListener("keydown", function (event) {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            focusButton(index + 1);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            focusButton(index - 1);
          } else if (event.key === "Home") {
            event.preventDefault();
            focusButton(0);
          } else if (event.key === "End") {
            event.preventDefault();
            focusButton(buttons.length - 1);
          }
        });
      })(i);
    }
  }

  function boot() {
    var modules = document.querySelectorAll("[data-faq-accordion]");
    for (var i = 0; i < modules.length; i += 1) {
      initAccordion(modules[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
