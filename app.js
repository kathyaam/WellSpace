// ============================================================
// CHART SETUP
// ============================================================

// Step 1: Find the <canvas id="symptomsChart"> in the HTML
// Chart.js needs a canvas element to draw on
const canvas = document.getElementById('symptomsChart');

// Step 2: Get the "drawing tool" from the canvas
const ctx = canvas.getContext('2d');

// Step 3: Define the data for the chart
const chartData = {

  // labels = what shows on the X axis (bottom)
  labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],

  // datasets = the actual lines/bars on the chart
  datasets: [{
    label: 'Symptoms',
    
    // data = the Y axis values, one number per month
    // This starts at all zeros: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

    borderColor: '#5b8fa8',                    // line color
    backgroundColor: 'rgba(91,143,168,0.12)',  // fill color under the line
    tension: 0.4,                              // line curve (0 = straight, 1 = very curved)
    fill: true,                                // fill the area under the line
    pointBackgroundColor: '#2f4156',           // dot color
    pointRadius: 5,                            // dot size
  }]
};

// Step 4: Create the chart
const symptomsChart = new Chart(ctx, {
  type: 'line',    // chart type: 'line', 'bar', 'pie', 'doughnut'...
  data: chartData,
  options: {
    responsive: true,
    plugins: {
      legend: { display: false } // hide the legend label at the top
    },
    scales: {
      y: {
        beginAtZero: true,               // Y axis starts at 0
        ticks: { stepSize: 1 },          // count by 1s (not 0.5, 2, etc.)
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      x: {
        grid: { display: false }         // no vertical grid lines
      }
    }
  }
});

// ============================================================
// HOW TO UPDATE THE CHART WITH REAL DATA
// ============================================================
// Every time a new symptom is added, this function runs.
// It counts how many entries fall in each month,
// then tells Chart.js to redraw with the new numbers.

function updateChart(entries) {

  // Create an array of 12 zeros, one slot per month
  const counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Loop through every saved entry
  entries.forEach(function(entry) {

    // Get the month number from the entry's date
    // getMonth() returns: 0=Jan, 1=Feb, 2=Mar ... 11=Dec
    const month = new Date(entry.time).getMonth();

    // Add 1 to that month's count
    counts[month]++;
  });

  // Replace the chart's data with the new counts
  symptomsChart.data.datasets[0].data = counts;

  // Tell Chart.js to redraw
  symptomsChart.update();
}

//form
const symptom = document.getElementById('select-symptom').value;
function addEntry() {
  const symptom   = document.getElementById('select-symptom').value;
  const intensity = document.getElementById('select-intensity').value;
  const time      = document.getElementById('select-time').value;
  const notes     = document.getElementById('select-notes').value; 

  entries.push({
    symptom:   symptom,
    intensity: intensity,
    time:      time,
    notes:     notes
  });

  // clear the field after saving
  document.getElementById('select-notes').value = '';
}