class CharacterCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.selected = false;

    // Fetch external HTML template and inject it
    fetch("./features/char-card/char-card.html")
      .then((response) => response.text())
      .then((html) => {
        const template = document.createElement("template");
        template.innerHTML = html;
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.cardElement = this.shadowRoot.querySelector(".card");
        this.updateAttributes();

        if (this.hasAttribute("selectable")) {
          this.cardElement.addEventListener("click", () =>
            this.toggleSelection()
          );
        }
      });
  }

  updateAttributes() {
    const chiave = this.shadowRoot.getElementById("char-chiave");
    const name = this.shadowRoot.getElementById("char-name");
    const cost = this.shadowRoot.getElementById("char-cost");

    if (this.hasAttribute("chiave")) chiave.textContent = this.getAttribute("chiave");
    if (this.hasAttribute("name")) name.textContent = this.getAttribute("name");
    if (this.hasAttribute("cost"))
      cost.textContent = `Costo: ${this.getAttribute("cost")}`;
  }

  toggleSelection(maxCost) {
    this.selected = !this.selected;
    this.cardElement.classList.toggle("selected", this.selected);

    if (!maxCost) {
      // Emettiamo l'evento di selezione
      this.dispatchEvent(
        new CustomEvent("char-selected", {
          detail: {
            chiave: this.getAttribute("chiave"),
            name: this.getAttribute("name"),
            cost: parseInt(this.getAttribute("cost")),
            selected: this.selected,
          },
          bubbles: true, // Permette la propagazione dell'evento nel DOM
        })
      );
    }
  }
}

// Register the custom element
customElements.define("char-card", CharacterCard);
