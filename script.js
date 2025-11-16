// Constants
const PIXELS_PER_DIV = 8;

// State
let regressionLines = [];
let referenceLines = [];
let showDataPoints = true;
let showConnectingLines = true;
let showRegressionLines = true;
let showReferenceLines = true;
let graphCollapsed = false;

// Rounding function - always rounds 0.5 and above up
function roundHalfUp(num) {
  return Math.floor(num + 0.5);
}

// Demo Data Loaders
function loadDemo1() {
  // Demo 1: Conductivity vs Concentration
  document.getElementById('xBigDivisions').value = 12;
  document.getElementById('xSmallPerBig').value = 10;
  document.getElementById('xMinValue').value = 0;
  document.getElementById('xMaxValue').value = 60;
  document.getElementById('yBigDivisions').value = 18;
  document.getElementById('ySmallPerBig').value = 10;
  document.getElementById('yMinValue').value = 0;
  document.getElementById('yMaxValue').value = 180;
  document.getElementById('xAxisLabel').value = 'Concentration (mM)';
  document.getElementById('yAxisLabel').value = 'Conductivity (μS/cm)';
  document.getElementById('graphTitle').value = 'Conductivity vs Concentration';
  
  const demoData = [
    [0, 0], [10, 30], [20, 60], [30, 90], [40, 120], [50, 150], [60, 180]
  ];
  
  loadDemoData(demoData);
  updateCalculatedParameters();
}

function loadDemo2() {
  // Demo 2: Pressure vs Volume (Boyle's Law)
  document.getElementById('xBigDivisions').value = 20;
  document.getElementById('xSmallPerBig').value = 10;
  document.getElementById('xMinValue').value = 20;
  document.getElementById('xMaxValue').value = 100;
  document.getElementById('yBigDivisions').value = 16;
  document.getElementById('ySmallPerBig').value = 10;
  document.getElementById('yMinValue').value = 0;
  document.getElementById('yMaxValue').value = 80;
  document.getElementById('xAxisLabel').value = 'Volume (mL)';
  document.getElementById('yAxisLabel').value = 'Pressure (kPa)';
  document.getElementById('graphTitle').value = 'Pressure vs Volume (Boyle\'s Law)';
  
  const demoData = [
    [20, 80], [30, 53.3], [40, 40], [50, 32], [60, 26.7], [80, 20], [100, 16]
  ];
  
  loadDemoData(demoData);
  updateCalculatedParameters();
}

function loadDemoData(data) {
  const tbody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
  const rows = tbody.rows;
  
  for (let i = 0; i < data.length && i < rows.length; i++) {
    rows[i].cells[1].children[0].value = data[i][0];
    rows[i].cells[2].children[0].value = data[i][1];
    rows[i].cells[3].textContent = '';
    rows[i].cells[4].textContent = '';
  }
  
  // Clear remaining rows
  for (let i = data.length; i < rows.length; i++) {
    rows[i].cells[1].children[0].value = '';
    rows[i].cells[2].children[0].value = '';
    rows[i].cells[3].textContent = '';
    rows[i].cells[4].textContent = '';
  }
}

