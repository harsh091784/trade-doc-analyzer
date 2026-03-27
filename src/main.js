import './style.css';

// ===== APPLICATION STATE =====
const state = {
  currentPage: 'dashboard',
  uploadedFiles: [],
  selectedDocType: null,
  selectedStandards: ['ucp600', 'isbp745'],
  analysisHistory: generateSampleHistory(),
  sidebarOpen: false,
  apiKey: localStorage.getItem('trade_doc_api_key') || 'AIzaSyBpbrYiVuFjlG5NUSiz-ZTXSJu5hYq0EOw',
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMenuToggle();
  initModal();
  renderPage('dashboard');
});

// ===== NAVIGATION =====
function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      navigateTo(page);
    });
  });
}

function navigateTo(page) {
  state.currentPage = page;

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

  // Update pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) {
    pageEl.classList.add('active');
  }

  // Update topbar
  const titles = {
    dashboard: ['Dashboard', 'Overview & Analytics'],
    upload: ['Upload & Analyze', 'Document Compliance Analysis'],
    history: ['Analysis History', 'Previous Analysis Results'],
    standards: ['Standards & Rules', 'International Trade Standards Reference'],
    settings: ['Settings', 'Application Configuration'],
  };

  const [title, breadcrumb] = titles[page] || ['Dashboard', 'Overview'];
  document.getElementById('pageTitle').textContent = title;
  document.getElementById('pageBreadcrumb').textContent = breadcrumb;

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');

  renderPage(page);
}

function renderPage(page) {
  const renderers = {
    dashboard: renderDashboard,
    upload: renderUpload,
    history: renderHistory,
    standards: renderStandards,
    settings: renderSettings,
  };
  if (renderers[page]) renderers[page]();
}

// ===== MENU TOGGLE =====
function initMenuToggle() {
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
}

