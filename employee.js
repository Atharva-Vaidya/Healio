// Employee dashboard functionality
currentUser = checkAuth();
if (!currentUser || currentUser.role !== 'employee') {
    logout();
}

document.getElementById('userName').textContent = currentUser.name;

let allRecords = [];
let allClaims = [];
let selectedRecord = null;

// Initialize data - CRITICAL: Load claims BEFORE records to prevent false duplicates
async function init() {
    try {
        // Step 1: Load claims first
        await loadClaims();
        // Step 2: Then load records (depends on claims for filtering)
        await loadRecords();
    } catch (error) {
        console.error('Error initializing employee dashboard:', error);
        showInlineMessage('Failed to load data. Please refresh the page.', 'error');
    }
}

// Start initialization
init();

// Load medical records
async function loadRecords() {
    try {
        allRecords = await apiGet('/records');
        const userRecords = allRecords.filter(r => r.employeeId === currentUser.employeeId);
        displayRecords(userRecords);
        populateRecordSelect(userRecords);
    } catch (error) {
        console.error('Error loading records:', error);
    }
}

// Display records in timeline
function displayRecords(records) {
    const container = document.getElementById('recordsList');
    
    if (records.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No medical records yet</h3><p>Hospital will upload treatment records after your visit</p></div>';
        return;
    }
    
    container.innerHTML = records.map(record => {
        const claim = getClaimForRecord(record.id);
        const claimStatus = claim ? claim.status : null;
        const canClaim = !isRecordClaimed(record.id) && record.hospitalName && record.billAmount;
        
        return `
        <div class="timeline-item ${claim ? 'claimed-record' : ''}">
            <div class="timeline-header">
                <h4>${record.type.replace('-', ' ').toUpperCase()}</h4>
                ${claim ? getClaimStatusBadge(claimStatus) : (canClaim ? '<span class="status-badge available">✓ Available for Claim</span>' : '<span class="status-badge unavailable">Not Claimable</span>')}
            </div>
            <p><strong>Description:</strong> ${record.description}</p>
            ${record.treatmentDetails ? `<p><strong>Treatment:</strong> ${record.treatmentDetails}</p>` : ''}
            ${record.billAmount ? `<p><strong>Bill Amount:</strong> ${formatCurrency(record.billAmount)}</p>` : '<p><strong>Bill Amount:</strong> Not provided</p>'}
            ${record.hospitalName ? `<p><strong>Hospital:</strong> ${record.hospitalName}</p>` : '<p><strong>Source:</strong> Self-uploaded</p>'}
            ${record.fileName ? `<p><strong>Bill File:</strong> ${record.fileName}</p>` : ''}
            <p class="date">${formatDate(record.createdAt)}</p>
            ${claim && claim.status === 'rejected' ? '<p class="error-text"><small>Previous claim was rejected. You can resubmit.</small></p>' : ''}
        </div>
    `}).join('');
}

// Get claim status for a record
function getClaimStatus(recordId) {
    const claim = allClaims.find(c => c.recordId == recordId);
    return claim ? claim.status : null;
}

// Get claim status badge with appropriate styling
function getClaimStatusBadge(status) {
    if (!status) return '';
    
    const badges = {
        'submitted': '<span class="status-badge submitted">📋 Claim Submitted</span>',
        'approved': '<span class="status-badge approved">✅ Claim Approved</span>',
        'rejected': '<span class="status-badge rejected">❌ Claim Rejected</span>'
    };
    
    return badges[status] || '<span class="status-badge pending">⏳ Under Review</span>';
}

// Check if record has been claimed (improved logic with type normalization)
function isRecordClaimed(recordId) {
    // Normalize to number for comparison
    const normalizedRecordId = Number(recordId);
    
    return allClaims.some(claim => {
        const normalizedClaimRecordId = Number(claim.recordId);
        // Only block if claim is submitted or approved (allow resubmission if rejected)
        const blockingStatuses = ['submitted', 'approved'];
        return normalizedClaimRecordId === normalizedRecordId && blockingStatuses.includes(claim.status);
    });
}

