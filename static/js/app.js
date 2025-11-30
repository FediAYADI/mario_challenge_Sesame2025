const form = document.getElementById('stroke-form');
const loader = document.getElementById('loader');
const predictText = document.getElementById('predict-text');
const resetBtn = document.getElementById('reset-btn');

const riskSummary = document.getElementById('risk-summary');
const riskContent = document.getElementById('risk-content');
const riskBadge = document.getElementById('risk-badge');
const riskBar = document.getElementById('risk-bar');
const riskScoreText = document.getElementById('risk-score-text');
const factorsList = document.getElementById('aggravating-factors');
const suggestionsList = document.getElementById('suggestions');
const factorChips = document.getElementById('factor-chips');
const historyList = document.getElementById('history-list');

let history = [];

// Smooth scroll from hero to platform
const enterBtn = document.getElementById('enter-platform-btn');
const platformSection = document.getElementById('platform');
const marioClimber = document.getElementById('mario-climber');

if (enterBtn && platformSection) {
  enterBtn.addEventListener('click', () => {
    platformSection.scrollIntoView({ behavior: 'smooth' });
  });
}

// Reveal platform content when it comes into view
if (platformSection) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          platformSection.classList.add('app-visible');
          obs.unobserve(platformSection);
        }
      });
    },
    { threshold: 0.25 }
  );
  observer.observe(platformSection);
}

// Mario climber: climb up when scrolling up, down when scrolling down
if (marioClimber) {
  const ladderHeight = 700; // must match CSS body::after height
  const climberSize = 50; // match CSS .mario-climber height
  const maxOffset = ladderHeight - climberSize;
  let currentOffset = 0; // 0 = top of ladder, maxOffset = bottom
  let lastScrollY = window.scrollY || window.pageYOffset;

  const updateClimber = () => {
    // clamp offset to keep Mario on the ladder
    if (currentOffset < 0) currentOffset = 0;
    if (currentOffset > maxOffset) currentOffset = maxOffset;
    // positive translateY moves Mario down from the top-anchored position
    marioClimber.style.transform = `translateY(${currentOffset}px)`;
  };

  window.addEventListener('scroll', () => {
    const y = window.scrollY || window.pageYOffset;
    const delta = y - lastScrollY;
    lastScrollY = y;

    // scroll down (delta>0) => Mario moves down (increase offset)
    // scroll up (delta<0) => Mario moves up (decrease offset)
    const speedFactor = 0.6; // adjust sensitivity of movement
    currentOffset += delta * speedFactor;
    updateClimber();
  });

  // initial position
  updateClimber();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  setLoading(true);

  const payload = getPayloadFromForm();

  try {
    const resp = await fetch('/api/predict-stroke/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      throw new Error('API error');
    }

    const data = await resp.json();
    updateUIWithPrediction(data, payload);
  } catch (err) {
    alert('Error contacting prediction service. Please try again.');
    console.error(err);
  } finally {
    setLoading(false);
  }
});

resetBtn.addEventListener('click', () => {
  form.reset();
});

function setLoading(isLoading) {
  const btn = form.querySelector("button[type='submit']");
  if (isLoading) {
    loader.style.display = 'inline-block';
    predictText.textContent = 'Predicting...';
    btn.disabled = true;
  } else {
    loader.style.display = 'none';
    predictText.textContent = 'Predict Stroke Risk';
    btn.disabled = false;
  }
}

function getPayloadFromForm() {
  const fd = new FormData(form);
  return {
    age: Number(fd.get('age')),
    gender: fd.get('gender'),
    residence_type: fd.get('residence_type'),
    marital_status: fd.get('marital_status'),
    avg_glucose_level: Number(fd.get('avg_glucose_level')),
    bmi: Number(fd.get('bmi')),
    hypertension: Number(fd.get('hypertension')),
    heart_disease: Number(fd.get('heart_disease')),
    smoking_status: fd.get('smoking_status'),
  };
}

function updateUIWithPrediction(data, payload) {
  const {
    risk_level = 'medium',
    risk_score = 0.5,
    aggravating_factors = [],
    suggestions = [],
  } = data;

  riskSummary.classList.add('hidden');
  riskContent.classList.remove('hidden');

  riskBadge.textContent = risk_level.toUpperCase();
  riskBadge.className = 'risk-badge ' + risk_level;

  const pct = Math.round(risk_score * 100);
  riskBar.style.width = pct + '%';
  riskBar.setAttribute('aria-valuenow', pct);
  riskScoreText.textContent = pct + '%';

  factorsList.innerHTML = '';
  aggravating_factors.forEach((f) => {
    const li = document.createElement('li');
    li.textContent = f;
    factorsList.appendChild(li);
  });

  suggestionsList.innerHTML = '';
  suggestions.forEach((s) => {
    const li = document.createElement('li');
    li.textContent = s;
    suggestionsList.appendChild(li);
  });

  buildFactorChips(payload);
  addToHistory(risk_level, pct, payload);
}

function buildFactorChips(payload) {
  factorChips.innerHTML = '';
  const chips = [];

  if (payload.hypertension === 1) chips.push('Hypertension');
  if (payload.heart_disease === 1) chips.push('Heart disease');
  if (payload.bmi >= 30) chips.push('Obese BMI');
  else if (payload.bmi >= 25) chips.push('Overweight BMI');
  if (payload.avg_glucose_level >= 126) chips.push('High glucose');
  if (payload.smoking_status === 'smokes') chips.push('Active smoker');
  if (payload.smoking_status === 'formerly smoked') chips.push('Past smoker');
  if (payload.age >= 65) chips.push('Age ≥ 65');

  chips.forEach((text) => {
    const span = document.createElement('span');
    span.className = 'chip';
    span.textContent = text;
    factorChips.appendChild(span);
  });
}

function addToHistory(risk_level, risk_pct, payload) {
  const entry = {
    timestamp: new Date().toLocaleTimeString(),
    risk_level,
    risk_pct,
    age: payload.age,
    bmi: payload.bmi,
  };
  history.unshift(entry);
  history = history.slice(0, 5);

  historyList.innerHTML = '';
  history.forEach((h) => {
    const li = document.createElement('li');
    li.className = 'history-item';

    const left = document.createElement('div');
    left.className = 'history-label';
    const pill = document.createElement('span');
    pill.className = 'history-pill';
    pill.textContent = h.risk_level.toUpperCase();
    const text = document.createElement('span');
    text.textContent = `Age ${h.age}, BMI ${h.bmi}`;
    left.appendChild(pill);
    left.appendChild(text);

    const right = document.createElement('span');
    right.textContent = `${h.risk_pct}%`;

    li.appendChild(left);
    li.appendChild(right);
    historyList.appendChild(li);
  });
}