// Get parameter values with smart defaults
function getParameters() {
  let xBigDivisions = parseInt(document.getElementById('xBigDivisions').value);
  let xSmallPerBig = parseInt(document.getElementById('xSmallPerBig').value);
  let xMinValue = parseFloat(document.getElementById('xMinValue').value);
  let xMaxValue = parseFloat(document.getElementById('xMaxValue').value);
  let yBigDivisions = parseInt(document.getElementById('yBigDivisions').value);
  let ySmallPerBig = parseInt(document.getElementById('ySmallPerBig').value);
  let yMinValue = parseFloat(document.getElementById('yMinValue').value);
  let yMaxValue = parseFloat(document.getElementById('yMaxValue').value);
  
  // Smart defaults
  if (isNaN(xBigDivisions)) xBigDivisions = 1;
  if (isNaN(xSmallPerBig)) xSmallPerBig = 1;
  if (isNaN(xMinValue)) xMinValue = 0;
  if (isNaN(xMaxValue)) xMaxValue = xMinValue + 100;
  if (isNaN(yBigDivisions)) yBigDivisions = 1;
  if (isNaN(ySmallPerBig)) ySmallPerBig = 1;
  if (isNaN(yMinValue)) yMinValue = 0;
  if (isNaN(yMaxValue)) yMaxValue = yMinValue + 100;
  
  // Validation
  if (xMaxValue <= xMinValue) {
    alert('X Maximum must be greater than X Minimum');
    xMaxValue = xMinValue + 100;
    document.getElementById('xMaxValue').value = xMaxValue;
  }
  if (yMaxValue <= yMinValue) {
    alert('Y Maximum must be greater than Y Minimum');
    yMaxValue = yMinValue + 100;
    document.getElementById('yMaxValue').value = yMaxValue;
  }
  
  // Calculate divisions
  const xTotalDivisions = xBigDivisions * xSmallPerBig;
  const yTotalDivisions = yBigDivisions * ySmallPerBig;
  const xRange = xMaxValue - xMinValue;
  const yRange = yMaxValue - yMinValue;
  const xSmallestDivCalc = xRange / xTotalDivisions;
  const ySmallestDivCalc = yRange / yTotalDivisions;
  
  // Check for overrides
  const xOverride = parseFloat(document.getElementById('xSmallestDivOverride').value);
  const yOverride = parseFloat(document.getElementById('ySmallestDivOverride').value);
  
  const xSmallestDiv = (xOverride && xOverride >= xSmallestDivCalc) ? xOverride : xSmallestDivCalc;
  const ySmallestDiv = (yOverride && yOverride >= ySmallestDivCalc) ? yOverride : ySmallestDivCalc;
  
  return {
    xBigDivisions, xSmallPerBig, xMinValue, xMaxValue, xTotalDivisions, xSmallestDiv, xSmallestDivCalc,
    yBigDivisions, ySmallPerBig, yMinValue, yMaxValue, yTotalDivisions, ySmallestDiv, ySmallestDivCalc
  };
}

// Update calculated parameters display
function updateCalculatedParameters() {
  const params = getParameters();
  
  const resultBox = document.getElementById('calculatedResults');
  const resultText = document.getElementById('calculatedText');
  
  resultText.innerHTML = `
    <div style="margin-bottom:10px;">
      <strong>X-Axis:</strong> ${params.xTotalDivisions} total divisions 
      (${params.xBigDivisions} × ${params.xSmallPerBig}) | 
      <strong>Smallest division = <span class="calc-highlight">${params.xSmallestDivCalc.toFixed(4)}</span> units</strong>
    </div>
    <div>
      <strong>Y-Axis:</strong> ${params.yTotalDivisions} total divisions 
      (${params.yBigDivisions} × ${params.ySmallPerBig}) | 
      <strong>Smallest division = <span class="calc-highlight">${params.ySmallestDivCalc.toFixed(4)}</span> units</strong>
    </div>
  `;
  
  resultBox.classList.add('show');
  
  // Update placeholders
  document.getElementById('xSmallestDivOverride').placeholder = `Auto: ${params.xSmallestDivCalc.toFixed(4)}`;
  document.getElementById('ySmallestDivOverride').placeholder = `Auto: ${params.ySmallestDivCalc.toFixed(4)}`;
}

// Clear calculation when data changes
function clearCalculation(input) {
  const row = input.parentNode.parentNode;
  row.cells[3].textContent = '';
  row.cells[4].textContent = '';
}

// Toggle all point selection
function toggleAllSelection() {
  const selectAll = document.getElementById('selectAllPoints').checked;
  const checkboxes = document.querySelectorAll('.point-select');
  checkboxes.forEach(cb => cb.checked = selectAll);
}