// Get claim status for a record
function getClaimStatus(recordId) {
    const normalizedRecordId = Number(recordId);
    const claim = allClaims.find(c => Number(c.recordId) === normalizedRecordId);
    return claim ? claim.status : null;
}

// Get claim for a record
function getClaimForRecord(recordId) {
    const normalizedRecordId = Number(recordId);
    return allClaims.find(c => Number(c.recordId) === normalizedRecordId);
}

// Populate record select dropdown - only hospital records with bills
function populateRecordSelect(records) {
    const select = document.getElementById('recordSelect');
    const noRecordsMsg = document.getElementById('noRecordsMessage');
    const submitBtn = document.getElementById('submitClaimBtn');
    
    // Filter only hospital-uploaded records with bill amounts that haven't been claimed
    const claimableRecords = records.filter(r => 
        r.hospitalName && 
        r.billAmount && 
        r.billAmount > 0 &&
        !isRecordClaimed(r.id)
    );
    
    if (claimableRecords.length === 0) {
        select.innerHTML = '<option value="">No claimable records available</option>';
        select.disabled = true;
        submitBtn.disabled = true;
        noRecordsMsg.style.display = 'flex';
        return;
    }
    
    select.disabled = false;
    submitBtn.disabled = false;
    noRecordsMsg.style.display = 'none';
    
    select.innerHTML = '<option value="">Choose a hospital treatment record...</option>' + 
        claimableRecords.map(r => 
            `<option value="${r.id}">${r.hospitalName} - ${r.type.replace('-', ' ')} - ${formatCurrency(r.billAmount)} (${new Date(r.createdAt).toLocaleDateString()})</option>`
        ).join('');
}

// Handle record selection
document.getElementById('recordSelect').addEventListener('change', function(e) {
    const recordId = e.target.value;
    const claimExistsMsg = document.getElementById('claimExistsMessage');
    const recordDetails = document.getElementById('recordDetails');
    const claimAmount = document.getElementById('claimAmount');
    
    // Hide messages and details by default
    claimExistsMsg.style.display = 'none';
    recordDetails.style.display = 'none';
    claimAmount.value = '';
    selectedRecord = null;
    
    if (!recordId) {
        return;
    }
    
    // Check for duplicate claim (should not happen with filtered dropdown, but safety check)
    if (isRecordClaimed(recordId)) {
        claimExistsMsg.style.display = 'flex';
        e.target.value = '';
        return;
    }
    
    selectedRecord = allRecords.find(r => r.id == recordId);
    
    if (selectedRecord) {
        // Show record details
        document.getElementById('detailHospital').textContent = selectedRecord.hospitalName || 'N/A';
        document.getElementById('detailType').textContent = selectedRecord.type.replace('-', ' ').toUpperCase();
        document.getElementById('detailDate').textContent = formatDate(selectedRecord.createdAt);
        document.getElementById('detailTreatment').textContent = selectedRecord.treatmentDetails || 'N/A';
        document.getElementById('detailFile').textContent = selectedRecord.fileName || 'No file';
        
        // Auto-fill claim amount from hospital bill
        claimAmount.value = selectedRecord.billAmount;
        
        // Show details card with animation
        recordDetails.style.display = 'block';
        setTimeout(() => {
            recordDetails.style.opacity = '1';
            recordDetails.style.transform = 'translateY(0)';
        }, 10);
    }
});

// Load claims
async function loadClaims() {
    try {
        allClaims = await apiGet('/claims');
        const userClaims = allClaims.filter(c => c.employeeId === currentUser.employeeId);
        displayClaims(userClaims);
    } catch (error) {
        console.error('Error loading claims:', error);
    }
}

