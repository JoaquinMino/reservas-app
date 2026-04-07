const slotsList = document.getElementById("slots-list");
const form = document.getElementById("reservation-form");
const slotIdInput = document.getElementById("slot_id");

let selectedElement = null;

async function loadSlots() {
  const response = await fetch("/slots");
  const slots = await response.json();

  slotsList.innerHTML = "";

  slots.forEach(slot => {
    const li = document.createElement("li");
    li.textContent = `${slot.date} - ${slot.time}`;

    li.addEventListener("click", () => {
      slotIdInput.value = slot.id;

      if (selectedElement) {
        selectedElement.classList.remove("selected");
      }

      li.classList.add("selected");
      selectedElement = li;
    });

    slotsList.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    slot_id: slotIdInput.value,
    customer_name: document.getElementById("customer_name").value,
    customer_email: document.getElementById("customer_email").value,
    customer_phone: document.getElementById("customer_phone").value
  };

  const response = await fetch("/reservations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  alert(result.message);

  form.reset();
  loadSlots();
});

loadSlots();