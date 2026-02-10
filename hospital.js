// Hospital dashboard functionality
currentUser = checkAuth();
if (!currentUser || currentUser.role !== 'hospital') {
    logout();
}

document.getElementById('userName').textContent = currentUser.name;

let uploadHistory = [];

// Load upload history
loadHistory();

async function loadHistory() {
    try {
        const allRecords = await apiGet('/records');
        uploadHistory = allRecords.filter(r => r.hospitalName === currentUser.name);
        displayHistory();
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

// Display upload history
function displayHistory() {
    const tbody = document.getElementById('historyTableBody');
    
    if (uploadHistory.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">No records uploaded yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = uploadHistory.map(record => `
        <tr>
            <td>${formatDate(record.createdAt)}</td>
            <td>${record.employeeId}</td>
            <td>${record.employeeName}</td>
            <td>${record.type.replace('-', ' ')}</td>
            <td>${formatCurrency(record.billAmount || 0)}</td>
        </tr>
    `).join('');
}

// Hospital upload form handler
document.getElementById('hospitalUploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const record = {
        employeeId: document.getElementById('patientId').value,
        employeeName: document.getElementById('patientName').value,
        type: document.getElementById('treatmentType').value,
        treatmentDetails: document.getElementById('treatmentDetails').value,
        billAmount: document.getElementById('billAmount').value,
        fileName: document.getElementById('hospitalFile').files[0]?.name || 'No file',
        hospitalName: currentUser.name,
        description: `${document.getElementById('treatmentType').value} - ${document.getElementById('treatmentDetails').value.substring(0, 50)}...`
    };
    
    try {
        await apiPost('/records', record);
        alert('Record uploaded successfully!');
        document.getElementById('hospitalUploadForm').reset();
        loadHistory();
        showTab('history');
    } catch (error) {
        console.error('Error uploading record:', error);
        alert('Failed to upload record');
    }
});
