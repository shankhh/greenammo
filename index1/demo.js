// CMS Simulated State Database (Hydrates preview & REST API Sandbox)
const cmsData = {
  heroTitle: "Empowering People.<br>Enabling Progress.<br><span class=\"text-gradient\">Enriching Planet.</span>",
  heroDesc: "GREENAMMO Group bridges impact and innovation — empowering individuals, communities, and enterprises to build a smarter, inclusive, and sustainable future.",
  stats: {
    states: "10+",
    hours: "500k+",
    projects: "100+",
    partners: "500+"
  },
  currentTheme: 'group', // 'group', 'solutions', 'trust'
  currentProjectState: 'meghalaya',
  projects: {
    meghalaya: {
      title: "Shillong Waste & Youth Action",
      description: "Our initiatives in Meghalaya center on environmental action and youth collaboration in Shillong, working alongside the Shillong Municipal Board and the State Pollution Control Board.",
      location: "East Khasi Hills, Shillong",
      coordinates: "25.5788° N, 91.8933° E",
      milestones: [
        { year: "2021", desc: "Collaborated with Shillong Municipal Board for waste audit." },
        { year: "2022", desc: "State Pollution Control Board alliance finalized for recycling drives." },
        { year: "2023", desc: "Launched youth clean-up events in local schools & colleges." },
        { year: "2024", desc: "Empowered 12 local communities with decentralized composting kits." }
      ]
    },
    assam: {
      title: "Guwahati Clean Operations",
      description: "Focusing on urban waste stream diversion and local awareness campaigns in coordination with municipal committees in Assam.",
      location: "Kamrup Metropolitan, Guwahati",
      coordinates: "26.1445° N, 91.7362° E",
      milestones: [
        { year: "2022", desc: "Set up our first waste collection hub in Guwahati." },
        { year: "2023", desc: "Organized public awareness seminars on segregating wet vs dry waste." },
        { year: "2024", desc: "Swachh Bharat partner coordination for river bank cleanups." }
      ]
    },
    goa: {
      title: "Coastal Waste Management & Tourism Hub",
      description: "Working to establish circular economy infrastructure across tourist hotspots and beach destinations in North & South Goa.",
      location: "North Goa Coast, Goa",
      coordinates: "15.2993° N, 74.1240° E",
      milestones: [
        { year: "2021", desc: "Pioneered hotel and guest house sorting partnerships." },
        { year: "2023", desc: "Launched beach collection bins with local beach shacks." },
        { year: "2024", desc: "Educated over 5,000 tourists on responsible waste management." }
      ]
    },
    "tamil-nadu": {
      title: "Southern Ecological Action",
      description: "Implementing rural community programs for waste management and ecological preservation in collaboration with youth clubs in Tamil Nadu.",
      location: "Chennai Suburbs, Tamil Nadu",
      coordinates: "13.0827° N, 80.2707° E",
      milestones: [
        { year: "2022", desc: "Conducted initial waste audits in 5 village panchayats." },
        { year: "2023", desc: "Partnered with local colleges to install source-sorting models." },
        { year: "2024", desc: "Built organic waste processing units servicing 300+ households." }
      ]
    },
    "west-bengal": {
      title: "Kolkata Waste Audits & Community Hubs",
      description: "Initiating community-driven audits, recycling networks, and plastic collection campaigns across central and suburban Bengal.",
      location: "Howrah & Kolkata, West Bengal",
      coordinates: "22.5726° N, 88.3639° E",
      milestones: [
        { year: "2021", desc: "Launched dynamic waste audits in urban residential blocks." },
        { year: "2023", desc: "Expanded sorting collection to 15 apartment associations." },
        { year: "2024", desc: "Pioneered single-use plastic buy-back campaigns." }
      ]
    }
  }
};

