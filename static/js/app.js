document.addEventListener("DOMContentLoaded", function() {
  /**
   * HomePage - Help section
   */
  class Help {
    constructor($el) {
      this.$el = $el;
      this.$buttonsContainer = $el.querySelector(".help--buttons");
      this.$slidesContainers = $el.querySelectorAll(".help--slides");
      this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
      this.init();
    }

    init() {
      this.events();
    }

    events() {
      /**
       * Slide buttons
       */
      this.$buttonsContainer.addEventListener("click", e => {
        if (e.target.classList.contains("btn")) {
          this.changeSlide(e);
        }
      });

      /**
       * Pagination buttons
       */
      this.$el.addEventListener("click", e => {
        if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
          this.changePage(e);
        }
      });
    }

    changeSlide(e) {
      e.preventDefault();
      const $btn = e.target;

      // Buttons Active class change
      [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
      $btn.classList.add("active");

      // Current slide
      this.currentSlide = $btn.parentElement.dataset.id;
      console.log(this.currentSlide)
      if (this.currentSlide == 4) {
        $.ajax({
            url: "http://127.0.0.1:8000/get-organizations",
            type: "GET",
            dataType: "json",
        })
        .done((data) => {
                    // {#$('div[data-step=4]').html("")#}

                    $(data).each((idx, el) => {
                    let organization = $(`
                      <div class="form-group form-group--checkbox">
                        <label>
                          <input type="radio" name="organization" value="${el.pk}" />
                          <span class="checkbox radio"></span>
                          <span class="description">
                          <div class="title">${el.fields.name}</div>
                          <div class="subtitle">
                            Cel i misja: Pomoc dla osób nie posiadających miejsca
                            zamieszkania
                          </div>
                        </span>
                      </label>
                    </div>
                        `)


                   $('div[data-step=4] h3').after(organization)

                    })
                })
      }

      // Slides active class change
      this.$slidesContainers.forEach(el => {
        el.classList.remove("active");

        if (el.dataset.id === this.currentSlide) {
          el.classList.add("active");
        }
      });
    }

    /**
     * TODO: callback to page change event
     */
    changePage(e) {
      e.preventDefault();
      const page = e.target.dataset.page;

      console.log(page);
    }
  }
  const helpSection = document.querySelector(".help");
  if (helpSection !== null) {
    new Help(helpSection);
  }

  /**
   * Form Select
   */
  class FormSelect {
    constructor($el) {
      this.$el = $el;
      this.options = [...$el.children];
      this.init();
    }

    init() {
      this.createElements();
      this.addEvents();
      this.$el.parentElement.removeChild(this.$el);
    }

    createElements() {
      // Input for value
      this.valueInput = document.createElement("input");
      this.valueInput.type = "text";
      this.valueInput.name = this.$el.name;

      // Dropdown container
      this.dropdown = document.createElement("div");
      this.dropdown.classList.add("dropdown");

      // List container
      this.ul = document.createElement("ul");

      // All list options
      this.options.forEach((el, i) => {
        const li = document.createElement("li");
        li.dataset.value = el.value;
        li.innerText = el.innerText;

        if (i === 0) {
          // First clickable option
          this.current = document.createElement("div");
          this.current.innerText = el.innerText;
          this.dropdown.appendChild(this.current);
          this.valueInput.value = el.value;
          li.classList.add("selected");
        }

        this.ul.appendChild(li);
      });

      this.dropdown.appendChild(this.ul);
      this.dropdown.appendChild(this.valueInput);
      this.$el.parentElement.appendChild(this.dropdown);
    }

    addEvents() {
      this.dropdown.addEventListener("click", e => {
        const target = e.target;
        this.dropdown.classList.toggle("selecting");

        // Save new value only when clicked on li
        if (target.tagName === "LI") {
          this.valueInput.value = target.dataset.value;
          this.current.innerText = target.innerText;
          window.chosen_location = parseInt(target.dataset.value);
          console.log(chosen_location);
        }
      });
    }
  }
  document.querySelectorAll(".form-group--dropdown select").forEach(el => {
    new FormSelect(el);
  });

  /**
   * Hide elements when clicked on document
   */
  document.addEventListener("click", function(e) {
    const target = e.target;
    const tagName = target.tagName;

    if (target.classList.contains("dropdown")) return false;

    if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
      return false;
    }

    if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
      return false;
    }

    document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
      el.classList.remove("selecting");
    });
  });

  /**
   * Switching between form steps
   */
  class FormSteps {
    constructor(form) {
      this.$form = form;
      this.$next = form.querySelectorAll(".next-step");
      this.$prev = form.querySelectorAll(".prev-step");
      this.$step = form.querySelector(".form--steps-counter span");
      this.currentStep = 1;

      this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
      const $stepForms = form.querySelectorAll("form > div");
      this.slides = [...this.$stepInstructions, ...$stepForms];

      this.init();
    }

    /**
     * Init all methods
     */
    init() {
      this.events();
      this.updateForm();
    }

    /**
     * All events that are happening in form
     */
    events() {
      // Next step
      this.$next.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep++;
          this.updateForm();
        });
      });

      // Previous step
      this.$prev.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep--;
          this.updateForm();
        });
      });

      // Form submit
      this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
    }

    /**
     * Update form front-end
     * Show next or previous section etc.
     */
    updateForm() {
      this.$step.innerText = this.currentStep;
      if (this.currentStep == 4) {
        $.ajax({
          url: "http://127.0.0.1:8000/get-organizations",
          type: "GET",
          dataType: "json",
          data: {
            product: window.selected_product_type,
            cause: window.selected_cause,
            query: window.search_query,
            location: window.chosen_location,
          }
        })
            .done((data) => {
              $('div[data-step=4] > div.form-group--checkbox').remove()

              $(data).each((idx, el) => {
                let organization = $(`
                      <div class="form-group form-group--checkbox">
                        <label>
                          <input type="radio" name="organization" value="${el.pk}" />
                          <span class="checkbox radio"></span>
                          <span class="description">
                          <div class="title">${el.fields.name}</div>
                          <div class="subtitle">
                            Cel i misja: Pomoc dla osób nie posiadających miejsca
                            zamieszkania
                          </div>
                        </span>
                      </label>
                    </div>
                        `)


                $('div[data-step=4] h3').after(organization)

              })
            })
      } else if (this.currentStep == 6) {
        $.ajax({
          url: `http://127.0.0.1:8000/get-organization-name/${window.selected_organization}`,
          type: "GET",
          dataType: "text",
        })
        .done((data) => {
              $('div[data-step=6] > div.summary').remove()

              window.organization_name = data
              console.log(window.organization_name)

              let summary_html = `
              <div class="summary">
              <div class="form-section">
                <h4>Oddajesz:</h4>
                <ul>
                  <li>
                    <span class="icon icon-bag"></span>
                    <span class="summary--text">
                      ${selected_bags} worki ubrań w dobrym stanie dla dzieci</span>
                  </li>

                  <li>
                    <span class="icon icon-hand"></span>
                    <span class="summary--text">
                    Dla fundacji "Mam marzenie" w Warszawie</span>
                  </li>
                </ul>
              </div>

              <div class="form-section form-section--columns">
                <div class="form-section--column">
                  <h4>Adres odbioru:</h4>
                  <ul>
                    <li>Prosta 51</li>
                    <li>Warszawa</li>
                    <li>99-098</li>
                    <li>123 456 789</li>
                  </ul>
                </div>

                <div class="form-section--column">
                  <h4>Termin odbioru:</h4>
                  <ul>
                    <li>13/12/2018</li>
                    <li>15:40</li>
                    <li>Brak uwag</li>
                  </ul>
                </div>
              </div>
            </div>
              
              `
              $('div[data-step=6] h3').after(summary_html)
      })
      }

      // TODO: Validation

      this.slides.forEach(slide => {
        slide.classList.remove("active");

        if (slide.dataset.step == this.currentStep) {
          slide.classList.add("active");
        }
      });

      this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
      this.$step.parentElement.hidden = this.currentStep >= 6;

      // TODO: get data from inputs and show them in summary
    }

    /**
     * Submit form
     *
     * TODO: validation, send data to server
     */
    submit(e) {
      e.preventDefault();
      this.currentStep++;
      this.updateForm();
    }
  }
  const form = document.querySelector(".form--steps");
  if (form !== null) {
    new FormSteps(form);
  }
      $('input[name=products]').change(function() {
        window.selected_product_type = parseInt(this.dataset.productid);
        console.log(selected_product_type);
    });
    $('input[name=bags]').change(function () {
        window.selected_bags = parseInt(this.value);
        console.log(selected_bags)
    });
    $('input[name=help]').change(function () {
        window.selected_cause = parseInt(this.dataset.causeid);
        console.log(selected_cause)
    });
    $('textarea[name=organization_search]').change(function () {
        window.search_query = this.value;
        console.log(search_query)
    });
    $(document).on('change', 'input[name=organization]', function() {
      window.selected_organization = parseInt(this.value);

      console.log(selected_organization)
    });
    $('input[name=address]').change(function () {
      window.pickup_address = this.value;
      console.log(pickup_address)
    });
    $('input[name=city]').change(function () {
      window.city = this.value;
      console.log(city)
    });
    $('input[name=postcode]').change(function () {
      window.postcode = this.value;
      console.log(postcode)
    });
    $('input[name=phone]').change(function () {
      window.phone = this.value;
      console.log(phone)
    });
    $('input[name=data]').change(function () {
      window.pickup_date = this.value;
      console.log(pickup_date)
    });
    $('input[name=time]').change(function () {
      window.pickup_time = this.value;
      console.log(pickup_time)
    });
    $('input[name=more_info]').change(function () {
      window.pickup_notes = this.value;
      console.log(pickup_notes)
    });
});
