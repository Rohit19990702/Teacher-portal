function getCSRFToken() {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : '';
}

function showAddModal() {
    document.getElementById("addModal").style.display = "block";
}

function hideAddModal() {
    document.getElementById("addModal").style.display = "none";
}

function addStudent() {
    const name = document.getElementById("newName").value.trim();
    const subject = document.getElementById("newSubject").value.trim();
    const marks = parseInt(document.getElementById("newMarks").value.trim());

    if (!name || !subject || isNaN(marks)) {
        alert("Please fill all fields correctly.");
        return;
    }

    fetch('/add_student/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ name, subject, marks })
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to add student.");
        return response.json();
    })
    .then(data => {
        alert("Student added successfully!");
        location.reload(); // Reload the page to show new data
    })
    .catch(error => {
        console.error("Add student error:", error);
        alert("Failed to add student.");
    });
}
function updateStudent(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    const name = row.children[0].innerText.trim();
    const subject = row.children[1].innerText.trim();
    const marks = row.children[2].innerText.trim();

    fetch(`/update_student/${id}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ name, subject, marks })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
            alert("Update failed");
        }
    });
}

function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    fetch(`/delete_student/${id}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken()
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            location.reload();
        } else {
            alert("Delete failed");
        }
    });
}
let deleteStudentId = null;

function showEditModal(id, name, subject, marks) {
  document.getElementById("editId").value = id;
  document.getElementById("editName").value = name;
  document.getElementById("editSubject").value = subject;
  document.getElementById("editMarks").value = marks;
  document.getElementById("editModal").style.display = "block";
}

function hideEditModal() {
  document.getElementById("editModal").style.display = "none";
}

function submitEdit() {
  const id = document.getElementById("editId").value;
  const name = document.getElementById("editName").value;
  const subject = document.getElementById("editSubject").value;
  const marks = document.getElementById("editMarks").value;

  fetch(`/update_student/${id}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRFToken()
    },
    body: JSON.stringify({ name, subject, marks })
  })
  .then(res => res.json())
  .then(data => {
    alert("Student updated successfully");
    location.reload();
  });
}

function confirmDeleteStudent(id) {
  deleteStudentId = id;
  document.getElementById("deleteModal").style.display = "block";
}

function deleteStudent() {
  fetch(`/delete_student/${deleteStudentId}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken()
    }
  })
  .then(res => res.json())
  .then(data => {
    alert("Student deleted successfully");
    location.reload();
  });
}

function hideDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}
function ensureInView(rowId) {
  const row = document.querySelector(`tr[data-id='${rowId}']`);
  if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function toggleDropdown(button) {
  // Close other open dropdowns
  document.querySelectorAll('.dropdown').forEach(drop => {
    if (drop !== button.parentElement) {
      drop.classList.remove('open');
      drop.querySelector('.dropdown-menu').style.display = 'none';
    }
  });

  const dropdown = button.parentElement;
  const menu = dropdown.querySelector('.dropdown-menu');
  const isOpen = dropdown.classList.contains('open');

  if (isOpen) {
    menu.style.display = 'none';
    dropdown.classList.remove('open');
  } else {
    menu.style.display = 'block';
    dropdown.classList.add('open');
  }
}


document.addEventListener('click', function (e) {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown-menu').forEach(menu => menu.style.display = 'none');
    document.querySelectorAll('.dropdown').forEach(drop => drop.classList.remove('open'));
  }
});
function filterStudents() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  document.querySelectorAll(".student-table tbody tr").forEach((row) => {
    const name = row.querySelector(".student-name-text").textContent.toLowerCase();
    row.style.display = name.includes(query) ? "" : "none";
  });
}
function exportToCSV() {
  const rows = [["Name", "Subject", "Marks"]];
  document.querySelectorAll(".student-table tbody tr").forEach((tr) => {
    const name = tr.querySelector(".student-name-text")?.textContent.trim() || "";
    const subject = tr.children[1]?.textContent.trim() || "";
    const marks = tr.children[2]?.textContent.trim() || "";
    rows.push([name, subject, marks]);
  });

  let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "students.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
