// Wait for Firebase to be ready
window.addEventListener('load', function() {

  // ── DATETIME ──
  function displayDateTime() {
    const el = document.getElementById('datetime-display');
    if (el) el.textContent = new Date().toLocaleString();
  }
  displayDateTime();
  setInterval(displayDateTime, 1000);

  // ── DATA ──
  const entries = [];
  const intensityEmoji = { '1':'☺️','2':'🙂','3':'🫤','4':'🙁','5':'😟' };
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // ── CHART ──
  const ctx = document.getElementById('symptomsChart').getContext('2d');
  const symptomsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: monthNames,
      datasets: [{
        label: 'Symptoms',
        data: Array(12).fill(0),
        borderColor: '#5b8fa8',
        backgroundColor: 'rgba(91,143,168,0.12)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#2f4156',
        pointRadius: 5,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
        x: { grid: { display: false } }
      }
    }
  });

  function updateChart() {
    const counts = Array(12).fill(0);
    entries.forEach(function(e) {
      const month = new Date(e.time).getMonth();
      counts[month]++;
    });
    symptomsChart.data.datasets[0].data = counts;
    symptomsChart.update();
  }

  // ── RENDER ENTRIES ──
  function renderEntries() {
    const lista = document.getElementById('entries-list');
    if (!lista) return;
    if (entries.length === 0) {
      lista.innerHTML = '<p style="color:#7a8fa0;text-align:center;">No entries yet.</p>';
      return;
    }
    lista.innerHTML = [...entries].reverse().map(function(e) {
      return `
        <div class="entry-item">
          <div>
            <div class="entry-name">${e.symptom}</div>
            <div class="entry-meta">${new Date(e.time).toLocaleString()}</div>
            ${e.notes ? `<div class="entry-note">${e.notes}</div>` : ''}
          </div>
          <div class="intensity-badge">${intensityEmoji[e.intensity]} ${e.intensity}</div>
        </div>
      `;
    }).join('');
  }

// ── SAVE TO FIREBASE ──
window.addEntry = async function() {
  const symptom   = document.getElementById('select-symptom').value;
  const intensity = document.getElementById('select-intensity').value;
  const time      = document.getElementById('select-time').value;
  const notes     = document.getElementById('select-notes') ? document.getElementById('select-notes').value : '';

  if (!symptom || !intensity || !time) {
    alert('Please fill all fields.');
    return;
  }

  try {
    await window.db.collection('symptoms').add({
      symptom, intensity, time, notes,
      createdAt: new Date()
    });
    document.getElementById('select-symptom').value   = '';
    document.getElementById('select-intensity').value = '';
    document.getElementById('select-time').value      = '';
    if (document.getElementById('select-notes')) document.getElementById('select-notes').value = '';
    loadEntries();
  } catch(e) {
    console.error('Error saving:', e);
    alert('Error saving. Check console (F12).');
  }
}

// ── LOAD FROM FIREBASE ──
async function loadEntries() {
  try {
    const snapshot = await window.db.collection('symptoms').get();
    entries.length = 0;
    snapshot.forEach(function(doc) {
      entries.push(doc.data());
    });
    renderEntries();
    updateChart();
  } catch(e) {
    console.error('Error loading:', e);
  }
}  

  // Load on startup
  loadEntries();
});