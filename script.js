const PIXELS_PER_DIV = 8;
let regressionLines = [];
let referenceLines = [];
let showDataPoints = true;
let showRegressionLines = true;
let showReferenceLines = true;

function loadDemo1() {
  document.getElementById('yBigDiv').value = 20;
  document.getElementById('ySmallPerBig').value = 10;
  document.getElementById('yMin').value = 151;
  document.getElementById('yMax').value = 315;
  document.getElementById('xBigDiv').value = 15;
  document.getElementById('xSmallPerBig').value = 10;
  document.getElementById('xMin').value = 10;
  document.getElementById('xMax').value = 50;
  document.getElementById('xLabel').value = 'Volume (mL)';
  document.getElementById('yLabel').value = 'pH';
  document.getElementById('graphTitle').value = 'pH vs Volume Added';
  
  const data = [
    [10, 151], [20, 175], [30, 200], [40, 250], [50, 315]
  ];
  
  const tbody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
  const rows = tbody.rows;
  for (let i = 0; i < data.length && i < rows.length; i++) {
    rows[i].cells[1].children[0].value = data[i][0];
    rows[i].cells[2].children[0].value = data[i][1];
    clearSolution(rows[i].cells[1].children[0]);
  }
  
  updateMinValues();
}

function loadDemo2() {
  document.getElementById('yBigDiv').value = 18;
  document.getElementById('ySmallPerBig').value = 10;
  document.getElementById('yMin').value = 0;
  document.getElementById('yMax').value = 100;
  document.getElementById('xBigDiv').value = 20;
  document.getElementById('xSmallPerBig').value = 10;
  document.getElementById('xMin').value = 0;
  document.getElementById('xMax').value = 60;
  document.getElementById('xLabel').value = 'Time (min)';
  document.getElementById('yLabel').value = 'Temperature (°C)';
  document.getElementById('graphTitle').value = 'Temperature vs Time';
  
  const data = [
    [0, 25], [15, 45], [30, 70], [45, 85], [60, 95]
  ];
  
  const tbody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
  const rows = tbody.rows;
  for (let i = 0; i < data.length && i < rows.length; i++) {
    rows[i].cells[1].children[0].value = data[i][0];
    rows[i].cells[2].children[0].value = data[i][1];
    clearSolution(rows[i].cells[1].children[0]);
  }
  
  updateMinValues();
}

function updateMinValues() {
  const yBigDiv = parseInt(document.getElementById('yBigDiv').value) || 1;
  const ySmallPerBig = parseInt(document.getElementById('ySmallPerBig').value) || 1;
  const xBigDiv = parseInt(document.getElementById('xBigDiv').value) || 1;
  const xSmallPerBig = parseInt(document.getElementById('xSmallPerBig').value) || 1;
  const yMin = parseFloat(document.getElementById('yMin').value) || 0;
  const yMax = parseFloat(document.getElementById('yMax').value) || 1;
  const xMin = parseFloat(document.getElementById('xMin').value) || 0;
  const xMax = parseFloat(document.getElementById('xMax').value) || 1;
  
  const yTotalDiv = yBigDiv * ySmallPerBig;
  const xTotalDiv = xBigDiv * xSmallPerBig;
  const yRange = yMax - yMin;
  const xRange = xMax - xMin;
  const yPerDiv = yRange / yTotalDiv;
  const xPerDiv = xRange / xTotalDiv;
  
  document.getElementById('minValuesText').innerHTML = `
    <strong>X-axis:</strong> ${xTotalDiv} total divisions (${xBigDiv} × ${xSmallPerBig}) | Value per division: <u>${xPerDiv.toFixed(4)}</u><br>
    <strong>Y-axis:</strong> ${yTotalDiv} total divisions (${yBigDiv} × ${ySmallPerBig}) | Value per division: <u>${yPerDiv.toFixed(4)}</u>
  `;
}

function clearSolution(input) {
  const row = input.parentNode.parentNode;
  row.cells[3].textContent = '';
  row.cells[4].textContent = '';
}