// ===== MODAL =====
function initModal() {
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('analysisModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
}

function openModal(content) {
  document.getElementById('modalBody').innerHTML = content;
  document.getElementById('analysisModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('analysisModal').classList.remove('active');
  document.body.style.overflow = '';
}

// ===== DASHBOARD PAGE =====
function renderDashboard() {
  const el = document.getElementById('page-dashboard');
  el.innerHTML = `
    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon red">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div class="stat-number">247</div>
        <div class="stat-label">Documents Analyzed</div>
        <div class="stat-change up">↑ 12% from last month</div>
      </div>
      <div class="stat-card success">
        <div class="stat-icon green">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div class="stat-number">89%</div>
        <div class="stat-label">Compliance Rate</div>
        <div class="stat-change up">↑ 3% improvement</div>
      </div>
      <div class="stat-card warning">
        <div class="stat-icon orange">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div class="stat-number">18</div>
        <div class="stat-label">Issues Detected</div>
        <div class="stat-change down">↑ 5 more than last week</div>
      </div>
      <div class="stat-card info">
        <div class="stat-icon blue">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="stat-number">2.4s</div>
        <div class="stat-label">Avg. Analysis Time</div>
        <div class="stat-change up">↓ 0.8s faster</div>
      </div>
    </div>

    <!-- Dashboard Grid -->
    <div class="dashboard-grid">
      <!-- Recent Analyses -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Recent Document Analyses</span>
          <a href="#" class="card-action" id="viewAllAnalyses">View all →</a>
        </div>
        <div class="card-body" style="padding: 0;">
          <table class="analysis-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Status</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${generateRecentAnalysisRows()}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column -->
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Compliance Breakdown -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Compliance by Standard</span>
          </div>
          <div class="card-body">
            <div class="compliance-list">
              <div class="compliance-item">
                <div class="compliance-info">
                  <div class="compliance-dot high"></div>
                  <span class="compliance-name">UCP 600</span>
                </div>
                <span class="compliance-count">94%</span>
              </div>
              <div class="compliance-item">
                <div class="compliance-info">
                  <div class="compliance-dot high"></div>
                  <span class="compliance-name">ISBP 745</span>
                </div>
                <span class="compliance-count">91%</span>
              </div>
              <div class="compliance-item">
                <div class="compliance-info">
                  <div class="compliance-dot medium"></div>
                  <span class="compliance-name">Incoterms® 2020</span>
                </div>
                <span class="compliance-count">85%</span>
              </div>
              <div class="compliance-item">
                <div class="compliance-info">
                  <div class="compliance-dot medium"></div>
                  <span class="compliance-name">eUCP v2.0</span>
                </div>
                <span class="compliance-count">82%</span>
              </div>
              <div class="compliance-item">
                <div class="compliance-info">
                  <div class="compliance-dot low"></div>
                  <span class="compliance-name">URR 725</span>
                </div>
                <span class="compliance-count">76%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Feed -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Recent Activity</span>
          </div>
          <div class="card-body">
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-dot-wrapper"><div class="activity-dot"></div></div>
                <div class="activity-content">
                  <div class="activity-text"><strong>Invoice #INV-2026-0847</strong> analyzed — 3 discrepancies found</div>
                  <div class="activity-time">12 minutes ago</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-dot-wrapper"><div class="activity-dot" style="background: var(--success);"></div></div>
                <div class="activity-content">
                  <div class="activity-text"><strong>L/C #LC-4521</strong> passed all UCP 600 checks</div>
                  <div class="activity-time">1 hour ago</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-dot-wrapper"><div class="activity-dot" style="background: var(--warning);"></div></div>
                <div class="activity-content">
                  <div class="activity-text"><strong>Bill of Lading #BL-9923</strong> — missing consignee details</div>
                  <div class="activity-time">3 hours ago</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-dot-wrapper"><div class="activity-dot" style="background: var(--success);"></div></div>
                <div class="activity-content">
                  <div class="activity-text"><strong>Certificate of Origin</strong> verified against ICC standards</div>
                  <div class="activity-time">5 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Wire up view all link
  document.getElementById('viewAllAnalyses')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('history');
  });
}

function generateRecentAnalysisRows() {
  const docs = [
    { name: 'Commercial_Invoice_March2026.pdf', sub: 'ABC Trading Co.', type: 'Invoice', ext: 'pdf', status: 'compliant', statusText: 'Compliant', score: 96, date: 'Mar 27, 2026' },
    { name: 'LC_Amended_No4521.pdf', sub: 'HSBC Bank Ltd', type: 'Letter of Credit', ext: 'pdf', status: 'issues', statusText: '3 Issues', score: 74, date: 'Mar 26, 2026' },
    { name: 'Bill_of_Lading_SH2841.docx', sub: 'Maersk Shipping', type: 'Bill of Lading', ext: 'doc', status: 'compliant', statusText: 'Compliant', score: 92, date: 'Mar 25, 2026' },
    { name: 'Certificate_Origin_EX091.pdf', sub: 'Chamber of Commerce', type: 'Certificate', ext: 'pdf', status: 'non-compliant', statusText: 'Non-Compliant', score: 45, date: 'Mar 24, 2026' },
    { name: 'Insurance_Policy_IP2026.xlsx', sub: 'Lloyd\'s of London', type: 'Insurance Doc', ext: 'xls', status: 'compliant', statusText: 'Compliant', score: 98, date: 'Mar 23, 2026' },
  ];

  return docs.map(d => `
    <tr>
      <td>
        <div class="doc-name">
          <div class="doc-icon ${d.ext}">${d.ext.toUpperCase()}</div>
          <div class="doc-info">
            <span>${d.name}</span>
            <span>${d.sub}</span>
          </div>
        </div>
      </td>
      <td style="font-size: 12px; color: var(--gray-600);">${d.type}</td>
      <td>
        <span class="status-badge ${d.status}">
          <span class="status-dot"></span>
          ${d.statusText}
        </span>
      </td>
      <td>
        <strong style="font-size: 14px; color: ${d.score >= 80 ? 'var(--success)' : d.score >= 60 ? 'var(--warning)' : 'var(--error)'};">${d.score}%</strong>
      </td>
      <td style="font-size: 12px; color: var(--gray-500);">${d.date}</td>
    </tr>
  `).join('');
}

// ===== UPLOAD PAGE =====
function renderUpload() {
  const el = document.getElementById('page-upload');
  el.innerHTML = `
    <div class="upload-section">
      <div class="upload-hero">
        <h2>Analyze Your Trade Documents</h2>
        <p>Upload invoices, letters of credit, bills of lading, and other trade documents for comprehensive compliance analysis.</p>
      </div>

      <!-- Upload Zone -->
      <div class="upload-zone" id="uploadZone">
        <div class="upload-zone-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </div>
        <h3>Drop files here or click to browse</h3>
        <p>Upload your trade documents for analysis</p>
        <p class="file-types">Supported: PDF, DOCX, DOC, XLSX, XLS, PNG, JPG, TIFF</p>
        <input type="file" id="fileInput" multiple accept=".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg,.tiff,.tif" />
      </div>

      <!-- Uploaded Files -->
      <div class="uploaded-files" id="uploadedFilesList"></div>

      <!-- Document Type Selector -->
      <div class="doc-type-section">
        <h3>Select Document Type</h3>
        <div class="doc-type-grid">
          ${generateDocTypeCards()}
        </div>
      </div>

      <!-- Standards Selection -->
      <div class="standards-selector">
        <h3>Apply Standards & Rules</h3>
        <div class="standards-grid">
          ${generateStandardChips()}
        </div>
      </div>

      <!-- Analyze Button -->
      <div class="analyze-section" id="analyzeSection" style="display: none;">
        <div class="analyze-info">
          <h4>Ready to Analyze</h4>
          <p id="analyzeDescription">Upload documents and select type to begin analysis</p>
        </div>
        <button class="btn-primary" id="analyzeBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          RUN ANALYSIS
        </button>
      </div>
    </div>
  `;

  initUploadHandlers();
}

function generateDocTypeCards() {
  const types = [
    { id: 'invoice', icon: '🧾', name: 'Commercial Invoice', desc: 'Standard trade invoices' },
    { id: 'lc', icon: '🏦', name: 'Letter of Credit', desc: 'L/C, SBLC documents' },
    { id: 'bol', icon: '🚢', name: 'Bill of Lading', desc: 'B/L shipping documents' },
    { id: 'coo', icon: '📋', name: 'Certificate of Origin', desc: 'Origin certificates' },
    { id: 'insurance', icon: '🛡️', name: 'Insurance Document', desc: 'Marine & cargo insurance' },
    { id: 'other', icon: '📄', name: 'Other Document', desc: 'Any trade document' },
  ];

  return types.map(t => `
    <div class="doc-type-card" data-type="${t.id}">
      <div class="type-icon">${t.icon}</div>
      <div class="type-name">${t.name}</div>
      <div class="type-desc">${t.desc}</div>
    </div>
  `).join('');
}

function generateStandardChips() {
  const standards = [
    { id: 'ucp600', name: 'UCP 600', desc: 'Uniform Customs & Practice for Documentary Credits' },
    { id: 'isbp745', name: 'ISBP 745', desc: 'International Standard Banking Practice' },
    { id: 'incoterms2020', name: 'Incoterms® 2020', desc: 'International Commercial Terms' },
    { id: 'eucp', name: 'eUCP v2.0', desc: 'Electronic UCP Supplement' },
    { id: 'urr725', name: 'URR 725', desc: 'Uniform Rules for Reimbursements' },
    { id: 'isp98', name: 'ISP98', desc: 'International Standby Practices' },
    { id: 'urdg758', name: 'URDG 758', desc: 'Uniform Rules for Demand Guarantees' },
    { id: 'urc522', name: 'URC 522', desc: 'Uniform Rules for Collections' },
  ];

  return standards.map(s => `
    <div class="standard-chip ${state.selectedStandards.includes(s.id) ? 'selected' : ''}" data-standard="${s.id}">
      <div class="standard-checkbox">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="standard-info">
        <div class="standard-name">${s.name}</div>
        <div class="standard-desc">${s.desc}</div>
      </div>
    </div>
  `).join('');
}

function initUploadHandlers() {
  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fileInput');

  // Drag and Drop
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });

  // File input change
  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });

  // Doc type selection
  document.querySelectorAll('.doc-type-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.doc-type-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.selectedDocType = card.dataset.type;
      updateAnalyzeSection();
    });
  });

  // Standard selection
  document.querySelectorAll('.standard-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      const std = chip.dataset.standard;
      if (state.selectedStandards.includes(std)) {
        state.selectedStandards = state.selectedStandards.filter(s => s !== std);
      } else {
        state.selectedStandards.push(std);
      }
    });
  });
}

function handleFiles(fileList) {
  const files = Array.from(fileList);
  files.forEach(file => {
    if (!state.uploadedFiles.find(f => f.name === file.name)) {
      state.uploadedFiles.push(file);
    }
  });
  renderUploadedFiles();
  updateAnalyzeSection();
}

function renderUploadedFiles() {
  const list = document.getElementById('uploadedFilesList');
  if (!list) return;

  if (state.uploadedFiles.length === 0) {
    list.innerHTML = '';
    return;
  }

  list.innerHTML = state.uploadedFiles.map((file, index) => {
    const ext = file.name.split('.').pop().toLowerCase();
    const sizeStr = formatFileSize(file.size);
    return `
      <div class="uploaded-file">
        <div class="file-icon-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div class="file-details">
          <div class="file-name">${file.name}</div>
          <div class="file-meta">
            <span>${sizeStr}</span>
            <span>${ext.toUpperCase()}</span>
          </div>
        </div>
        <div class="file-actions">
          <button class="file-action-btn delete" data-index="${index}" title="Remove file">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Wire up delete buttons
  list.querySelectorAll('.file-action-btn.delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      state.uploadedFiles.splice(index, 1);
      renderUploadedFiles();
      updateAnalyzeSection();
    });
  });
}

