window.addEventListener("DOMContentLoaded", () => {
  const eventsContainer = document.getElementById("events-container");

  // Fetch events from the SFU events API
  fetch("/api/events")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("loading-spinner")?.remove(); // Remove spinner
      eventsContainer.innerHTML = data.events;
    })
    .catch((err) => {
      console.error("Failed to load events:", err);
      eventsContainer.innerHTML = `
        <div class="error-message">
          <p>Sorry, we could not load the latest events right now.</p>
          <p>Please visit <a href="https://events.sfu.ca" target="_blank">SFU Events</a> for the most current event information.</p>
        </div>
      `;
    });
});