function toggleAllRegression() {
  const selectAll = document.getElementById('selectAll').checked;
  const checkboxes = document.querySelectorAll('.reg-check');
  checkboxes.forEach(cb => cb.checked = selectAll);
}

function addRow() {
  const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
  const row = table.insertRow();
  row.innerHTML = `
    <td><input type="checkbox" class="reg-check"></td>
    <td><input type="number" step="any" oninput="clearSolution(this)"></td>
    <td><input type="number" step="any" oninput="clearSolution(this)"></td>
    <td class="solution-cell"></td>
    <td class="solution-cell"></td>
    <td><button class="btn btn-red" onclick="removeRow(this)"><i class="fas fa-trash"></i></button></td>
  `;
}

function removeRow(btn) {
  const row = btn.parentNode.parentNode;
  if (document.getElementById('dataTable').getElementsByTagName('tbody')[0].rows.length > 1) {
    row.parentNode.removeChild(row);
  } else {
    alert('At least one data point required');
  }
}

function calculateSolution() {
  const yBigDiv = parseInt(document.getElementById('yBigDiv').value);
  const ySmallPerBig = parseInt(document.getElementById('ySmallPerBig').value);
  const yMin = parseFloat(document.getElementById('yMin').value);
  const yMax = parseFloat(document.getElementById('yMax').value);
  const xBigDiv = parseInt(document.getElementById('xBigDiv').value);
  const xSmallPerBig = parseInt(document.getElementById('xSmallPerBig').value);
  const xMin = parseFloat(document.getElementById('xMin').value);
  const xMax = parseFloat(document.getElementById('xMax').value);
  
  const yTotalDiv = yBigDiv * ySmallPerBig;
  const xTotalDiv = xBigDiv * xSmallPerBig;
  const yRange = yMax - yMin;
  const xRange = xMax - xMin;
  const yPerDiv = yRange / yTotalDiv;
  const xPerDiv = xRange / xTotalDiv;
  
  const tableRows = document.getElementById('dataTable').getElementsByTagName('tbody')[0].rows;
  
  for (let i = 0; i < tableRows.length; i++) {
    const x = parseFloat(tableRows[i].cells[1].children[0].value);
    const y = parseFloat(tableRows[i].cells[2].children[0].value);
    
    if (!isNaN(x) && !isNaN(y)) {
      const xDiv = Math.round((x - xMin) / xPerDiv);
      const yDiv = Math.round((y - yMin) / yPerDiv);
      
      tableRows[i].cells[3].textContent = xDiv;
      tableRows[i].cells[4].textContent = yDiv;
    }
  }
  
  document.getElementById('calcInfo').classList.add('show');
  document.getElementById('calcText').innerHTML = `
    <strong>Calculations Complete:</strong><br>
    X: ${xTotalDiv} divisions | ${xPerDiv.toFixed(4)} units/div | Range: ${xMin} to ${xMax}<br>
    Y: ${yTotalDiv} divisions | ${yPerDiv.toFixed(4)} units/div | Range: ${yMin} to ${yMax}
  `;
  document.getElementById('graphBtn').style.display = 'inline-block';
}