function updateAnalyzeSection() {
  const section = document.getElementById('analyzeSection');
  const desc = document.getElementById('analyzeDescription');
  const btn = document.getElementById('analyzeBtn');

  if (!section) return;

  if (state.uploadedFiles.length > 0) {
    section.style.display = 'flex';
    desc.textContent = `${state.uploadedFiles.length} file(s) ready • ${state.selectedDocType ? getDocTypeName(state.selectedDocType) : 'Select document type'} • ${state.selectedStandards.length} standard(s) selected`;

    if (btn) {
      btn.onclick = () => runAnalysis();
    }
  } else {
    section.style.display = 'none';
  }
}

function getDocTypeName(id) {
  const names = {
    invoice: 'Commercial Invoice',
    lc: 'Letter of Credit',
    bol: 'Bill of Lading',
    coo: 'Certificate of Origin',
    insurance: 'Insurance Document',
    other: 'Other Document',
  };
  return names[id] || 'Document';
}

// ===== ANALYSIS ENGINE =====
async function runAnalysis() {
  if (!state.apiKey) {
    alert("⚠️ No Google Gemini API key found! \n\nPlease go to Settings and add your API key for real AI analysis. We will run a SIMULATED analysis for now.");
  }

  const processingOverlay = createProcessingOverlay();
  document.body.appendChild(processingOverlay);

  let results;
  const isRealAI = state.apiKey && state.uploadedFiles.length > 0;

  if (isRealAI) {
    try {
      // Setup progress animation for real AI
      const stepEls = processingOverlay.querySelectorAll('.processing-step');
      stepEls[0].classList.add('active'); // Parsing document
      
      // Get base64 data of the first uploaded file
      const file = state.uploadedFiles[0];
      const base64Data = await fileToBase64(file);
      
      stepEls[0].classList.remove('active');
      stepEls[0].classList.add('done');
      stepEls[0].querySelector('.processing-step-icon').innerHTML = '✓';
      
      stepEls[1].classList.add('active'); // Extracting & AI Analysis
      
      // Call Gemini API
      results = await analyzeWithGemini(file, base64Data, state.selectedDocType, state.selectedStandards);
      
      // Mark remaining steps as done quickly
      for (let i = 1; i < stepEls.length; i++) {
        stepEls[i].classList.remove('active');
        stepEls[i].classList.add('done');
        stepEls[i].querySelector('.processing-step-icon').innerHTML = '✓';
        await delay(200);
      }
    } catch (error) {
      console.error("AI Analysis Error:", error);
      alert("AI Analysis failed: " + error.message + "\n\nFalling back to simulated analysis.");
      results = generateAnalysisResults(); // Fallback
    }
  } else {
    // Simulated animation
    const steps = [
      'Parsing document content...',
      'Extracting key fields & data...',
      'Validating format & structure...',
      'Checking against selected standards...',
      'Computing compliance score...',
      'Generating detailed report...',
    ];

    for (let i = 0; i < steps.length; i++) {
      await delay(600 + Math.random() * 400);
      const stepEls = processingOverlay.querySelectorAll('.processing-step');
      if (i > 0) {
        stepEls[i - 1].classList.remove('active');
        stepEls[i - 1].classList.add('done');
        stepEls[i - 1].querySelector('.processing-step-icon').innerHTML = '✓';
      }
      stepEls[i].classList.add('active');
    }

    await delay(800);
    const lastStep = processingOverlay.querySelectorAll('.processing-step');
    lastStep[steps.length - 1].classList.remove('active');
    lastStep[steps.length - 1].classList.add('done');
    lastStep[steps.length - 1].querySelector('.processing-step-icon').innerHTML = '✓';
    
    results = generateAnalysisResults(); // Simulated results
  }


  await delay(400);
  document.body.removeChild(processingOverlay);

  // Generate and show results
  showAnalysisResults(results);

  // Add to history
  state.uploadedFiles.forEach(file => {
    state.analysisHistory.unshift({
      id: Date.now() + Math.random(),
      name: file.name,
      type: state.selectedDocType || 'other',
      score: results.overallScore,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      standards: [...state.selectedStandards],
      status: results.overallScore >= 80 ? 'compliant' : results.overallScore >= 60 ? 'issues' : 'non-compliant',
    });
  });

  // Clear uploaded files
  state.uploadedFiles = [];
  renderUploadedFiles();
  updateAnalyzeSection();
}

function createProcessingOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'processing-overlay active';
  overlay.innerHTML = `
    <div class="processing-spinner"></div>
    <div class="processing-text">
      <h3>Analyzing Documents</h3>
      <p>Running compliance checks against selected international standards</p>
      <div class="processing-steps">
        <div class="processing-step"><div class="processing-step-icon"></div> Parsing document content...</div>
        <div class="processing-step"><div class="processing-step-icon"></div> Extracting key fields & data...</div>
        <div class="processing-step"><div class="processing-step-icon"></div> Validating format & structure...</div>
        <div class="processing-step"><div class="processing-step-icon"></div> Checking against selected standards...</div>
        <div class="processing-step"><div class="processing-step-icon"></div> Computing compliance score...</div>
        <div class="processing-step"><div class="processing-step-icon"></div> Generating detailed report...</div>
      </div>
    </div>
  `;
  return overlay;
}

// ===== REAL AI INTEGRATION (GEMINI) =====
async function analyzeWithGemini(file, base64Data, docType, standards) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${state.apiKey}`;
  
  // Clean base64 string
  const base64DataClean = base64Data.split(',')[1];
  
  // Standard names for the prompt
  const standardNames = standards.map(s => {
    const map = { ucp600: 'UCP 600', isbp745: 'ISBP 745', incoterms2020: 'Incoterms 2020', eucp: 'eUCP', urr725: 'URR 725' };
    return map[s] || s;
  }).join(', ');
  
  const docTypeName = getDocTypeName(docType);

  const prompt = `
You are an expert Senior Trade Finance Bank Analyst. Analyze the attached ${docTypeName} against the following international standards: ${standardNames}.

Your task is to identify if the document complies with these standards, finding any discrepancies, errors, or missing information.
Return the output EXACTLY in this JSON format without any markdown blocks or extra text:

{
  "overallScore": number (0-100),
  "checks": [
    {
      "name": "Short name of the check (e.g. 'Invoice Number', 'Date of Issue')",
      "detail": "Detailed explanation of what you found or verified in the document",
      "status": "pass" | "fail" | "warn",
      "standard": "Standard Reference (e.g. 'UCP 600 Art. 18' or 'ISBP 745')"
    }
  ]
}

