// FORM HANDLING
let form = document.getElementById("complaintForm");

if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault(); // STOP PAGE REFRESH

    let location = document.getElementById("location").value;
    let damageType = document.getElementById("damageType").value;
    let roadType = document.getElementById("roadType").value;

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    // Duplicate check
    let existing = complaints.find(c => c.location === location);
    let complaintCount = existing ? existing.complaintCount + 1 : 1;

    let timestamp = new Date(Date.now() - (3 * 24 * 60 * 60 * 1000)).toISOString();
    let score = 0;

    // Road type
    if (roadType === "National Highway") score += 3;
    else if (roadType === "State Highway") score += 2;
    else if (roadType === "Main Road") score += 2;

    // Damage
    if (damageType === "Pothole") score += 2;

    // Duplicate
    if (complaintCount > 1) score += 1;

    let priority = "Low";
    if (score >= 6) priority = "High";
    else if (score >= 3) priority = "Medium";

    let newComplaint = {
      id: Date.now(),
      location,
      damageType,
      roadType,
      complaintCount,
      timestamp,
      priority,
      status: "Submitted"
    };

    complaints.push(newComplaint);
    localStorage.setItem("complaints", JSON.stringify(complaints));

    alert("Complaint Submitted!");

    window.location.href = "dashboard.html";
  });
}


// DASHBOARD
if (window.location.pathname.includes("dashboard.html")) {

  let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
  let container = document.getElementById("complaintsList");

  if (complaints.length === 0) {
    container.innerHTML = "<p>No complaints found</p>";
  }

  complaints.forEach(c => {
    let div = document.createElement("div");

   div.innerHTML = `
  <hr>
  <p><b>ID:</b> ${c.id}</p>
  <p><b>Location:</b> ${c.location}</p>
  <p><b>Road Type:</b> ${c.roadType}</p>
  <p><b>Complaints Count:</b> ${c.complaintCount}</p>
  <p><b>Priority:</b> <span class="${c.priority}">${c.priority}</span></p>
  <p><b>Status:</b> ${c.status}</p>

  <button onclick="updateStatus(${c.id}, 'In Progress')">In Progress</button>
  <button onclick="updateStatus(${c.id}, 'Completed')">Completed</button>
`;
    container.appendChild(div);
  });
}
function updateStatus(id, newStatus) {
  let complaints = JSON.parse(localStorage.getItem("complaints"));

  complaints = complaints.map(c => {
    if (c.id === id) {
      c.status = newStatus;
    }
    return c;
  });

  localStorage.setItem("complaints", JSON.stringify(complaints));

  location.reload();
}