function calculateRegression(xVals, yVals) {
  const n = xVals.length;
  if (n < 2) return null;
  
  const sumX = xVals.reduce((a, b) => a + b, 0);
  const sumY = yVals.reduce((a, b) => a + b, 0);
  const sumXY = xVals.reduce((sum, x, i) => sum + x * yVals[i], 0);
  const sumX2 = xVals.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const yMean = sumY / n;
  const ssTotal = yVals.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
  const ssResidual = yVals.reduce((sum, y, i) => {
    const yPred = slope * xVals[i] + intercept;
    return sum + Math.pow(y - yPred, 2);
  }, 0);
  const r2 = 1 - (ssResidual / ssTotal);
  
  return { slope, intercept, r2, equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}` };
}

function addRegressionLine() {
  const tableRows = document.getElementById('dataTable').getElementsByTagName('tbody')[0].rows;
  let selectedX = [], selectedY = [];
  
  for (let i = 0; i < tableRows.length; i++) {
    if (tableRows[i].cells[0].children[0].checked) {
      const xDiv = parseInt(tableRows[i].cells[3].textContent);
      const yDiv = parseInt(tableRows[i].cells[4].textContent);
      if (!isNaN(xDiv) && !isNaN(yDiv)) {
        selectedX.push(xDiv);
        selectedY.push(yDiv);
      }
    }
  }
  
  if (selectedX.length < 2) {
    alert('Please select at least 2 points for regression');
    return;
  }
  
  const regression = calculateRegression(selectedX, selectedY);
  if (!regression) return;
  
  const yBigDiv = parseInt(document.getElementById('yBigDiv').value);
  const ySmallPerBig = parseInt(document.getElementById('ySmallPerBig').value);
  const xBigDiv = parseInt(document.getElementById('xBigDiv').value);
  const xSmallPerBig = parseInt(document.getElementById('xSmallPerBig').value);
  const yTotalDiv = yBigDiv * ySmallPerBig;
  const xTotalDiv = xBigDiv * xSmallPerBig;
  
  const regLineX = [0, xTotalDiv];
  const regLineY = regLineX.map(x => regression.slope * x + regression.intercept);
  
  const regId = regressionLines.length;
  regressionLines.push({
    id: regId,
    x: regLineX,
    y: regLineY,
    equation: regression.equation,
    r2: regression.r2,
    pointCount: selectedX.length
  });
  
  updateRegressionList();
  regenerateGraph();
}

function updateRegressionList() {
  const listDiv = document.getElementById('regressionList');
  listDiv.innerHTML = '';
  
  regressionLines.forEach((reg, index) => {
    const regDiv = document.createElement('div');
    regDiv.className = 'calc-info';
    regDiv.style.display = 'block';
    regDiv.innerHTML = `
      <strong>Regression ${index + 1}:</strong> ${reg.equation} | R² = ${reg.r2.toFixed(4)} | Points: ${reg.pointCount}
      <button class="btn btn-red" onclick="removeRegression(${index})" style="margin-left:10px; padding:3px 8px; font-size:10px;">
        <i class="fas fa-times"></i> Remove
      </button>
    `;
    listDiv.appendChild(regDiv);
  });
}

function removeRegression(index) {
  regressionLines.splice(index, 1);
  updateRegressionList();
  regenerateGraph();
}

function clearAllRegressions() {
  regressionLines = [];
  updateRegressionList();
  regenerateGraph();
}

function addReferenceLine() {
  const type = document.getElementById('refLineType').value;
  const pos = parseFloat(document.getElementById('refLinePos').value);
  const color = document.getElementById('refLineColor').value;
  const width = parseFloat(document.getElementById('refLineWidth').value);
  const style = document.getElementById('refLineStyle').value;
  
  const yBigDiv = parseInt(document.getElementById('yBigDiv').value);
  const ySmallPerBig = parseInt(document.getElementById('ySmallPerBig').value);
  const xBigDiv = parseInt(document.getElementById('xBigDiv').value);
  const xSmallPerBig = parseInt(document.getElementById('xSmallPerBig').value);
  const yTotalDiv = yBigDiv * ySmallPerBig;
  const xTotalDiv = xBigDiv * xSmallPerBig;
  
  if (type === 'vertical' && (pos < 0 || pos > xTotalDiv)) {
    alert(`Position must be between 0 and ${xTotalDiv}`);
    return;
  }
  if (type === 'horizontal' && (pos < 0 || pos > yTotalDiv)) {
    alert(`Position must be between 0 and ${yTotalDiv}`);
    return;
  }
  
  referenceLines.push({ type, pos, color, width, style });
  updateRefLineList();
  regenerateGraph();
}

function updateRefLineList() {
  const listDiv = document.getElementById('refLineList');
  listDiv.innerHTML = '';
  
  referenceLines.forEach((line, index) => {
    const lineDiv = document.createElement('div');
    lineDiv.className = 'calc-info';
    lineDiv.style.display = 'block';
    lineDiv.innerHTML = `
      <strong>${line.type === 'vertical' ? 'Vertical' : 'Horizontal'} Line ${index + 1}:</strong> Position = ${line.pos} | Color: ${line.color} | Width: ${line.width}px | Style: ${line.style}
      <button class="btn btn-red" onclick="removeRefLine(${index})" style="margin-left:10px; padding:3px 8px; font-size:10px;">
        <i class="fas fa-times"></i> Remove
      </button>
    `;
    listDiv.appendChild(lineDiv);
  });
}

function removeRefLine(index) {
  referenceLines.splice(index, 1);
  updateRefLineList();
  regenerateGraph();
}

function clearAllRefLines() {
  referenceLines = [];
  updateRefLineList();
  regenerateGraph();
}

function toggleDataPoints() {
  showDataPoints = document.getElementById('showDataPoints').checked;
  regenerateGraph();
}

function toggleRegressionLines() {
  showRegressionLines = document.getElementById('showRegressionLines').checked;
  regenerateGraph();
}

function toggleReferenceLines() {
  showReferenceLines = document.getElementById('showReferenceLines').checked;
  regenerateGraph();
}

function downloadGraphPNG() {
  const graphDiv = document.getElementById('graphDiv');
  
  // Get exact graph dimensions from parameters
  const yBigDiv = parseInt(document.getElementById('yBigDiv').value);
  const ySmallPerBig = parseInt(document.getElementById('ySmallPerBig').value);
  const xBigDiv = parseInt(document.getElementById('xBigDiv').value);
  const xSmallPerBig = parseInt(document.getElementById('xSmallPerBig').value);
  const yTotalDiv = yBigDiv * ySmallPerBig;
  const xTotalDiv = xBigDiv * xSmallPerBig;
  const gWidth = xTotalDiv * PIXELS_PER_DIV + 120;
  const gHeight = yTotalDiv * PIXELS_PER_DIV + 100;
  
  Plotly.downloadImage(graphDiv, {
    format: 'png',
    width: gWidth,      // Use calculated width
    height: gHeight,    // Use calculated height
    scale: 10,           // Kx resolution multiplier
    filename: 'graph_plot'
  });
}


function generateGraph() {
  const yBigDiv = parseInt(document.getElementById('yBigDiv').value);
  const ySmallPerBig = parseInt(document.getElementById('ySmallPerBig').value);
  const yMin = parseFloat(document.getElementById('yMin').value);
  const yMax = parseFloat(document.getElementById('yMax').value);
  const xBigDiv = parseInt(document.getElementById('xBigDiv').value);
  const xSmallPerBig = parseInt(document.getElementById('xSmallPerBig').value);
  const xMin = parseFloat(document.getElementById('xMin').value);
  const xMax = parseFloat(document.getElementById('xMax').value);
  const tickInterval = parseInt(document.getElementById('tickInterval').value);
  const xLabel = document.getElementById('xLabel').value;
  const yLabel = document.getElementById('yLabel').value;
  const graphTitle = document.getElementById('graphTitle').value;
  
  const yTotalDiv = yBigDiv * ySmallPerBig;
  const xTotalDiv = xBigDiv * xSmallPerBig;
  const yRange = yMax - yMin;
  const xRange = xMax - xMin;
  const yPerDiv = yRange / yTotalDiv;
  const xPerDiv = xRange / xTotalDiv;
  const graphWidth = xTotalDiv * PIXELS_PER_DIV;
  const graphHeight = yTotalDiv * PIXELS_PER_DIV;
  
  const tableRows = document.getElementById('dataTable').getElementsByTagName('tbody')[0].rows;
  let xDivs = [], yDivs = [], labels = [];
  
  for (let i = 0; i < tableRows.length; i++) {
    const x = parseFloat(tableRows[i].cells[1].children[0].value);
    const y = parseFloat(tableRows[i].cells[2].children[0].value);
    
    if (!isNaN(x) && !isNaN(y)) {
      xDivs.push(Math.round((x - xMin) / xPerDiv));
      yDivs.push(Math.round((y - yMin) / yPerDiv));
      labels.push(`(${x}, ${y})`);
    }
  }
  
  let xTickPositions = [], xTickLabels = [];
  for (let i = 0; i <= xTotalDiv; i += tickInterval) {
    xTickPositions.push(i);
    xTickLabels.push((xMin + (i * xPerDiv)).toFixed(2));
  }
  
  let yTickPositions = [], yTickLabels = [];
  for (let i = 0; i <= yTotalDiv; i += tickInterval) {
    yTickPositions.push(i);
    yTickLabels.push((yMin + (i * yPerDiv)).toFixed(2));
  }
  
  const annotations = [{
    text: `Smallest Divisions<br><b>X: ${xPerDiv.toFixed(4)}<br>Y: ${yPerDiv.toFixed(4)}</b>`,
    xref: 'paper',
    yref: 'paper',
    x: 0.02,
    y: 0.98,
    xanchor: 'left',
    yanchor: 'top',
    showarrow: false,
    bgcolor: '#fffacd',
    bordercolor: '#000',
    borderwidth: 1,
    borderpad: 4,
    font: {family: 'Cambria, Georgia, serif', size: 9, color: '#000'}
  }];
  
  const shapes = [];
  if (showReferenceLines) {
    referenceLines.forEach(refLine => {
      if (refLine.type === 'vertical') {
        shapes.push({
          type: 'line',
          xref: 'x',
          yref: 'paper',
          x0: refLine.pos,
          y0: 0,
          x1: refLine.pos,
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
          y0: refLine.pos,
          x1: 1,
          y1: refLine.pos,
          line: { dash: refLine.style, color: refLine.color, width: refLine.width },
          editable: true
        });
      }
    });
  }
  
  const layout = {
    title: {text: graphTitle, font: {family: 'Cambria, Georgia, serif', size: 16, color: '#000'}},
    xaxis: {
      title: {text: xLabel, font: {family: 'Cambria, Georgia, serif', size: 13}},
      range: [0, xTotalDiv],
      tickmode: 'array',
      tickvals: xTickPositions,
      ticktext: xTickLabels,
      showgrid: true,
      gridcolor: '#2d8659',
      gridwidth: 2,
      zeroline: false,
      tickfont: {family: 'Cambria, Georgia, serif', size: 10},
      minor: {dtick: 1, showgrid: true, gridcolor: '#90d9b8', gridwidth: 0.5},
      scaleanchor: 'y',
      scaleratio: 1
    },
    yaxis: {
      title: {text: yLabel, font: {family: 'Cambria, Georgia, serif', size: 13}},
      range: [0, yTotalDiv],
      tickmode: 'array',
      tickvals: yTickPositions,
      ticktext: yTickLabels,
      showgrid: true,
      gridcolor: '#2d8659',
      gridwidth: 2,
      zeroline: false,
      tickfont: {family: 'Cambria, Georgia, serif', size: 10},
      minor: {dtick: 1, showgrid: true, gridcolor: '#90d9b8', gridwidth: 0.5}
    },
    width: graphWidth + 120,
    height: graphHeight + 100,
    margin: {l: 70, r: 40, t: 70, b: 60},
    font: {family: 'Cambria, Georgia, serif', size: 11},
    plot_bgcolor: '#fefef8',
    paper_bgcolor: '#ffffff',
    autosize: false,
    annotations: annotations,
    shapes: shapes
  };
  
  const traces = [];
  
  if (showDataPoints) {
    traces.push({
      x: xDivs,
      y: yDivs,
      mode: 'markers+lines+text',
      type: 'scatter',
      marker: {size: 9, color: '#c41e3a', symbol: 'circle', line: {width: 2, color: '#8b0000'}},
      line: {color: '#003366', width: 2.5},
      text: labels,
      textposition: 'top center',
      textfont: {family: 'Cambria, Georgia, serif', size: 9, color: '#000'},
      name: 'Data Points'
    });
  }
  
  if (showRegressionLines) {
    regressionLines.forEach((reg, index) => {
      traces.push({
        x: reg.x,
        y: reg.y,
        mode: 'lines',
        type: 'scatter',
        line: {color: '#ff6b35', width: 2, dash: 'dash'},
        name: `Regression ${index + 1}`,
        showlegend: true
      });
    });
  }
  
  const config = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    toImageButtonOptions: {
      format: 'png',
      filename: 'graph_plot',
      width: graphWidth + 120,
      height: graphHeight + 100,
      scale: 3
    },
    responsive: true,
    edits: { shapePosition: true }
  };
  
  Plotly.newPlot('graphDiv', traces, layout, config);
  
  document.getElementById('graphDiv').classList.add('show');
  document.getElementById('autoscaleInfo').style.display = 'block';
  document.getElementById('downloadInfo').style.display = 'block';
  document.getElementById('reportSection').style.display = 'block';
  document.getElementById('addRegBtn').style.display = 'inline-block';
  document.getElementById('clearRegBtn').style.display = 'inline-block';
  document.getElementById('addRefBtn').style.display = 'inline-block';
  document.getElementById('clearRefBtn').style.display = 'inline-block';
  document.getElementById('toggleSection').style.display = 'block';
  
  document.getElementById('genDate').value = new Date().toISOString().split('T')[0];
}

function regenerateGraph() {
  if (document.getElementById('graphDiv').classList.contains('show')) {
    generateGraph();
  }
}

async function generatePDFReport() {
  const expName = document.getElementById('expName').value;
  const name = document.getElementById('studentName').value;
  const expDate = document.getElementById('expDate').value;
  const subject = document.getElementById('subject').value;
  const rollNo = document.getElementById('rollNo').value;
  const dept = document.getElementById('dept').value;
  
  if (!expName || !name || !expDate || !rollNo || !dept) {
    alert('Please fill all report fields');
    return;
  }
  
  document.getElementById('loadingMsg').classList.add('show');
  
  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    pdf.setFont('times', 'bold');
    pdf.setFontSize(14);
    pdf.setFont('times', 'bold');
    pdf.setFontSize(14);
    // Split long titles to fit page width
    const splitTitle = pdf.splitTextToSize(expName, 170);
    pdf.text(splitTitle, 105, 20, { align: 'center' });
    
    let yPos = 40;
    pdf.setFontSize(10);
    pdf.setFont('times', 'normal');
    
    pdf.text(`Name: ${name}`, 20, yPos);
    yPos += 6;
    pdf.text(`Roll Number: ${rollNo}`, 20, yPos);
    yPos += 6;
    pdf.text(`Department: ${dept}`, 20, yPos);
    yPos += 6;
    pdf.text(`Subject Code: ${subject}`, 20, yPos);
    yPos += 6;
    // Convert date from YYYY-MM-DD to DD-MM-YYYY
    const dateObj = new Date(expDate);
    const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`;
    pdf.text(`Date of Performing: ${formattedDate}`, 20, yPos);
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
    pdf.text(`Date and Time of Report Generation: ${dateTime}`, 20, yPos);
    
    yPos += 12;
    pdf.setFont('times', 'normal');
    
    const yBigDiv = document.getElementById('yBigDiv').value;
    const ySmallPerBig = document.getElementById('ySmallPerBig').value;
    const yMin = document.getElementById('yMin').value;
    const yMax = document.getElementById('yMax').value;
    const xBigDiv = document.getElementById('xBigDiv').value;
    const xSmallPerBig = document.getElementById('xSmallPerBig').value;
    const xMin = document.getElementById('xMin').value;
    const xMax = document.getElementById('xMax').value;
    
    const yTotalDiv = parseInt(yBigDiv) * parseInt(ySmallPerBig);
    const xTotalDiv = parseInt(xBigDiv) * parseInt(xSmallPerBig);
    const yRange = parseFloat(yMax) - parseFloat(yMin);
    const xRange = parseFloat(xMax) - parseFloat(xMin);
    const yPerDiv = yRange / yTotalDiv;
    const xPerDiv = xRange / xTotalDiv;
    
    pdf.text('Smallest division along X: ', 20, yPos);
    pdf.setFont('times', 'bold');
    pdf.text(`${xPerDiv.toFixed(4)}`, 75, yPos);
    
    yPos += 6;
    pdf.setFont('times', 'normal');
    pdf.text('Smallest division along Y: ', 20, yPos);
    pdf.setFont('times', 'bold');
    pdf.text(`${yPerDiv.toFixed(4)}`, 75, yPos);
    
    yPos += 12;
    pdf.setFont('times', 'normal');
    
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
      const x = tableRows[i].cells[1].children[0].value;
      const y = tableRows[i].cells[2].children[0].value;
      const xDiv = tableRows[i].cells[3].textContent;
      const yDiv = tableRows[i].cells[4].textContent;
      
      if (x && y && xDiv && yDiv) {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        
        xOffset = startX;
        pdf.rect(xOffset, yPos - 5, colWidths[0], 7);
        pdf.text(x, xOffset + colWidths[0]/2, yPos, { align: 'center' });
        xOffset += colWidths[0];
        
        pdf.rect(xOffset, yPos - 5, colWidths[1], 7);
        pdf.text(y, xOffset + colWidths[1]/2, yPos, { align: 'center' });
        xOffset += colWidths[1];
        
        pdf.rect(xOffset, yPos - 5, colWidths[2], 7);
        pdf.text(xDiv, xOffset + colWidths[2]/2, yPos, { align: 'center' });
        xOffset += colWidths[2];
        
        pdf.rect(xOffset, yPos - 5, colWidths[3], 7);
        pdf.text(yDiv, xOffset + colWidths[3]/2, yPos, { align: 'center' });
        
        yPos += 7;
      }
    }
    
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
        pdf.text(`${index + 1}. ${reg.equation} | R-squared = ${reg.r2.toFixed(4)}`, 20, yPos);
        yPos += 5;
      });
    }
    
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
    
    // New page for graph - no heading, maximize space
    pdf.addPage();

    const graphDiv = document.getElementById('graphDiv');

    const yBigDivVal = parseInt(document.getElementById('yBigDiv').value);
    const ySmallPerBigVal = parseInt(document.getElementById('ySmallPerBig').value);
    const xBigDivVal = parseInt(document.getElementById('xBigDiv').value);
    const xSmallPerBigVal = parseInt(document.getElementById('xSmallPerBig').value);
    const yTotalDivVal = yBigDivVal * ySmallPerBigVal;
    const xTotalDivVal = xBigDivVal * xSmallPerBigVal;
    const gWidth = xTotalDivVal * PIXELS_PER_DIV + 120;
    const gHeight = yTotalDivVal * PIXELS_PER_DIV + 100;

    const imgData = await Plotly.toImage(graphDiv, {
      format: 'jpeg',
      width: gWidth,
      height: gHeight,
      scale: 5
    });

    // Maximize graph on page - use full A4 width and height
    const pdfWidth = 190;  // Full width minus margins
    const pdfHeight = (gHeight * pdfWidth) / gWidth;

    // Place from top with minimal margin, maximize space
    pdf.addImage(imgData, 'jpeg', 10, 10, pdfWidth, Math.min(pdfHeight, 277));

    
    pdf.save(`${expName.replace(/\s+/g, '_')}_report.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
  
  document.getElementById('loadingMsg').classList.remove('show');
}

['yBigDiv', 'ySmallPerBig', 'xBigDiv', 'xSmallPerBig', 'yMin', 'yMax', 'xMin', 'xMax'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateMinValues);
});

window.onload = function() {
  updateMinValues();
  document.getElementById('genDate').value = new Date().toISOString().split('T')[0];
};