// Add new data row
function addDataRow() {
  const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
  const row = table.insertRow();
  row.innerHTML = `
    <td><input type="checkbox" class="point-select"></td>
    <td><input type="number" step="any" oninput="clearCalculation(this)"></td>
    <td><input type="number" step="any" oninput="clearCalculation(this)"></td>
    <td></td>
    <td></td>
    <td><button class="btn-icon" onclick="deleteRow(this)"><i class="fas fa-trash-alt"></i></button></td>
  `;
}

// Delete row
function deleteRow(btn) {
  const row = btn.parentNode.parentNode;
  const tbody = row.parentNode;
  if (tbody.rows.length > 1) {
    tbody.removeChild(row);
  } else {
    alert('At least one data row is required');
  }
}

// Calculate divisions for all data points
function calculateDivisions() {
  const params = getParameters();
  const tableRows = document.getElementById('dataTable').getElementsByTagName('tbody')[0].rows;
  
  let validPointCount = 0;
  
  for (let i = 0; i < tableRows.length; i++) {
    const xValue = parseFloat(tableRows[i].cells[1].children[0].value);
    const yValue = parseFloat(tableRows[i].cells[2].children[0].value);
    
    if (!isNaN(xValue) && !isNaN(yValue)) {
      const xDivision = roundHalfUp((xValue - params.xMinValue) / params.xSmallestDiv);
      const yDivision = roundHalfUp((yValue - params.yMinValue) / params.ySmallestDiv);
      
      tableRows[i].cells[3].textContent = xDivision;
      tableRows[i].cells[4].textContent = yDivision;
      
      validPointCount++;
    }
  }
  
  if (validPointCount === 0) {
    alert('Please enter at least one valid data point');
    return;
  }
  
  document.getElementById('graphSettingsSection').style.display = 'block';
  
  // Scroll to graph settings
  document.getElementById('graphSettingsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// Toggle graph collapse
function toggleGraphCollapse() {
  graphCollapsed = !graphCollapsed;
  const container = document.getElementById('graphContainer');
  const icon = document.getElementById('collapseIcon');
  const text = document.getElementById('collapseText');
  
  if (graphCollapsed) {
    container.classList.add('collapsed');
    icon.className = 'fas fa-chevron-down';
    text.textContent = 'Expand';
  } else {
    container.classList.remove('collapsed');
    icon.className = 'fas fa-chevron-up';
    text.textContent = 'Collapse';
  }
}


// Toggle display options
function toggleDisplay() {
  showDataPoints = document.getElementById('showPoints').checked;
  showConnectingLines = document.getElementById('showLines').checked;
  showRegressionLines = document.getElementById('showRegressions').checked;
  showReferenceLines = document.getElementById('showReferences').checked;
  
  if (document.getElementById('plotlyGraph').children.length > 0) {
    regenerateGraph();
  }
}

// Generate graph
function generateGraph() {
  const params = getParameters();
  const tableRows = document.getElementById('dataTable').getElementsByTagName('tbody')[0].rows;
  
  const xDivisions = [];
  const yDivisions = [];
  const xOriginalValues = [];  // NEW: Store original values
  const yOriginalValues = [];  // NEW: Store original values
  const labels = [];
  
  for (let i = 0; i < tableRows.length; i++) {
    const xValue = parseFloat(tableRows[i].cells[1].children[0].value);
    const yValue = parseFloat(tableRows[i].cells[2].children[0].value);
    
    if (!isNaN(xValue) && !isNaN(yValue)) {
      const xDiv = roundHalfUp((xValue - params.xMinValue) / params.xSmallestDiv);
      const yDiv = roundHalfUp((yValue - params.yMinValue) / params.ySmallestDiv);
      
      xDivisions.push(xDiv);
      yDivisions.push(yDiv);
      xOriginalValues.push(xValue);  // NEW: Store original
      yOriginalValues.push(yValue);  // NEW: Store original
      labels.push(`(${xValue}, ${yValue})`);
    }
  }
  
  if (xDivisions.length === 0) {
    alert('No valid data points to plot');
    return;
  }
  
  const tickInterval = parseInt(document.getElementById('tickInterval').value) || 10;
  const xLabel = document.getElementById('xAxisLabel').value || 'X Axis';
  const yLabel = document.getElementById('yAxisLabel').value || 'Y Axis';
  const graphTitle = document.getElementById('graphTitle').value || 'Graph';
  
  // Generate tick positions and labels
  const xTickPositions = [];
  const xTickLabels = [];
  for (let i = 0; i <= params.xTotalDivisions; i += tickInterval) {
    xTickPositions.push(i);
    xTickLabels.push((params.xMinValue + (i * params.xSmallestDiv)).toFixed(2));
  }
  
  const yTickPositions = [];
  const yTickLabels = [];
  for (let i = 0; i <= params.yTotalDivisions; i += tickInterval) {
    yTickPositions.push(i);
    yTickLabels.push((params.yMinValue + (i * params.ySmallestDiv)).toFixed(2));
  }
  
  // Division box annotation
  const divBoxPosition = document.getElementById('divBoxPosition').value;
  let annotationX, annotationY, xAnchor, yAnchor;
  
  switch(divBoxPosition) {
    case 'top-left':
      annotationX = 0.02; annotationY = 0.98; xAnchor = 'left'; yAnchor = 'top';
      break;
    case 'top-right':
      annotationX = 0.98; annotationY = 0.98; xAnchor = 'right'; yAnchor = 'top';
      break;
    case 'bottom-left':
      annotationX = 0.02; annotationY = 0.02; xAnchor = 'left'; yAnchor = 'bottom';
      break;
    case 'bottom-right':
      annotationX = 0.98; annotationY = 0.02; xAnchor = 'right'; yAnchor = 'bottom';
      break;
    default:
      annotationX = 0.02; annotationY = 0.98; xAnchor = 'left'; yAnchor = 'top';
  }
  
  const annotations = [{
    text: `<b>1 smallest division:</b><br>X = ${params.xSmallestDiv.toFixed(4)}<br>Y = ${params.ySmallestDiv.toFixed(4)}`,
    xref: 'paper',
    yref: 'paper',
    x: annotationX,
    y: annotationY,
    xanchor: xAnchor,
    yanchor: yAnchor,
    showarrow: false,
    bgcolor: '#fffaed',
    bordercolor: '#ffd54f',
    borderwidth: 2,
    borderpad: 8,
    font: {family: 'Cambria, Georgia, serif', size: 11, color: '#5d4037'}
  }];
  
  // Reference lines as shapes
  const shapes = [];
  if (showReferenceLines) {
    referenceLines.forEach(refLine => {
      if (refLine.type === 'vertical') {
        shapes.push({
          type: 'line',
          xref: 'x',
          yref: 'paper',
          x0: refLine.position,
          y0: 0,
          x1: refLine.position,
          y1: 1,
          line: { dash: refLine.style, color: refLine.color, width: refLine.width },
          editable: true
        });
      } else {
        shapes.push({
          type: 'line',
          xref: 'paper',
          yref: 'y',
          x0: 0,
          y0: refLine.position,
          x1: 1,
          y1: refLine.position,
          line: { dash: refLine.style, color: refLine.color, width: refLine.width },
          editable: true
        });
      }
    });
  }
  
  const graphWidth = params.xTotalDivisions * PIXELS_PER_DIV;
  const graphHeight = params.yTotalDivisions * PIXELS_PER_DIV;
  
  const layout = {
    title: {text: graphTitle, font: {family: 'Cambria, Georgia, serif', size: 18, color: '#003366'}},
    xaxis: {
      title: {text: `──────── ${xLabel} ────────➤`, font: {family: 'Cambria, Georgia, serif', size: 14}},
      range: [0, params.xTotalDivisions],
      tickmode: 'array',
      tickvals: xTickPositions,
      ticktext: xTickLabels,
      showgrid: true,
      gridcolor: '#2d8659',
      gridwidth: 2,
      zeroline: false,
      tickfont: {family: 'Cambria, Georgia, serif', size: 11},
      minor: {dtick: 1, showgrid: true, gridcolor: '#90d9b8', gridwidth: 0.5},
      scaleanchor: 'y',
      scaleratio: 1
    },
    yaxis: {
      title: {text: `──────── ${yLabel} ────────➤`, font: {family: 'Cambria, Georgia, serif', size: 14}},
      range: [0, params.yTotalDivisions],
      tickmode: 'array',
      tickvals: yTickPositions,
      ticktext: yTickLabels,
      showgrid: true,
      gridcolor: '#2d8659',
      gridwidth: 2,
      zeroline: false,
      tickfont: {family: 'Cambria, Georgia, serif', size: 11},
      minor: {dtick: 1, showgrid: true, gridcolor: '#90d9b8', gridwidth: 0.5}
    },
    width: graphWidth + 120,
    height: graphHeight + 100,
    margin: {l: 80, r: 50, t: 80, b: 70},
    font: {family: 'Cambria, Georgia, serif', size: 12},
    plot_bgcolor: '#fefef8',
    paper_bgcolor: '#ffffff',
    autosize: false,
    annotations: annotations,
    shapes: shapes
  };
  
  const traces = [];
  
  // Data points trace
  if (showDataPoints || showConnectingLines) {
    let mode = [];
    if (showDataPoints) mode.push('markers');
    if (showConnectingLines) mode.push('lines');
    mode.push('text');
    
    traces.push({
      x: xDivisions,
      y: yDivisions,
      mode: mode.join('+'),
      type: 'scatter',
      marker: showDataPoints ? {size: 10, color: '#c41e3a', symbol: 'circle', line: {width: 2, color: '#8b0000'}} : undefined,
      line: showConnectingLines ? {color: '#003366', width: 2.5} : undefined,
      text: labels,
      textposition: 'top center',
      textfont: {family: 'Cambria, Georgia, serif', size: 10, color: '#000'},
      name: 'Data',
      // Custom data for hover
      customdata: xOriginalValues.map((xVal, i) => [xVal, yOriginalValues[i], xDivisions[i], yDivisions[i]]),
      // Custom hover template
      hovertemplate: 
        'Values: (%{customdata[0]}, %{customdata[1]})<br>' +
        'Divisions: (%{customdata[2]}, %{customdata[3]})' +
        '<extra></extra>',
      showlegend: true
    });
  }
  
  // Regression lines
  if (showRegressionLines) {
    regressionLines.forEach((reg, index) => {
      traces.push({
        x: reg.xValues,
        y: reg.yValues,
        mode: 'lines',
        type: 'scatter',
        line: {color: '#ff6b35', width: 2.5, dash: 'dash'},
        name: `Regression ${index + 1}`,
        showlegend: true
      });
    });
  }
  
  const config = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    toImageButtonOptions: {
      format: 'jpeg',
      filename: 'graph_plot',
      width: graphWidth + 120,
      height: graphHeight + 100,
      scale: 10
    },
    responsive: true,
    edits: { shapePosition: true }
  };
  
  
  Plotly.newPlot('plotlyGraph', traces, layout, config);
  
  // Show sections
  document.getElementById('graphDisplaySection').style.display = 'block';
  document.getElementById('reportSection').style.display = 'block';
  
  // Scroll to graph
  document.getElementById('graphDisplaySection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


function regenerateGraph() {
  if (document.getElementById('plotlyGraph').children.length > 0) {
    generateGraph();
  }
}

// Download graph as high-quality image
function downloadGraphImage() {
  const params = getParameters();
  const graphWidth = params.xTotalDivisions * PIXELS_PER_DIV + 120;
  const graphHeight = params.yTotalDivisions * PIXELS_PER_DIV + 100;
  
  const graphDiv = document.getElementById('plotlyGraph');
  Plotly.downloadImage(graphDiv, {
    format: 'jpeg',
    width: graphWidth,
    height: graphHeight,
    scale: 10,
    filename: 'graph_plot'
  });
}

// Regression Analysis
function calculateRegressionLine(xValues, yValues) {
  const n = xValues.length;
  if (n < 2) return null;
  
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const yMean = sumY / n;
  const ssTotal = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
  const ssResidual = yValues.reduce((sum, y, i) => {
    const yPred = slope * xValues[i] + intercept;
    return sum + Math.pow(y - yPred, 2);
  }, 0);
  const r2 = 1 - (ssResidual / ssTotal);
  
  return { 
    slope, 
    intercept, 
    r2, 
    equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}` 
  };
}

function addRegressionLine() {
  const params = getParameters();
  const tableRows = document.getElementById('dataTable').getElementsByTagName('tbody')[0].rows;
  
  const selectedXDiv = [];
  const selectedYDiv = [];
  
  for (let i = 0; i < tableRows.length; i++) {
    if (tableRows[i].cells[0].children[0].checked) {
      const xDiv = parseInt(tableRows[i].cells[3].textContent);
      const yDiv = parseInt(tableRows[i].cells[4].textContent);
      if (!isNaN(xDiv) && !isNaN(yDiv)) {
        selectedXDiv.push(xDiv);
        selectedYDiv.push(yDiv);
      }
    }
  }
  
  if (selectedXDiv.length < 2) {
    alert('Please select at least 2 points for regression analysis');
    return;
  }
  
  const regression = calculateRegressionLine(selectedXDiv, selectedYDiv);
  if (!regression) return;
  
  const xLineValues = [0, params.xTotalDivisions];
  const yLineValues = xLineValues.map(x => regression.slope * x + regression.intercept);
  
  regressionLines.push({
    id: regressionLines.length,
    xValues: xLineValues,
    yValues: yLineValues,
    equation: regression.equation,
    r2: regression.r2,
    pointCount: selectedXDiv.length
  });
  
  updateRegressionList();
  regenerateGraph();
}

function updateRegressionList() {
  const listDiv = document.getElementById('regressionList');
  listDiv.innerHTML = '';
  
  regressionLines.forEach((reg, index) => {
    const item = document.createElement('div');
    item.className = 'item-list-item';
    item.innerHTML = `
      <div>
        <strong>Regression ${index + 1}:</strong> ${reg.equation}<br>
        <small>R² = ${reg.r2.toFixed(4)} | ${reg.pointCount} points</small>
      </div>
      <button class="btn btn-red btn-sm" onclick="removeRegressionLine(${index})">
        <i class="fas fa-times"></i> Remove
      </button>
    `;
    listDiv.appendChild(item);
  });
}

function removeRegressionLine(index) {
  regressionLines.splice(index, 1);
  updateRegressionList();
  regenerateGraph();
}

function clearAllRegressions() {
  if (regressionLines.length === 0) return;
  if (confirm('Clear all regression lines?')) {
    regressionLines = [];
    updateRegressionList();
    regenerateGraph();
  }
}

// Reference Lines
function addReferenceLine() {
  const params = getParameters();
  const type = document.getElementById('refLineType').value;
  const position = parseFloat(document.getElementById('refLinePosition').value);
  const style = document.getElementById('refLineStyle').value;
  const width = parseFloat(document.getElementById('refLineWidth').value);
  const color = document.getElementById('refLineColor').value;
  
  if (isNaN(position)) {
    alert('Please enter a valid position');
    return;
  }
  
  if (type === 'vertical' && (position < 0 || position > params.xTotalDivisions)) {
    alert(`Position must be between 0 and ${params.xTotalDivisions}`);
    return;
  }
  if (type === 'horizontal' && (position < 0 || position > params.yTotalDivisions)) {
    alert(`Position must be between 0 and ${params.yTotalDivisions}`);
    return;
  }
  
  referenceLines.push({ type, position, style, width, color });
  updateReferenceList();
  regenerateGraph();
}

function updateReferenceList() {
  const listDiv = document.getElementById('referenceList');
  listDiv.innerHTML = '';
  
  referenceLines.forEach((line, index) => {
    const item = document.createElement('div');
    item.className = 'item-list-item';
    item.innerHTML = `
      <div>
        <strong>${line.type === 'vertical' ? 'Vertical' : 'Horizontal'} Line ${index + 1}:</strong> 
        Position = ${line.position}<br>
        <small>Style: ${line.style} | Width: ${line.width}px | Color: ${line.color}</small>
      </div>
      <button class="btn btn-red btn-sm" onclick="removeReferenceLine(${index})">
        <i class="fas fa-times"></i> Remove
      </button>
    `;
    listDiv.appendChild(item);
  });
}

function removeReferenceLine(index) {
  referenceLines.splice(index, 1);
  updateReferenceList();
  regenerateGraph();
}

function clearAllReferenceLines() {
  if (referenceLines.length === 0) return;
  if (confirm('Clear all reference lines?')) {
    referenceLines = [];
    updateReferenceList();
    regenerateGraph();
  }
}

// PDF Report Generation
async function generatePDFReport() {
  const experimentName = document.getElementById('experimentName').value;
  const studentName = document.getElementById('studentName').value;
  const rollNumber = document.getElementById('rollNumber').value;
  const department = document.getElementById('department').value;
  const subjectCode = document.getElementById('subjectCode').value;
  const experimentDate = document.getElementById('experimentDate').value;
  
  if (!experimentName || !studentName || !rollNumber || !department || !experimentDate) {
    alert('Please fill all required fields');
    return;
  }
  
  document.getElementById('loadingOverlay').classList.add('show');
  
  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const params = getParameters();
    
    // Page 1: Report Details
    pdf.setFont('times', 'bold');
    pdf.setFontSize(14);
    const splitTitle = pdf.splitTextToSize(experimentName, 170);
    pdf.text(splitTitle, 105, 20, { align: 'center' });
    
    let yPos = 20 + (splitTitle.length * 5) + 10;
    
    pdf.setFontSize(10);
    pdf.setFont('times', 'normal');
    
    pdf.text(`Name: ${studentName}`, 20, yPos);
    yPos += 6;
    pdf.text(`Roll Number: ${rollNumber}`, 20, yPos);
    yPos += 6;
    pdf.text(`Department: ${department}`, 20, yPos);
    yPos += 6;
    pdf.text(`Subject Code: ${subjectCode}`, 20, yPos);
    yPos += 6;
    
    // Format date as DD-MM-YYYY
    const dateObj = new Date(experimentDate);
    const formattedExpDate = `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`;
    pdf.text(`Date of Experiment: ${formattedExpDate}`, 20, yPos);
    yPos += 6;
    
    const now = new Date();
    const dateTime = now.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    pdf.text(`Report Generated: ${dateTime}`, 20, yPos);
    
    yPos += 12;
    
    // Smallest division
    pdf.text('Smallest division along X: ', 20, yPos);
    pdf.setFont('times', 'bold');
    pdf.text(`${params.xSmallestDiv.toFixed(4)}`, 75, yPos);
    
    yPos += 6;
    pdf.setFont('times', 'normal');
    pdf.text('Smallest division along Y: ', 20, yPos);
    pdf.setFont('times', 'bold');
    pdf.text(`${params.ySmallestDiv.toFixed(4)}`, 75, yPos);
    
    yPos += 12;
    pdf.setFont('times', 'normal');
    
    // Data table
    const tableRows = document.getElementById('dataTable').getElementsByTagName('tbody')[0].rows;
    const colWidths = [42.5, 42.5, 42.5, 42.5];
    const startX = 20;
    
    pdf.setLineWidth(0.1);
    pdf.setFont('times', 'bold');
    
    let xOffset = startX;
    pdf.rect(xOffset, yPos - 5, colWidths[0], 7);
    pdf.text('X Value', xOffset + colWidths[0]/2, yPos, { align: 'center' });
    xOffset += colWidths[0];
    
    pdf.rect(xOffset, yPos - 5, colWidths[1], 7);
    pdf.text('Y Value', xOffset + colWidths[1]/2, yPos, { align: 'center' });
    xOffset += colWidths[1];
    
    pdf.rect(xOffset, yPos - 5, colWidths[2], 7);
    pdf.text('X Division', xOffset + colWidths[2]/2, yPos, { align: 'center' });
    xOffset += colWidths[2];
    
    pdf.rect(xOffset, yPos - 5, colWidths[3], 7);
    pdf.text('Y Division', xOffset + colWidths[3]/2, yPos, { align: 'center' });
    
    yPos += 7;
    pdf.setFont('times', 'normal');
    
    for (let i = 0; i < tableRows.length; i++) {
      const xValue = tableRows[i].cells[1].children[0].value;
      const yValue = tableRows[i].cells[2].children[0].value;
      const xDiv = tableRows[i].cells[3].textContent;
      const yDiv = tableRows[i].cells[4].textContent;
      
      if (xValue && yValue && xDiv && yDiv) {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        
        xOffset = startX;
        pdf.rect(xOffset, yPos - 5, colWidths[0], 7);
        pdf.text(xValue, xOffset + colWidths[0]/2, yPos, { align: 'center' });
        xOffset += colWidths[0];
        
        pdf.rect(xOffset, yPos - 5, colWidths[1], 7);
        pdf.text(yValue, xOffset + colWidths[1]/2, yPos, { align: 'center' });
        xOffset += colWidths[1];
        
        pdf.rect(xOffset, yPos - 5, colWidths[2], 7);
        pdf.text(xDiv, xOffset + colWidths[2]/2, yPos, { align: 'center' });
        xOffset += colWidths[2];
        
        pdf.rect(xOffset, yPos - 5, colWidths[3], 7);
        pdf.text(yDiv, xOffset + colWidths[3]/2, yPos, { align: 'center' });
        
        yPos += 7;
      }
    }
    
    // Regression lines info
    if (regressionLines.length > 0) {
      yPos += 8;
      if (yPos > 260) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.setFont('times', 'bold');
      pdf.text('Regression Lines:', 20, yPos);
      
      yPos += 6;
      pdf.setFont('times', 'normal');
      regressionLines.forEach((reg, index) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(`${index + 1}. ${reg.equation} | R² = ${reg.r2.toFixed(4)}`, 20, yPos);
        yPos += 5;
      });
    }
    
    // Signature section
    yPos += 15;
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
    
    pdf.setFont('times', 'normal');
    pdf.text('Teacher Signature: ___________________________', 20, yPos);
    yPos += 10;
    pdf.text('Remarks:', 20, yPos);
    yPos += 6;
    pdf.text('________________________________________________________________________', 20, yPos);
    yPos += 6;
    pdf.text('________________________________________________________________________', 20, yPos);
    yPos += 6;
    pdf.text('________________________________________________________________________', 20, yPos);
    
    // Page 2: Graph
    pdf.addPage();
    
    const graphDiv = document.getElementById('plotlyGraph');
    const graphWidth = params.xTotalDivisions * PIXELS_PER_DIV + 120;
    const graphHeight = params.yTotalDivisions * PIXELS_PER_DIV + 100;
    
    const imgData = await Plotly.toImage(graphDiv, {
      format: 'jpeg',
      width: graphWidth,
      height: graphHeight,
      scale: 6
    });
    
    const pdfWidth = 190;
    const pdfHeight = (graphHeight * pdfWidth) / graphWidth;
    
    pdf.addImage(imgData, 'JPEG', 10, 10, pdfWidth, Math.min(pdfHeight, 277));
    
    pdf.save(`${experimentName.replace(/\s+/g, '_')}_report.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
  
  document.getElementById('loadingOverlay').classList.remove('show');
}

// Event listeners for parameter updates
['xBigDivisions', 'xSmallPerBig', 'xMinValue', 'xMaxValue', 
 'yBigDivisions', 'ySmallPerBig', 'yMinValue', 'yMaxValue'].forEach(id => {
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener('input', updateCalculatedParameters);
  }
});

// Initialize on load
window.onload = function() {
  updateCalculatedParameters();
};