// Display claims
function displayClaims(claims) {
    const container = document.getElementById('claimsList');
    
    if (claims.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No claims submitted yet</h3><p>Submit your first claim from hospital treatment records</p></div>';
        return;
    }
    
    container.innerHTML = claims.map(claim => `
        <div class="claim-card">
            <h4>Claim #${claim.id}</h4>
            <p><strong>Hospital:</strong> ${claim.hospitalName || 'N/A'}</p>
            <p><strong>Treatment:</strong> ${claim.recordType ? claim.recordType.replace('-', ' ') : 'N/A'}</p>
            ${claim.description ? `<p><strong>Notes:</strong> ${claim.description}</p>` : ''}
            <div class="amount">${formatCurrency(claim.amount)}</div>
            <p><strong>Submitted:</strong> ${formatDate(claim.submittedAt)}</p>
            ${getStatusBadge(claim.status)}
            ${claim.status === 'approved' && claim.updatedAt ? `<p class="success-text"><small>Approved on ${formatDate(claim.updatedAt)}</small></p>` : ''}
            ${claim.status === 'rejected' && claim.updatedAt ? `<p class="error-text"><small>Rejected on ${formatDate(claim.updatedAt)}</small></p>` : ''}
        </div>
    `).join('');
}

// Upload record modal
function showUploadModal() {
    document.getElementById('uploadModal').style.display = 'block';
}

function closeUploadModal() {
    document.getElementById('uploadModal').style.display = 'none';
    document.getElementById('uploadForm').reset();
}

// Upload form handler (for personal records, not for claims)
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const record = {
        employeeId: currentUser.employeeId,
        employeeName: currentUser.name,
        type: document.getElementById('recordType').value,
        description: document.getElementById('recordDescription').value,
        fileName: document.getElementById('recordFile').files[0]?.name || 'No file'
    };
    
    try {
        await apiPost('/records', record);
        alert('✅ Record uploaded successfully!');
        closeUploadModal();
        loadRecords();
    } catch (error) {
        console.error('Error uploading record:', error);
        alert('❌ Failed to upload record');
    }
});

// Claim form handler
document.getElementById('claimForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const recordId = document.getElementById('recordSelect').value;
    
    if (!recordId) {
        showInlineMessage('Please select a treatment record', 'warning');
        return;
    }
    
    // Double-check for duplicate claim (should not happen with filtered dropdown)
    if (isRecordClaimed(recordId)) {
        document.getElementById('claimExistsMessage').style.display = 'flex';
        return;
    }
    
    const record = allRecords.find(r => r.id == recordId);
    
    if (!record) {
        showInlineMessage('Selected record not found', 'error');
        return;
    }
    
    const claim = {
        employeeId: currentUser.employeeId,
        employeeName: currentUser.name,
        recordId: recordId,
        amount: record.billAmount,
        description: document.getElementById('claimDescription').value || 'Claim for hospital treatment',
        billFileName: record.fileName,
        recordType: record.type,
        hospitalName: record.hospitalName,
        treatmentDetails: record.treatmentDetails
    };
    
    try {
        // Disable submit button during processing
        const submitBtn = document.getElementById('submitClaimBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Submitting...';
        
        await apiPost('/claims', claim);
        
        // Show success message
        showSuccessNotification('✅ Claim submitted successfully! Your claim is now under review.');
        
        // Reset form
        document.getElementById('claimForm').reset();
        document.getElementById('recordDetails').style.display = 'none';
        selectedRecord = null;
        
        // Reload data
        await loadClaims();
        await loadRecords();
        
        // Navigate to claims tab after short delay
        setTimeout(() => {
            showTab('claims');
        }, 1500);
        
    } catch (error) {
        console.error('Error submitting claim:', error);
        showInlineMessage('Failed to submit claim. Please try again.', 'error');
    } finally {
        // Re-enable submit button
        const submitBtn = document.getElementById('submitClaimBtn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="btn-icon">📤</span> Submit Claim for Review';
    }
});

// Helper function to show inline messages
function showInlineMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `inline-message ${type}-message`;
    messageDiv.style.marginTop = '15px';
    messageDiv.innerHTML = `
        <div class="message-icon">${type === 'error' ? '❌' : '⚠️'}</div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    const form = document.getElementById('claimForm');
    form.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Helper function to show success notification
function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✅</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('uploadModal');
    if (event.target === modal) {
        closeUploadModal();
    }
}
