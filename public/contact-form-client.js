// Record load time immediately — used for timing anti-spam check
const _loadTime = Date.now();

const DEFAULT_EVENT_INQUIRY_VALUES = [];

const resolveEventInquiryValues = () => {
  if (typeof document === "undefined") {
    return new Set(DEFAULT_EVENT_INQUIRY_VALUES);
  }

  const form = document.querySelector("form.contact-form[data-event-inquiry-allowlist]");
  const serializedAllowlist = form?.getAttribute("data-event-inquiry-allowlist") || "";

  if (!serializedAllowlist.trim()) {
    return new Set(DEFAULT_EVENT_INQUIRY_VALUES);
  }

  try {
    const parsed = JSON.parse(serializedAllowlist);

    if (!Array.isArray(parsed)) {
      return new Set(DEFAULT_EVENT_INQUIRY_VALUES);
    }

    const normalized = parsed
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter((value) => value.length > 0);

    return new Set(normalized.length > 0 ? normalized : DEFAULT_EVENT_INQUIRY_VALUES);
  } catch {
    return new Set(DEFAULT_EVENT_INQUIRY_VALUES);
  }
};
const loadFlatpickr = async () => {
  if (typeof window !== "undefined" && window.flatpickr) {
    return window.flatpickr;
  }

  // Try ESM import first for modern browsers
  try {
    const mod = await import("https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.esm.js");
    return mod.default || mod;
  } catch {
    // Fallback: inject UMD script and resolve window.flatpickr
    return new Promise((resolve, reject) => {
      if (typeof window !== "undefined" && window.flatpickr) {
        return resolve(window.flatpickr);
      }

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.js";
      script.async = true;
      script.onload = () => {
        if (window.flatpickr) {
          resolve(window.flatpickr);
        } else {
          reject(new Error("flatpickr failed to load via UMD fallback"));
        }
      };
      script.onerror = (e) => reject(e || new Error("flatpickr script load error"));
      document.head.appendChild(script);
    });
  }
};
const shouldShowEventFields = (inquiryType, eventInquiryValues) =>
  eventInquiryValues.has((inquiryType || "").trim());

