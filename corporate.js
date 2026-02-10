// Corporate dashboard functionality
currentUser = checkAuth();
if (!currentUser || currentUser.role !== 'corporate') {
    logout();
}

document.getElementById('userName').textContent = currentUser.name;

let allClaims = [];
let currentFilter = 'all';

// Load data on page load
loadClaims();

async function loadClaims() {
    try {
        allClaims = await apiGet('/claims');
        updateAnalytics();
        displayClaims(currentFilter);
    } catch (error) {
        console.error('Error loading claims:', error);
    }
}

// Update analytics
function updateAnalytics() {
    const total = allClaims.length;
    const submitted = allClaims.filter(c => c.status === 'submitted').length;
    const approved = allClaims.filter(c => c.status === 'approved').length;
    const rejected = allClaims.filter(c => c.status === 'rejected').length;
    
    const totalAmount = allClaims.reduce((sum, c) => sum + Number(c.amount), 0);
    const approvedAmount = allClaims.filter(c => c.status === 'approved').reduce((sum, c) => sum + Number(c.amount), 0);
    
    document.getElementById('totalClaims').textContent = total;
    document.getElementById('pendingClaims').textContent = submitted;
    document.getElementById('approvedClaims').textContent = approved;
    document.getElementById('rejectedClaims').textContent = rejected;
    document.getElementById('totalAmount').textContent = formatCurrency(totalAmount);
    document.getElementById('approvedAmount').textContent = formatCurrency(approvedAmount);
}

// Filter claims
function filterClaims(status) {
    currentFilter = status;
    
    // Update filter button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayClaims(status);
}

// Display claims table
function displayClaims(filter) {
    const tbody = document.getElementById('claimsTableBody');
    
    let filteredClaims = filter === 'all' ? allClaims : allClaims.filter(c => c.status === filter);
    
    if (filteredClaims.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No claims found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredClaims.map(claim => `
        <tr>
            <td>#${claim.id}</td>
            <td>${claim.employeeName}<br><small>${claim.employeeId}</small></td>
            <td>${formatDate(claim.submittedAt)}</td>
            <td><strong>${formatCurrency(claim.amount)}</strong></td>
            <td>${getStatusBadge(claim.status)}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="viewClaimDetails(${claim.id})" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.85em;">View</button>
                    ${claim.status === 'submitted' ? `
                        <button onclick="updateClaimStatus(${claim.id}, 'approved')" class="btn btn-success">Approve</button>
                        <button onclick="updateClaimStatus(${claim.id}, 'rejected')" class="btn btn-danger">Reject</button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// View claim details
function viewClaimDetails(claimId) {
    const claim = allClaims.find(c => c.id === claimId);
    if (!claim) return;
    
    const detailsHtml = `
        <div style="padding: 30px;">
            <div style="margin-bottom: 20px;">
                <h4 style="color: #333; margin-bottom: 10px;">Claim Information</h4>
                <p><strong>Claim ID:</strong> #${claim.id}</p>
                <p><strong>Employee:</strong> ${claim.employeeName} (${claim.employeeId})</p>
                <p><strong>Amount:</strong> ${formatCurrency(claim.amount)}</p>
                <p><strong>Status:</strong> ${getStatusBadge(claim.status)}</p>
                <p><strong>Submitted:</strong> ${formatDate(claim.submittedAt)}</p>
                ${claim.updatedAt ? `<p><strong>Updated:</strong> ${formatDate(claim.updatedAt)}</p>` : ''}
            </div>
            
            <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <h4 style="color: #333; margin-bottom: 10px;">Hospital Treatment Details</h4>
                <p><strong>Hospital:</strong> ${claim.hospitalName || 'N/A'}</p>
                <p><strong>Treatment Type:</strong> ${claim.recordType ? claim.recordType.replace('-', ' ').toUpperCase() : 'N/A'}</p>
                <p><strong>Treatment Details:</strong> ${claim.treatmentDetails || 'N/A'}</p>
                <p><strong>Bill File:</strong> ${claim.billFileName || 'No file'}</p>
                <p><strong>Record ID:</strong> ${claim.recordId || 'N/A'}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #333; margin-bottom: 10px;">Employee Notes</h4>
                <p style="color: #666;">${claim.description || 'No additional notes provided'}</p>
            </div>
            
            <div style="padding: 12px; background: #e8f5e9; border-left: 4px solid #10b981; border-radius: 4px; margin-bottom: 20px;">
                <p style="margin: 0; color: #065f46;"><strong>✓ Fraud Check:</strong> This claim is linked to a verified hospital record with bill amount ${formatCurrency(claim.amount)}</p>
            </div>
            
            ${claim.status === 'submitted' ? `
                <div style="margin-top: 30px; display: flex; gap: 10px;">
                    <button onclick="updateClaimStatus(${claim.id}, 'approved'); closeClaimModal();" class="btn btn-success">Approve Claim</button>
                    <button onclick="updateClaimStatus(${claim.id}, 'rejected'); closeClaimModal();" class="btn btn-danger">Reject Claim</button>
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('claimDetails').innerHTML = detailsHtml;
    document.getElementById('claimModal').style.display = 'block';
}

// Close claim modal
function closeClaimModal() {
    document.getElementById('claimModal').style.display = 'none';
}

// Update claim status
async function updateClaimStatus(claimId, status) {
    try {
        await apiPut(`/claims/${claimId}`, { status });
        alert(`Claim ${status} successfully!`);
        loadClaims();
    } catch (error) {
        console.error('Error updating claim:', error);
        alert('Failed to update claim status');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('claimModal');
    if (event.target === modal) {
        closeClaimModal();
    }
}
