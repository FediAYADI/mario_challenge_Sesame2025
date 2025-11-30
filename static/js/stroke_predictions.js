document.addEventListener('DOMContentLoaded', function() {
    // Function to get color based on percentage
    function getColorForPercentage(percentage) {
        if (percentage < 20) {
            // Green to yellow gradient (0-20%)
            const ratio = percentage / 20;
            const r = Math.floor(16 + (239 - 16) * ratio);
            const g = 185;
            const b = Math.floor(129 - (129 - 16) * ratio);
            return `rgb(${r}, ${g}, ${b})`;
        } else if (percentage < 70) {
            // Yellow to orange gradient (20-70%)
            const ratio = (percentage - 20) / 50;
            const r = 239 + Math.floor((245 - 239) * ratio);
            const g = 185 - Math.floor((158 - 129) * ratio);
            const b = 16 + Math.floor((16 - 16) * ratio);
            return `rgb(${r}, ${g}, ${b})`;
        } else {
            // Orange to red gradient (70-100%)
            const ratio = (percentage - 70) / 30;
            const r = 245 + Math.floor((220 - 245) * ratio);
            const g = 158 - Math.floor((38 - 16) * ratio);
            const b = 16;
            return `rgb(${r}, ${g}, ${b})`;
        }
    }

    // Function to process the CSV data
    function processCSVData(csvData) {
        const results = [];
        const lines = csvData.split('\n');
        
        // Skip header row if exists
        const startRow = lines[0].includes('stroke_risk_percent') ? 1 : 0;
        
        for (let i = startRow; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const percentage = parseFloat(line);
                if (!isNaN(percentage)) {
                    results.push({
                        id: `Patient ${i + 1 - startRow}`,
                        percentage: percentage,
                        color: getColorForPercentage(percentage)
                    });
                }
            }
        }
        return results;
    }

    // Function to display the results
    function displayResults(results) {
        const resultsContainer = document.getElementById('risk-results');
        const noResults = document.getElementById('no-results');
        
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        
        // Create results grid
        const grid = document.createElement('div');
        grid.className = 'results-grid';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
        grid.style.gap = '1.5rem';
        grid.style.width = '100%';
        grid.style.marginTop = '2rem';
        
        results.forEach(item => {
            const resultCard = document.createElement('div');
            resultCard.className = 'result-card';
            resultCard.style.background = 'var(--panel-soft)';
            resultCard.style.borderRadius = '8px';
            resultCard.style.padding = '1.5rem';
            resultCard.style.borderLeft = `4px solid ${item.color}`;
            resultCard.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            resultCard.style.transition = 'transform 0.2s ease';
            
            resultCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="margin: 0; color: var(--text);">${item.id}</h3>
                    <span style="font-weight: bold; color: ${item.color};">${item.percentage.toFixed(2)}%</span>
                </div>
                <div style="height: 8px; background: var(--panel); border-radius: 4px; overflow: hidden; margin-bottom: 0.5rem;">
                    <div style="width: ${item.percentage}%; height: 100%; background: ${item.color}; border-radius: 4px;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted);">
                    <span>Risk: ${item.percentage < 20 ? 'Low' : item.percentage < 70 ? 'Medium' : 'High'}</span>
                    <span>${item.percentage.toFixed(2)}%</span>
                </div>
            `;
            
            grid.appendChild(resultCard);
        });
        
        resultsContainer.appendChild(grid);
        resultsContainer.style.display = 'block';
    }

    // Function to handle file upload
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const csvData = e.target.result;
                const results = processCSVData(csvData);
                displayResults(results);
            };
            reader.readAsText(file);
        }
    }

    // Handle form submission
    const form = document.getElementById('csv-upload-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Create file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.csv';
            fileInput.style.display = 'none';
            
            // Handle file selection
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const results = processCSVData(e.target.result);
                    displayResults(results);
                };
                reader.readAsText(file);
            });
            
            // Trigger file selection
            document.body.appendChild(fileInput);
            fileInput.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(fileInput);
            }, 100);
        });
    }
});