// Theme configurations (color mappings)
const themes = {
  group: {
    primary: '#4CAF50', // Mint Green
    accent: '#9FD8E4', // Soft blue
    label: 'Group Portal',
    heroTitle: "Empowering People.<br>Enabling Progress.<br><span class=\"text-gradient\">Enriching Planet.</span>",
    heroDesc: "GREENAMMO Group bridges impact and innovation — empowering individuals, communities, and enterprises to build a smarter, inclusive, and sustainable future.",
    cta: 'Explore Divisions'
  },
  solutions: {
    primary: '#3B82F6', // Sky Blue
    accent: '#BFDBFE', // Light blue
    label: 'Solutions Division',
    heroTitle: "Future-Ready Skills.<br>Scalable Operations.<br><span class=\"text-gradient\">Enterprise Growth.</span>",
    heroDesc: "GREENAMMO Solutions delivers professional, tech-enabled services spanning Finance, Education, Event supply, and Accommodations to drive social & business outcomes together.",
    cta: 'View Services'
  },
  trust: {
    primary: '#7C966A', // Earth Green
    accent: '#D2E3AB', // Sage highlight
    label: 'Trust Division',
    heroTitle: "Climate Action.<br>Women Empowerment.<br><span class=\"text-gradient\">Grounded Change.</span>",
    heroDesc: "GREENAMMO Trust conducts grassroots non-profit campaigns, educational programs, and audits to restore local ecological balance and foster community ownership.",
    cta: 'Support Us'
  }
};

// Testimonials data
const testimonials = [
  { quote: "GREENAMMO is one of the only organizations built from a concept to an entity without compromising on ethics.", name: "Navjot", loc: "Meghalaya" },
  { quote: "They don’t treat clean-ups as events, but as systems that need time, trust, and follow-through.", name: "Hiranyak", loc: "Kolkata" },
  { quote: "GREENAMMO brings structure without imposing control. Communities retain ownership of both the problem and the solution.", name: "Francis", loc: "Goa" }
];

let activeTestimonialIndex = 0;

// Initialize elements
document.addEventListener('DOMContentLoaded', () => {
  setupCmsInputs();
  bindEventHandlers();
  setTheme('group');
  setProjectState('meghalaya');
  startTestimonialSlider();
  renderCmsMilestonesRepeater();
});

// Setup CMS input values with initial state data
function setupCmsInputs() {
  document.getElementById('input-hero-title').value = cmsData.heroTitle;
  document.getElementById('input-hero-desc').value = cmsData.heroDesc;
  document.getElementById('input-stat-states').value = cmsData.stats.states;
  document.getElementById('input-stat-hours').value = cmsData.stats.hours;
  document.getElementById('input-stat-projects').value = cmsData.stats.projects;
  document.getElementById('input-stat-partners').value = cmsData.stats.partners;
}