Ensure there are between 6 to 10 checks. Be extremely strict and realistic.
  `;

  const requestBody = {
    contents: [{
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: file.type || 'application/pdf',
            data: base64DataClean
          }
        }
      ]
    }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json"
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  let textResponse = data.candidates[0].content.parts[0].text;
  
  try {
    // Strip markdown formatting if Gemini adds it
    textResponse = textResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(textResponse);
    
    // Calculate counts
    const passCount = parsedData.checks.filter(c => c.status === 'pass').length;
    const failCount = parsedData.checks.filter(c => c.status === 'fail').length;
    const warnCount = parsedData.checks.filter(c => c.status === 'warn').length;
    
    return {
      checks: parsedData.checks,
      overallScore: parsedData.overallScore,
      passCount,
      failCount,
      warnCount,
      total: parsedData.checks.length,
      docType: docType || 'other'
    };
  } catch (e) {
    throw new Error("Failed to parse AI response as JSON.");
  }
}

function generateAnalysisResults() {
  const docType = state.selectedDocType || 'invoice';

  const checksMap = {
    invoice: [
      { name: 'Invoice Number Format', detail: 'Invoice number is present and follows standard format', status: 'pass', standard: 'ISBP 745' },
      { name: 'Date of Invoice', detail: 'Invoice date is present and not later than the transport document date', status: 'pass', standard: 'UCP 600 Art. 18' },
      { name: 'Description of Goods', detail: 'Description corresponds with that appearing in the credit', status: 'pass', standard: 'UCP 600 Art. 18(c)' },
      { name: 'Currency & Amount', detail: 'Currency and amount match the terms of the credit', status: 'pass', standard: 'UCP 600 Art. 18(a)' },
      { name: 'Beneficiary Name & Address', detail: 'Beneficiary details must match the credit exactly', status: 'warn', standard: 'ISBP 745 Para. C1-C4' },
      { name: 'Applicant Details', detail: 'Applicant name and address should match credit terms', status: 'pass', standard: 'UCP 600 Art. 14(j)' },
      { name: 'Trade Terms (Incoterms)', detail: 'Incoterms rule stated but port of delivery missing', status: 'fail', standard: 'Incoterms® 2020' },
      { name: 'Arithmetic Consistency', detail: 'Unit prices × quantities match total amounts', status: 'pass', standard: 'ISBP 745 Para. C7' },
      { name: 'Country of Origin', detail: 'Country of origin declared where required', status: 'pass', standard: 'ICC Guidelines' },
      { name: 'Signature Verification', detail: 'Document appears to be signed by the beneficiary', status: 'pass', standard: 'UCP 600 Art. 18(a)' },
    ],
    lc: [
      { name: 'LC Number & Type', detail: 'Letter of Credit number and irrevocable type identified', status: 'pass', standard: 'UCP 600 Art. 2' },
      { name: 'Issuing Bank Details', detail: 'Issuing bank SWIFT/BIC code verified', status: 'pass', standard: 'UCP 600 Art. 2' },
      { name: 'Expiry Date & Place', detail: 'Credit expiry date and place of expiry are clearly stated', status: 'pass', standard: 'UCP 600 Art. 6' },
      { name: 'Amount & Currency', detail: 'Maximum credit amount and currency specified', status: 'pass', standard: 'UCP 600 Art. 18' },
      { name: 'Document Present Period', detail: 'Presentation period within 21 calendar days of shipment', status: 'warn', standard: 'UCP 600 Art. 14(c)' },
      { name: 'Partial Shipments', detail: 'Partial shipments clause present and clearly defined', status: 'pass', standard: 'UCP 600 Art. 31' },
      { name: 'Transhipment Clause', detail: 'Transhipment permission or prohibition stated', status: 'fail', standard: 'UCP 600 Art. 31' },
      { name: 'Required Documents List', detail: 'All required documents specified in the credit', status: 'pass', standard: 'UCP 600 Art. 14' },
      { name: 'Confirming Bank', detail: 'Confirmation instructions present', status: 'pass', standard: 'UCP 600 Art. 8' },
      { name: 'Availability Terms', detail: 'Available by sight payment / deferred / acceptance / negotiation', status: 'pass', standard: 'UCP 600 Art. 6(b)' },
    ],
    bol: [
      { name: 'Carrier Identification', detail: 'Carrier name and identity clearly stated on the B/L', status: 'pass', standard: 'UCP 600 Art. 20' },
      { name: 'On Board Notation', detail: '"Shipped on Board" notation present with date', status: 'pass', standard: 'UCP 600 Art. 20(a)(ii)' },
      { name: 'Port of Loading', detail: 'Port of loading matches credit requirements', status: 'pass', standard: 'UCP 600 Art. 20(a)(iii)' },
      { name: 'Port of Discharge', detail: 'Port of discharge specified and matches credit', status: 'warn', standard: 'UCP 600 Art. 20(a)(iii)' },
      { name: 'Clean B/L Status', detail: 'No superimposed clauses declaring defective goods', status: 'pass', standard: 'UCP 600 Art. 27' },
      { name: 'Consignee Details', detail: 'Consignee/To Order notation as per credit terms', status: 'fail', standard: 'ISBP 745 Para. E1' },
      { name: 'Notify Party', detail: 'Notify party details present and match credit', status: 'pass', standard: 'ISBP 745' },
      { name: 'Full Set Original', detail: 'Full set of originals (3/3) presented', status: 'pass', standard: 'UCP 600 Art. 20(a)(iv)' },
    ],
    coo: [
      { name: 'Issuing Authority', detail: 'Certificate issued by recognized Chamber of Commerce', status: 'pass', standard: 'ICC Guidelines' },
      { name: 'Country of Origin', detail: 'Country of origin clearly stated and matches goods', status: 'pass', standard: 'ICC Guidelines' },
      { name: 'Goods Description', detail: 'Description of goods matches the credit/invoice', status: 'warn', standard: 'UCP 600 Art. 14(e)' },
      { name: 'Authentication', detail: 'Document signed, stamped, and dated by authority', status: 'pass', standard: 'ISBP 745' },
      { name: 'Beneficiary Details', detail: 'Exporter details match other documents', status: 'pass', standard: 'ISBP 745' },
      { name: 'HS Code Verification', detail: 'Harmonized System codes present and valid', status: 'fail', standard: 'WCO Guidelines' },
    ],
    insurance: [
      { name: 'Coverage Type', detail: 'Marine cargo insurance or similar identified', status: 'pass', standard: 'UCP 600 Art. 28' },
      { name: 'Coverage Amount', detail: 'Minimum 110% of CIF/CIP value as per credit', status: 'pass', standard: 'UCP 600 Art. 28(f)' },
      { name: 'Risk Coverage', detail: 'All risks covered as stipulated in credit', status: 'pass', standard: 'UCP 600 Art. 28(g)' },
      { name: 'Effective Date', detail: 'Insurance effective date not later than shipping date', status: 'warn', standard: 'UCP 600 Art. 28(e)' },
      { name: 'Currency Match', detail: 'Insurance currency matches credit currency', status: 'pass', standard: 'UCP 600 Art. 28(f)' },
    ],
    other: [
      { name: 'Document Authentication', detail: 'Document appears genuine and properly signed', status: 'pass', standard: 'General' },
      { name: 'Data Consistency', detail: 'Key data fields are internally consistent', status: 'pass', standard: 'ISBP 745' },
      { name: 'Formatting Standards', detail: 'Document follows standard formatting practices', status: 'warn', standard: 'General' },
      { name: 'Required Fields', detail: 'Essential information fields are present', status: 'pass', standard: 'General' },
    ],
  };

  const checks = checksMap[docType] || checksMap.other;
  const passCount = checks.filter(c => c.status === 'pass').length;
  const failCount = checks.filter(c => c.status === 'fail').length;
  const warnCount = checks.filter(c => c.status === 'warn').length;
  const total = checks.length;
  const overallScore = Math.round(((passCount * 1 + warnCount * 0.5) / total) * 100);

  return {
    checks,
    overallScore,
    passCount,
    failCount,
    warnCount,
    total,
    docType,
  };
}

function showAnalysisResults(results) {
  const content = `
    <div class="result-overview">
      <div class="result-metric green">
        <div class="metric-value">${results.overallScore}%</div>
        <div class="metric-label">Overall Compliance Score</div>
      </div>
      <div class="result-metric ${results.failCount > 0 ? 'red' : 'green'}">
        <div class="metric-value">${results.passCount}/${results.total}</div>
        <div class="metric-label">Checks Passed</div>
      </div>
      <div class="result-metric ${results.failCount > 0 ? 'orange' : 'green'}">
        <div class="metric-value">${results.failCount + results.warnCount}</div>
        <div class="metric-label">Issues Found</div>
      </div>
    </div>

    <div class="result-section">
      <h4>Detailed Compliance Checks — ${getDocTypeName(results.docType)}</h4>
      ${results.checks.map(check => `
        <div class="result-item">
          <div class="result-icon ${check.status}">
            ${check.status === 'pass' ? '✓' : check.status === 'fail' ? '✕' : '!'}
          </div>
          <div class="result-text">
            <div class="check-name">${check.name} <span style="font-size: 10px; color: var(--gray-400); font-weight: 400; margin-left: 8px;">${check.standard}</span></div>
            <div class="check-detail">${check.detail}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <div style="display: flex; gap: 12px; margin-top: 20px;">
      <button class="btn-primary" onclick="window.print()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        EXPORT REPORT
      </button>
      <button class="btn-secondary" id="closeResultsBtn">CLOSE</button>
    </div>
  `;

  openModal(content);

  document.getElementById('closeResultsBtn')?.addEventListener('click', closeModal);
}

// ===== HISTORY PAGE =====
function renderHistory() {
  const el = document.getElementById('page-history');
  el.innerHTML = `
    <div class="history-header">
      <div>
        <h2 style="font-family: var(--font-display); font-size: 22px; font-weight: 700; margin-bottom: 4px;">Analysis History</h2>
        <p style="font-size: 13px; color: var(--gray-500);">${state.analysisHistory.length} documents analyzed</p>
      </div>
      <div class="history-filters">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="compliant">Compliant</button>
        <button class="filter-btn" data-filter="issues">Issues</button>
        <button class="filter-btn" data-filter="non-compliant">Non-Compliant</button>
      </div>
    </div>

    <div class="history-list" id="historyList">
      ${renderHistoryCards(state.analysisHistory)}
    </div>
  `;

  // Filter buttons
  el.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const filtered = filter === 'all'
        ? state.analysisHistory
        : state.analysisHistory.filter(h => h.status === filter);
      document.getElementById('historyList').innerHTML = renderHistoryCards(filtered);
    });
  });
}