async function initContactForm() {
  if (typeof document === "undefined") {
    return;
  }

  const inquirySelect = document.querySelector("select[name='inquiryType']");
  const dateInput = document.querySelector("[data-date-input]");
  const dateEndInput = document.querySelector("[data-date-end-input]");
  const eventInquiryValues = resolveEventInquiryValues();

  if (!inquirySelect || !dateInput || !dateEndInput) {
    console.warn("initContactForm: missing contact form elements", {
      inquirySelect,
      dateInput,
      dateEndInput,
    });
    return;
  }

  const dateClearButtons = document.querySelectorAll("[data-date-clear]");
  const eventFieldRows = document.querySelectorAll("[data-event-field]");
  const eventRequiredInputs = document.querySelectorAll("[data-event-input]");
  const eventOptionalInputs = document.querySelectorAll("[data-event-optional-input]");

  const syncDateClearButtons = () => {
    dateClearButtons.forEach((button) => {
      const wrapper = button.closest(".contact-form__date-input-wrap");
      const input = wrapper?.querySelector("input");

      if (!input) {
        return;
      }

      button.hidden = !input.value || input.disabled;
    });
  };

  const dateStatus = document.querySelector(".contact-form__status");

  const announceDate = (message) => {
    if (dateStatus) {
      dateStatus.textContent = message;
    }
  };

  const setEventFieldsVisibility = (selectedValue) => {
    const showEventFields = shouldShowEventFields(selectedValue, eventInquiryValues);

    eventFieldRows.forEach((field) => {
      field.hidden = !showEventFields;
    });

    eventRequiredInputs.forEach((input) => {
      input.required = showEventFields;
      input.disabled = !showEventFields;

      if (!showEventFields) {
        input.value = "";
      }
    });

    eventOptionalInputs.forEach((input) => {
      input.required = false;
      input.disabled = !showEventFields;

      if (!showEventFields) {
        input.value = "";
      }
    });

    syncDateClearButtons();
  };

  const initializeInquirySelect = () => {
    const selectedValue = inquirySelect.value || "";

    setEventFieldsVisibility(selectedValue);

    inquirySelect.addEventListener("change", (event) => {
      const value = event.target?.value || "";
      setEventFieldsVisibility(value);
    });
  };

  initializeInquirySelect();

  try {
    const flatpickr = await loadFlatpickr();

    let endDatePicker = null;

    const startDatePicker = flatpickr(dateInput, {
      dateFormat: "m/d/Y",
      disableMobile: true,
      allowInput: true,
      clickOpens: true,
      position: "below right",
      monthSelectorType: "static",
      minDate: "today",
      appendTo: document.body,
      onOpen: () => {
        try {
          if (endDatePicker && typeof endDatePicker.close === "function") {
            endDatePicker.close();
          }
        } catch (err) {
          /* ignore */
        }
      },
      onValueUpdate: () => {
        syncDateClearButtons();
      },
      onChange: (selectedDates) => {
        const selectedStartDate = selectedDates[0];

        if (selectedStartDate) {
          announceDate(`Start date set to ${dateInput.value}`);
        } else {
          announceDate("Start date cleared");
        }

        if (!endDatePicker) {
          return;
        }

        endDatePicker.set("minDate", selectedStartDate ?? "today");

        if (selectedStartDate && dateEndInput.value) {
          const parsedEndDate = endDatePicker.parseDate(dateEndInput.value, "m/d/Y");

          if (parsedEndDate && parsedEndDate < selectedStartDate) {
            endDatePicker.clear();
          }
        }

        syncDateClearButtons();
      },
    });

    endDatePicker = flatpickr(dateEndInput, {
      dateFormat: "m/d/Y",
      disableMobile: true,
      allowInput: true,
      clickOpens: true,
      position: "below right",
      monthSelectorType: "static",
      minDate: "today",
      appendTo: document.body,
      onOpen: () => {
        try {
          if (startDatePicker && typeof startDatePicker.close === "function") {
            startDatePicker.close();
          }
        } catch (err) {
          /* ignore */
        }
      },
      onValueUpdate: () => {
        syncDateClearButtons();
      },
      onChange: (selectedDates) => {
        const selectedEndDate = selectedDates[0];

        if (selectedEndDate) {
          announceDate(`End date set to ${dateEndInput.value}`);
        } else {
          announceDate("End date cleared");
        }

        syncDateClearButtons();
      },
    });

    const selectedStartDate = startDatePicker.selectedDates[0];

    if (selectedStartDate) {
      endDatePicker.set("minDate", selectedStartDate);
    }

    dateEndInput.addEventListener("focus", () => {
      endDatePicker?.open();
    });

    dateInput.addEventListener("focus", () => {
      try {
        startDatePicker.open();
      } catch (err) {
        /* ignore */
      }
    });

    // Close pickers when clicking outside of inputs/calendars
    const clickOutsideHandler = (ev) => {
      try {
        const target = ev.target;
        const calendars = Array.from(document.querySelectorAll(".flatpickr-calendar"));
        const clickedInCalendar = calendars.some((c) => c.contains(target));
        const clickedInInput =
          (dateInput &&
            (dateInput === target || (dateInput.contains && dateInput.contains(target)))) ||
          (dateEndInput &&
            (dateEndInput === target || (dateEndInput.contains && dateEndInput.contains(target))));

        if (!clickedInCalendar && !clickedInInput) {
          try {
            startDatePicker?.close?.();
          } catch (e) {
            /* ignore */
          }
          try {
            endDatePicker?.close?.();
          } catch (e) {
            /* ignore */
          }
        }
      } catch (err) {
        /* ignore */
      }
    };

    document.addEventListener("click", clickOutsideHandler);
  } catch (err) {
    console.warn("flatpickr init failed:", err);
  }

  try {
    dateClearButtons.forEach((button) => {
      const wrapper = button.closest(".contact-form__date-input-wrap");
      const input = wrapper?.querySelector("input");

      if (!input) {
        return;
      }

      const syncForInput = () => {
        button.hidden = !input.value || input.disabled;
      };

      button.addEventListener("click", () => {
        const pickerInstance = input._flatpickr;

        if (pickerInstance) {
          pickerInstance.clear();
        } else {
          input.value = "";
        }

        input.dispatchEvent(new Event("input", { bubbles: true }));
        syncDateClearButtons();
      });

      input.addEventListener("input", syncForInput);
      input.addEventListener("change", syncForInput);
      syncForInput();
    });

    syncDateClearButtons();
  } catch (err) {
    console.warn("date clear button init failed:", err);
  }

  // AJAX form submission
  const form = document.querySelector("form.contact-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
    }

    // Remove any previous error alert
    const prevAlert = form.querySelector(".contact-form__submit-error");
    if (prevAlert) prevAlert.remove();

    // Collect all named form fields
    const data = {};
    const formData = new FormData(form);
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    // Anti-spam fields
    // _hp is the honeypot field (name="_hp"), already in the form DOM
    data["_hp"] = data["_hp"] ?? "";
    // Rename _gotcha to _hp if legacy field is present
    if ("_gotcha" in data) {
      data["_hp"] = data["_gotcha"];
      delete data["_gotcha"];
    }
    data["_t"] = _loadTime;

    // Optional Turnstile token
    const turnstileToken = document.getElementById("cf-turnstile-response");
    if (turnstileToken && turnstileToken.value) {
      data["cf-turnstile-response"] = turnstileToken.value;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => ({}));

      if (json.ok) {
        form.innerHTML =
          '<p class="contact-form__success" role="status">Thanks! We\'ll be in touch.</p>';
      } else {
        const alert = document.createElement("p");
        alert.className = "contact-form__submit-error";
        alert.setAttribute("role", "alert");
        alert.textContent = "Something went wrong. Please try again.";
        const actions = form.querySelector(".contact-form__actions");
        if (actions) {
          actions.after(alert);
        } else {
          form.appendChild(alert);
        }
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    } catch {
      const alert = document.createElement("p");
      alert.className = "contact-form__submit-error";
      alert.setAttribute("role", "alert");
      alert.textContent = "A network error occurred. Please check your connection and try again.";
      const actions = form.querySelector(".contact-form__actions");
      if (actions) {
        actions.after(alert);
      } else {
        form.appendChild(alert);
      }
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initContactForm);
} else {
  initContactForm();
}