// Bind change events to sync from right (CMS Admin) to left (Website Preview)
function bindEventHandlers() {
  // Real-time customizer inputs
  document.getElementById('input-hero-title').addEventListener('input', (e) => {
    cmsData.heroTitle = e.target.value;
    updatePreviewHero();
  });

  document.getElementById('input-hero-desc').addEventListener('input', (e) => {
    cmsData.heroDesc = e.target.value;
    updatePreviewHero();
  });

  document.getElementById('input-stat-states').addEventListener('input', (e) => {
    cmsData.stats.states = e.target.value;
    document.getElementById('cms-stat-states').textContent = e.target.value;
  });

  document.getElementById('input-stat-hours').addEventListener('input', (e) => {
    cmsData.stats.hours = e.target.value;
    document.getElementById('cms-stat-hours').textContent = e.target.value;
  });

  document.getElementById('input-stat-projects').addEventListener('input', (e) => {
    cmsData.stats.projects = e.target.value;
    document.getElementById('cms-stat-projects').textContent = e.target.value;
  });

  document.getElementById('input-stat-partners').addEventListener('input', (e) => {
    cmsData.stats.partners = e.target.value;
    document.getElementById('cms-stat-partners').textContent = e.target.value;
  });

  // State Selector Tab Click handlers
  document.querySelectorAll('.state-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      // Remove active from all tabs
      document.querySelectorAll('.state-tab').forEach(btn => btn.classList.remove('active-tab'));
      e.target.classList.add('active-tab');
      
      const stateKey = e.target.dataset.state;
      setProjectState(stateKey);
    });
  });

  // Staging simulator save button click
  const saveBtn = document.getElementById('btn-save-draft');
  const spinner = document.getElementById('save-spinner');
  
  saveBtn.addEventListener('click', () => {
    saveBtn.disabled = true;
    spinner.classList.remove('hidden');
    saveBtn.classList.add('opacity-80');
    
    setTimeout(() => {
      saveBtn.disabled = false;
      spinner.classList.add('hidden');
      saveBtn.classList.remove('opacity-80');
      
      // Dynamic Toast alert injection
      const toast = document.createElement('div');
      toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm shadow-2xl transition-all duration-500 translate-y-[-20px] opacity-0 z-[100]';
      toast.innerHTML = '✨ Changes saved successfully to WordPress DB!';
      document.body.appendChild(toast);
      
      // trigger reflow
      void toast.offsetHeight;
      
      toast.classList.remove('translate-y-[-20px]', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
      
      setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-[-20px]', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
      }, 2500);

    }, 1200);
  });

  // Floating Toggle Button for Mobile CMS Simulator view
  const mobileToggle = document.getElementById('cms-mobile-toggle');
  const cmsPanel = document.getElementById('cms-panel');
  
  mobileToggle.addEventListener('click', () => {
    cmsPanel.classList.toggle('hidden');
    if (cmsPanel.classList.contains('hidden')) {
      mobileToggle.classList.remove('bg-rose-600');
      mobileToggle.classList.add('bg-sky-600');
      mobileToggle.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>`;
    } else {
      mobileToggle.classList.remove('bg-sky-600');
      mobileToggle.classList.add('bg-rose-600');
      mobileToggle.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
    }
  });
  
  // Set initial state for panel hidden/visible based on screen sizes
  if (window.innerWidth < 1024) {
    cmsPanel.classList.add('hidden');
  }
}

// Update the preview's hero text immediately
function updatePreviewHero() {
  document.getElementById('cms-hero-title').innerHTML = cmsData.heroTitle;
  document.getElementById('cms-hero-desc').textContent = cmsData.heroDesc;
}

// Global theme swapper state controller
window.setTheme = function(themeName) {
  const theme = themes[themeName];
  if (!theme) return;
  
  cmsData.currentTheme = themeName;
  
  // 1. Swap CSS variables to transition colors site-wide
  const previewDiv = document.getElementById('website-preview');
  previewDiv.style.setProperty('--theme-primary', theme.primary);
  previewDiv.style.setProperty('--theme-accent', theme.accent);
  
  // 2. Update Nav labels & badges
  document.getElementById('theme-label').textContent = `${themeName.charAt(0).toUpperCase() + themeName.slice(1)} portal`;
  document.getElementById('nav-subtitle').textContent = theme.label;
  document.getElementById('preview-cta').textContent = theme.cta;
  
  // 3. Update active state of portal buttons
  ['group', 'solutions', 'trust'].forEach(name => {
    const btn = document.getElementById(`btn-theme-${name}`);
    if (name === themeName) {
      btn.classList.add('active-theme');
      btn.classList.remove('text-slate-400');
    } else {
      btn.classList.remove('active-theme');
      btn.classList.add('text-slate-400');
    }
  });
  
  // 4. Update the content variables in CMS panel input to match active theme defaults
  cmsData.heroTitle = theme.heroTitle;
  cmsData.heroDesc = theme.heroDesc;
  setupCmsInputs();
  updatePreviewHero();
};

// Trust State Project Selector logic
window.setProjectState = function(stateKey) {
  const project = cmsData.projects[stateKey];
  if (!project) return;
  
  cmsData.currentProjectState = stateKey;
  
  // 1. Update Left Side Preview DOM Elements
  document.getElementById('project-title').textContent = project.title;
  document.getElementById('project-description').textContent = project.description;
  document.getElementById('project-location').textContent = project.location;
  document.getElementById('project-coordinates').textContent = project.coordinates;
  document.getElementById('project-state-badge').textContent = `${stateKey.replace('-', ' ')} project`;
  
  // 2. Render milestones timeline in preview
  const milestoneTimeline = document.getElementById('project-milestones');
  milestoneTimeline.innerHTML = '';
  
  project.milestones.forEach(m => {
    const row = document.createElement('div');
    row.className = 'flex items-start gap-4 animate-fade-up';
    row.innerHTML = `
      <span class="text-xs font-mono font-bold text-theme-primary bg-theme-primary/10 px-2 py-0.5 rounded border border-theme-primary/20 shrink-0 mt-0.5">${m.year}</span>
      <p class="text-xs text-slate-300 leading-normal">${m.desc}</p>
    `;
    milestoneTimeline.appendChild(row);
  });

  // 3. If the CMS panel is on the projects tab, re-render fields
  renderCmsMilestonesRepeater();
  
  // 4. Update JSON Schema presentation
  renderJsonSchema();
};

// Render CPT Edit fields on the CMS Panel (Right side)
function renderCmsMilestonesRepeater() {
  const container = document.getElementById('cms-milestones-repeater');
  if (!container) return;
  
  const stateKey = cmsData.currentProjectState;
  const project = cmsData.projects[stateKey];
  
  document.getElementById('cms-project-editing-title').textContent = stateKey.charAt(0).toUpperCase() + stateKey.slice(1).replace('-', ' ');
  
  container.innerHTML = '';
  
  project.milestones.forEach((m, idx) => {
    const block = document.createElement('div');
    block.className = 'p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2';
    block.innerHTML = `
      <div class="flex gap-2">
        <input type="text" class="w-16 text-[11px] font-bold bg-slate-950 border border-slate-800 rounded p-1.5 text-center text-theme-primary font-mono" value="${m.year}" data-index="${idx}" data-field="year">
        <textarea class="flex-1 text-[11px] bg-slate-950 border border-slate-800 rounded p-1.5 text-white" rows="2" data-index="${idx}" data-field="desc">${m.desc}</textarea>
      </div>
    `;
    
    // Bind inputs to modify data object directly
    block.querySelector('input').addEventListener('input', (e) => {
      const index = e.target.dataset.index;
      project.milestones[index].year = e.target.value;
      setProjectState(stateKey); // Re-render preview
    });
    
    block.querySelector('textarea').addEventListener('input', (e) => {
      const index = e.target.dataset.index;
      project.milestones[index].desc = e.target.value;
      setProjectState(stateKey); // Re-render preview
    });

    container.appendChild(block);
  });
}

// Generate REST API output block
function renderJsonSchema() {
  const stateKey = cmsData.currentProjectState;
  const project = cmsData.projects[stateKey];
  document.getElementById('api-state-param').textContent = stateKey;
  
  const payload = {
    status: "success",
    timestamp: new Date().toISOString(),
    endpoint: `/wp-json/wp/v2/trust_projects?state=${stateKey}`,
    data: {
      id: Math.floor(Math.random() * 100) + 200,
      post_type: "trust_project",
      post_status: "publish",
      title: project.title,
      acf: {
        state_key: stateKey,
        region_location: project.location,
        geo_coordinates: project.coordinates,
        writeup_description: project.description,
        milestones: project.milestones
      }
    }
  };
  
  document.getElementById('api-json-render').textContent = JSON.stringify(payload, null, 2);
}

// Switch Right Panel Tabs (General, Projects, API Schema)
window.setCmsTab = function(tabName) {
  ['global', 'projects', 'schema'].forEach(tab => {
    const panel = document.getElementById(`cms-fields-${tab}`);
    const btn = document.getElementById(`tab-cms-${tab}`);
    
    if (tab === tabName) {
      panel.classList.remove('hidden');
      btn.classList.add('active-cms-tab');
      btn.classList.remove('text-slate-400');
    } else {
      panel.classList.add('hidden');
      btn.classList.remove('active-cms-tab');
      btn.classList.add('text-slate-400');
    }
  });
};

// Copy API schema payload to clipboard
window.copyApiJson = function() {
  const content = document.getElementById('api-json-render').textContent;
  navigator.clipboard.writeText(content).then(() => {
    // Show copy confirmation
    const btn = document.querySelector('[onclick="copyApiJson()"]');
    btn.textContent = 'Copied!';
    btn.classList.remove('bg-slate-800');
    btn.classList.add('bg-emerald-600', 'text-slate-950');
    
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('bg-emerald-600', 'text-slate-950');
      btn.classList.add('bg-slate-800');
    }, 1500);
  });
};

// Testimonials Rotation controller
window.setTestimonial = function(index) {
  activeTestimonialIndex = index;
  const t = testimonials[index];
  
  const card = document.getElementById('testimonial-card');
  card.style.opacity = '0';
  card.style.transform = 'translateY(8px)';
  
  setTimeout(() => {
    document.getElementById('testimonial-quote').textContent = `"${t.quote}"`;
    document.getElementById('testimonial-name').textContent = t.name;
    document.getElementById('testimonial-loc').textContent = t.loc;
    
    // Update dots
    const dots = document.querySelectorAll('.t-dot');
    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('bg-theme-accent');
        dot.classList.remove('bg-white/20');
      } else {
        dot.classList.remove('bg-theme-accent');
        dot.classList.add('bg-white/20');
      }
    });
    
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, 350);
};

function startTestimonialSlider() {
  setInterval(() => {
    const nextIdx = (activeTestimonialIndex + 1) % testimonials.length;
    setTestimonial(nextIdx);
  }, 6000);
}