function renderHistoryCards(items) {
  if (items.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <h3>No documents found</h3>
        <p>No analysis records match the selected filter.</p>
      </div>
    `;
  }

  return items.map(item => {
    const scoreClass = item.score >= 80 ? 'high' : item.score >= 60 ? 'medium' : 'low';
    const standardTags = (item.standards || []).map(s => {
      const tagMap = { ucp600: 'ucp', isbp745: 'isbp', incoterms2020: 'incoterms', eucp: 'icc', urr725: 'icc', isp98: 'isbp', urdg758: 'icc', urc522: 'icc' };
      const nameMap = { ucp600: 'UCP 600', isbp745: 'ISBP 745', incoterms2020: 'Incoterms', eucp: 'eUCP', urr725: 'URR 725', isp98: 'ISP98', urdg758: 'URDG 758', urc522: 'URC 522' };
      return `<span class="history-tag ${tagMap[s] || 'icc'}">${nameMap[s] || s}</span>`;
    }).join('');

    return `
      <div class="history-card" data-id="${item.id}">
        <div class="history-score ${scoreClass}">${item.score}%</div>
        <div class="history-details">
          <div class="history-doc-name">${item.name}</div>
          <div class="history-doc-meta">
            <span>${getDocTypeName(item.type)}</span>
            <span>${item.date}</span>
            <span class="status-badge ${item.status}"><span class="status-dot"></span> ${item.status === 'compliant' ? 'Compliant' : item.status === 'issues' ? 'Issues Found' : 'Non-Compliant'}</span>
          </div>
          <div class="history-tags">${standardTags}</div>
        </div>
        <div class="history-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
    `;
  }).join('');
}

// ===== STANDARDS PAGE =====
function renderStandards() {
  const el = document.getElementById('page-standards');
  el.innerHTML = `
    <div class="standards-hero">
      <h2>International Trade Standards</h2>
      <p>Comprehensive reference guide for the international rules, standards, and practices used in documentary trade finance analysis.</p>
    </div>

    <div class="standards-cards">
      <div class="standard-card">
        <div class="standard-card-header">
          <div class="standard-card-icon red">🏛️</div>
          <div>
            <h3>UCP 600</h3>
            <span class="standard-version">ICC Publication No. 600 • Revision 2007</span>
          </div>
        </div>
        <p>The Uniform Customs and Practice for Documentary Credits is the most widely used set of rules governing letters of credit. Covering 39 articles, UCP 600 provides a framework for banks and parties involved in documentary credit transactions worldwide.</p>
        <div class="standard-card-tags">
          <span class="std-tag">Letters of Credit</span>
          <span class="std-tag">Documentary Credits</span>
          <span class="std-tag">Issuing Banks</span>
          <span class="std-tag">Nominated Banks</span>
        </div>
      </div>

      <div class="standard-card">
        <div class="standard-card-header">
          <div class="standard-card-icon blue">📐</div>
          <div>
            <h3>ISBP 745</h3>
            <span class="standard-version">ICC Publication No. 745 • Edition 2013</span>
          </div>
        </div>
        <p>International Standard Banking Practice for Examination of Documents under UCP 600. ISBP 745 explains how the practices articulated in UCP 600 are applied by banking practitioners, addressing common document examination issues.</p>
        <div class="standard-card-tags">
          <span class="std-tag">Document Examination</span>
          <span class="std-tag">Banking Practice</span>
          <span class="std-tag">Drafts</span>
          <span class="std-tag">Commercial Invoices</span>
        </div>
      </div>

      <div class="standard-card">
        <div class="standard-card-header">
          <div class="standard-card-icon green">🌐</div>
          <div>
            <h3>Incoterms® 2020</h3>
            <span class="standard-version">ICC Publication No. 723E • Effective Jan 2020</span>
          </div>
        </div>
        <p>International Commercial Terms define the responsibilities of sellers and buyers for the delivery of goods. The 11 Incoterms® 2020 rules cover costs, risks, and obligations related to transportation, insurance, and customs clearance.</p>
        <div class="standard-card-tags">
          <span class="std-tag">EXW</span>
          <span class="std-tag">FOB</span>
          <span class="std-tag">CIF</span>
          <span class="std-tag">DDP</span>
          <span class="std-tag">FCA</span>
          <span class="std-tag">DAP</span>
        </div>
      </div>

      <div class="standard-card">
        <div class="standard-card-header">
          <div class="standard-card-icon orange">💻</div>
          <div>
            <h3>eUCP v2.0</h3>
            <span class="standard-version">Supplement to UCP 600 • Revision 2019</span>
          </div>
        </div>
        <p>The electronic supplement to UCP 600 provides rules for the presentation of electronic records, either alone or in combination with paper documents. It accommodates evolving electronic trade document practices.</p>
        <div class="standard-card-tags">
          <span class="std-tag">Electronic Records</span>
          <span class="std-tag">Digital Trade</span>
          <span class="std-tag">ePresentations</span>
        </div>
      </div>

      <div class="standard-card">
        <div class="standard-card-header">
          <div class="standard-card-icon blue">🔄</div>
          <div>
            <h3>URR 725</h3>
            <span class="standard-version">ICC Publication No. 725 • Revision 2008</span>
          </div>
        </div>
        <p>The Uniform Rules for Bank-to-Bank Reimbursements under Documentary Credits standardize the reimbursement process between an issuing bank, reimbursing bank, and claiming bank in documentary credit transactions.</p>
        <div class="standard-card-tags">
          <span class="std-tag">Bank Reimbursement</span>
          <span class="std-tag">Claiming Bank</span>
          <span class="std-tag">Reimbursing Bank</span>
        </div>
      </div>

      <div class="standard-card">
        <div class="standard-card-header">
          <div class="standard-card-icon red">🛡️</div>
          <div>
            <h3>ISP98</h3>
            <span class="standard-version">ICC Publication No. 590 • Effective 1999</span>
          </div>
        </div>
        <p>The International Standby Practices reflect the practical experience gained from standby letters of credit. ISP98 covers the rights and obligations of issuers, beneficiaries, and other stakeholders in standby credit transactions.</p>
        <div class="standard-card-tags">
          <span class="std-tag">Standby L/C</span>
          <span class="std-tag">Demand for Payment</span>
          <span class="std-tag">Presentation Rules</span>
        </div>
      </div>

      <div class="standard-card">
        <div class="standard-card-header">
          <div class="standard-card-icon green">📜</div>
          <div>
            <h3>URDG 758</h3>
            <span class="standard-version">ICC Publication No. 758 • Effective 2010</span>
          </div>
        </div>
        <p>Uniform Rules for Demand Guarantees provide a comprehensive set of rules governing demand guarantees and counter-guarantees. Used globally for independent guarantees in international trade and project finance.</p>
        <div class="standard-card-tags">
          <span class="std-tag">Demand Guarantees</span>
          <span class="std-tag">Counter-guarantees</span>
          <span class="std-tag">Amendments</span>
        </div>
      </div>

      <div class="standard-card">
        <div class="standard-card-header">
          <div class="standard-card-icon orange">📮</div>
          <div>
            <h3>URC 522</h3>
            <span class="standard-version">ICC Publication No. 522 • Revision 1995</span>
          </div>
        </div>
        <p>Uniform Rules for Collections provide rules governing the collection process where banks act as intermediaries to obtain payment or acceptance. Covers clean and documentary collections in international trade.</p>
        <div class="standard-card-tags">
          <span class="std-tag">Documentary Collections</span>
          <span class="std-tag">D/P</span>
          <span class="std-tag">D/A</span>
          <span class="std-tag">Remitting Bank</span>
        </div>
      </div>
    </div>
  `;
}

// ===== SETTINGS PAGE =====
function renderSettings() {
  const el = document.getElementById('page-settings');
  el.innerHTML = `
    <div class="settings-section">
      <div class="settings-group">
        <div class="settings-group-header">
          <h3>AI Configuration</h3>
          <p>Connect to Google Gemini API for real document analysis</p>
        </div>
        <div class="settings-row">
          <div style="width: 100%;">
            <div class="settings-label">Google Gemini API Key</div>
            <div class="settings-desc">Get your free key from <a href="https://aistudio.google.com" target="_blank" style="color: var(--primary);">aistudio.google.com</a></div>
            <input type="password" id="settingApiKey" class="settings-input" placeholder="AIzaSy..." value="${state.apiKey}" style="width: 100%; max-width: 400px; padding: 10px; border: 1px solid var(--gray-300); border-radius: 4px; margin-top: 8px; font-family: monospace;" />
            <button id="saveApiKeyBtn" class="btn-primary" style="margin-top: 8px; padding: 8px 16px;">Save Key</button>
            <span id="apiKeySaveStatus" style="font-size: 13px; color: var(--success); margin-left: 12px; display: none;">Saved!</span>
          </div>
        </div>
      </div>

      <div class="settings-group">
        <div class="settings-group-header">
          <h3>Analysis Preferences</h3>
          <p>Configure how documents are analyzed against standards</p>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-label">Auto-detect Document Type</div>
            <div class="settings-desc">Automatically identify document type from content</div>
          </div>
          <label class="toggle">
            <input type="checkbox" checked id="settingAutoDetect" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-label">Strict Mode Analysis</div>
            <div class="settings-desc">Apply stricter interpretation of standard rules</div>
          </div>
          <label class="toggle">
            <input type="checkbox" id="settingStrictMode" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-label">Include Recommendations</div>
            <div class="settings-desc">Provide actionable suggestions for non-compliant items</div>
          </div>
          <label class="toggle">
            <input type="checkbox" checked id="settingRecommendations" />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div class="settings-group">
        <div class="settings-group-header">
          <h3>Default Standards</h3>
          <p>Set which standards are selected by default for new analyses</p>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-label">Primary Standard</div>
            <div class="settings-desc">Default standard used for analysis</div>
          </div>
          <select class="settings-select" id="settingPrimaryStandard">
            <option value="ucp600">UCP 600</option>
            <option value="isbp745">ISBP 745</option>
            <option value="incoterms2020">Incoterms® 2020</option>
            <option value="eucp">eUCP v2.0</option>
          </select>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-label">Secondary Standard</div>
            <div class="settings-desc">Additional standard applied alongside primary</div>
          </div>
          <select class="settings-select" id="settingSecondaryStandard">
            <option value="isbp745">ISBP 745</option>
            <option value="ucp600">UCP 600</option>
            <option value="incoterms2020">Incoterms® 2020</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>

      <div class="settings-group">
        <div class="settings-group-header">
          <h3>Export & Reporting</h3>
          <p>Configure report generation and export options</p>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-label">Report Format</div>
            <div class="settings-desc">Default export format for analysis reports</div>
          </div>
          <select class="settings-select" id="settingReportFormat">
            <option value="pdf">PDF Report</option>
            <option value="xlsx">Excel Spreadsheet</option>
            <option value="json">JSON Data</option>
          </select>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-label">Include Cover Page</div>
            <div class="settings-desc">Add a branded cover page to exported reports</div>
          </div>
          <label class="toggle">
            <input type="checkbox" checked id="settingCoverPage" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-label">Auto-save Reports</div>
            <div class="settings-desc">Automatically save analysis reports to history</div>
          </div>
          <label class="toggle">
            <input type="checkbox" checked id="settingAutoSave" />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div class="settings-group">
        <div class="settings-group-header">
          <h3>Notifications</h3>
          <p>Configure notification preferences</p>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-label">Analysis Complete</div>
            <div class="settings-desc">Notify when document analysis finishes</div>
          </div>
          <label class="toggle">
            <input type="checkbox" checked id="settingNotifyComplete" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-label">Non-Compliance Alerts</div>
            <div class="settings-desc">Alert when critical compliance issues are detected</div>
          </div>
          <label class="toggle">
            <input type="checkbox" checked id="settingNotifyAlerts" />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
      </div>
    </div>
  `;

  // Attach API Key save handler
  setTimeout(() => {
    const saveBtn = document.getElementById('saveApiKeyBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const key = document.getElementById('settingApiKey').value.trim();
        state.apiKey = key;
        localStorage.setItem('trade_doc_api_key', key);
        
        const status = document.getElementById('apiKeySaveStatus');
        status.style.display = 'inline-block';
        setTimeout(() => { status.style.display = 'none'; }, 2000);
      });
    }
  }, 0);
}

// ===== SAMPLE DATA =====
function generateSampleHistory() {
  return [
    {
      id: 1, name: 'Commercial_Invoice_March2026.pdf', type: 'invoice', score: 96,
      date: 'Mar 27, 2026', standards: ['ucp600', 'isbp745'], status: 'compliant',
    },
    {
      id: 2, name: 'LC_Amended_No4521.pdf', type: 'lc', score: 74,
      date: 'Mar 26, 2026', standards: ['ucp600', 'isbp745', 'eucp'], status: 'issues',
    },
    {
      id: 3, name: 'Bill_of_Lading_SH2841.docx', type: 'bol', score: 92,
      date: 'Mar 25, 2026', standards: ['ucp600', 'incoterms2020'], status: 'compliant',
    },
    {
      id: 4, name: 'Certificate_Origin_EX091.pdf', type: 'coo', score: 45,
      date: 'Mar 24, 2026', standards: ['ucp600', 'isbp745'], status: 'non-compliant',
    },
    {
      id: 5, name: 'Insurance_Policy_IP2026.xlsx', type: 'insurance', score: 98,
      date: 'Mar 23, 2026', standards: ['ucp600'], status: 'compliant',
    },
    {
      id: 6, name: 'Proforma_Invoice_PI8847.pdf', type: 'invoice', score: 88,
      date: 'Mar 22, 2026', standards: ['isbp745', 'incoterms2020'], status: 'compliant',
    },
    {
      id: 7, name: 'LC_Draft_DBK_2026_03.pdf', type: 'lc', score: 52,
      date: 'Mar 21, 2026', standards: ['ucp600', 'isbp745', 'isp98'], status: 'non-compliant',
    },
    {
      id: 8, name: 'Packing_List_PL_4410.pdf', type: 'other', score: 91,
      date: 'Mar 20, 2026', standards: ['isbp745'], status: 'compliant',
    },
  ];
}

// ===== UTILITIES =====
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
