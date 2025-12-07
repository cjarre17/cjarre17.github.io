/* 
==========================================================================
Project: Nginx overview site
Name: Caleb Jarrell
File: quiz.js
Purpose: Logic for the interactive quiz questions and scoring
========================================================================== 
*/

(function () {
  /* -----------------------------------------------------------------------------
     QUIZ DATA
     Array of question objects
  ----------------------------------------------------------------------------- */
  const questions = [
    {
      type: 'text',
      question: 'Nginx was originally designed to solve the ______ problem, handling 10,000 concurrent connections on a single server.',
      correctText: "C10k"
    },
    {
      type: 'single',
      question: 'Which best describes Nginx\'s core processing model?',
      options: [
        'One thread per connection with blocking I/O',
        'A single monolithic process that handles all tasks sequentially',
        'A master process managing event-driven worker processes using non-blocking I/O',
        'GPU-accelerated pipeline that assigns a CUDA core per request'
      ],
      correctIndex: 2
    },
    {
      type: 'single',
      question: 'By default, how many worker processes does Nginx create?',
      options: [
        'One total, regardless of hardware',
        'One per active connection',
        'One per CPU core',
        'Two per hardware thread'
      ],
      correctIndex: 2
    },
    {
      type: "single",
      question: "Which task is commonly offloaded to an Nginx reverse proxy to reduce app-server load?",
      options: [
        "Database indexing",
        "Session storage",
        "Image rendering on the client",
        "SSL/TLS termination"
      ],
      correctIndex: 3
    },

    // --- New examples ---
    {
      type: 'multi', // checkboxes (need all correct, no extras)
      question: 'Which capabilities are provided by Nginx as a reverse proxy? (SELECT ALL THAT APPLY)',
      options: [
        'Load balancing and automatic failover', 
        'Caching frequently requested content', 
        'Request routing and URL rewriting', 
        'Compression/optimization of responses', 
        'Long-term storage of user passwords',
        'Hiding backend servers from the public internet (“security through obscurity”)',
        'Acting as an API gateway that routes to multiple services'
      ],
      correctIndices: [0, 1, 2, 3, 5, 6]
    },
    {
      type: 'text', // fill-in-the-blank
      question: 'When was NGINX first publicly released?',
      // Accept any of these (case/spacing-insensitive)
      correctText: ['2004', 'in 2004', 'march 2004', 'march, 2004']
    }
  ];

  /* -----------------------------------------------------------------------------
     STATE MANAGEMENT
     Current index and answer tracking
  ----------------------------------------------------------------------------- */
  let questionIndex = 0;
  let quizComplete = false;
  const answers = new Array(questions.length).fill(null);

  /* -----------------------------------------------------------------------------
     DOM ELEMENTS
     References to UI components
  ----------------------------------------------------------------------------- */
  const questionNum = document.getElementById('question-num');
  const questionEl  = document.getElementById('question');
  const quizForm    = document.getElementById('quiz-form');
  const optionsEl   = document.getElementById('options');
  const resultEl    = document.getElementById('result');
  const quizCard    = document.getElementById('quiz-container');

  const prevBtn   = document.getElementById('previous-button');
  const nextBtn   = document.getElementById('next-button');
  const submitBtn = document.getElementById('submit-button');
  const restartBtn  = document.getElementById('quiz-restart-button');
  const restartIcon = document.getElementById('quiz-restart-icon');


  /* -----------------------------------------------------------------------------
     HELPER FUNCTIONS
     Utility logic for comparisons and formatting
  ----------------------------------------------------------------------------- */
  function norm(s) {
    return String(s ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  }
  function setsEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    const A = new Set(a), B = new Set(b);
    if (A.size !== B.size) return false;
    for (const v of A) if (!B.has(v)) return false;
    return true;
  }
  function isAnswered(q, ans) {
    if (q.type === 'text')  return typeof ans === 'string' && norm(ans) !== '';
    if (q.type === 'multi') return Array.isArray(ans) && ans.length > 0;
    return ans !== null && ans !== undefined;
  }

  function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

  function scoreQuestion(q, ans) {
    // Score single choice
    if (q.type === 'single') {
      return ans === q.correctIndex ? 1 : 0;
    }
    // Score multiple choice (all correct options must be selected)
    if (q.type === 'multi') {
      return setsEqual(ans || [], q.correctIndices || []) ? 1 : 0;
    }
    // Score text input (fuzzy match)
    if (q.type === 'text') {
      const accepts = Array.isArray(q.correctText) ? q.correctText : [q.correctText];
      return accepts.some(acc => norm(ans) === norm(acc)) ? 1 : 0;
    }
    return 0;
  }

  /* -----------------------------------------------------------------------------
     RENDER LOGIC
     Updates the UI based on current state
  ----------------------------------------------------------------------------- */
  function renderQuestion() {
    const q = questions[questionIndex];

    // Update question text and number
    questionNum.textContent = `Question ${questionIndex + 1} of ${questions.length}`;
    questionEl.textContent  = q.question;

    if (q.type === 'text') {
      // Render text input
      const current = typeof answers[questionIndex] === 'string' ? answers[questionIndex] : '';
      optionsEl.innerHTML = `
        <label class="option">
          <input class="answer-text" placeholder="Enter your answer" type="text" name="answerText" value="${current.replace(/"/g, '&quot;')}" autocomplete="off" required>
        </label>
      `;
    } else {
      // Build option inputs (radio for single, checkbox for multi)
      const isMulti = q.type === 'multi';
      optionsEl.innerHTML = q.options
        .map((text, i) => {
          const name = 'answer';
          const type = isMulti ? 'checkbox' : 'radio';
          const saved = answers[questionIndex];
          // Check if option was previously selected
          const checked = isMulti
            ? (Array.isArray(saved) && saved.includes(i) ? 'checked' : '')
            : (saved === i ? 'checked' : '');
          return `
            <label class="option">
              <input type="${type}" name="${name}" value="${i}" ${checked} ${isMulti ? '' : 'required'}>
              <div class="option-container"><p>${text}</p></div>
            </label>
          `;
        })
        .join('');
    }

    updateNavState();
  }

  function selectedIndex() {
    const checked = quizForm.querySelector('input[name="answer"]:checked');
    return checked ? Number(checked.value) : null;
  }

  function saveCurrentAnswer() {
    const q = questions[questionIndex];
    if (q.type === 'text') {
      const input = quizForm.querySelector('input[name="answerText"]');
      answers[questionIndex] = input ? input.value : '';
      return;
    }
    if (q.type === 'multi') {
      const checked = Array.from(quizForm.querySelectorAll('input[name="answer"]:checked'));
      answers[questionIndex] = checked.map(el => Number(el.value));
      return;
    }
    // single
    answers[questionIndex] = selectedIndex();
  }

  function updateNavState() {
    const q = questions[questionIndex];
    const hasAnswer = isAnswered(q, answers[questionIndex]);
    const theme = getTheme();

    // Disable previous button on first question
    prevBtn.disabled = (questionIndex === 0);

    const last = questionIndex === questions.length - 1;
    // Show/hide Next/Submit buttons based on position
    nextBtn.style.display   = last ? 'none' : 'inline-block';
    submitBtn.style.display = last ? 'inline-block' : 'none';

    // Enable Next/Submit only if question is answered
    nextBtn.disabled   = !hasAnswer && !last;
    submitBtn.disabled = !hasAnswer &&  last;

  if (restartBtn) restartBtn.style.display = 'none';

  // If quiz is finished, swap to the restart button
  if (quizComplete) {
    // Hide navigation buttons
    prevBtn.style.display   = 'none';
    nextBtn.style.display   = 'none';
    submitBtn.style.display = 'none';

    // Show restart button with correct theme icon
    if (restartBtn) restartBtn.style.display = 'inline-flex';
    if (restartIcon) {
      restartIcon.src = theme === 'light'
        ? '/icons/restart_icon_light.png'
        : '/icons/restart_icon_dark.png';
    }
    return; // we're done updating nav here
  }
  }

  /* -----------------------------------------------------------------------------
     EVENT LISTENERS
     User interaction handling
  ----------------------------------------------------------------------------- */
  quizForm.addEventListener('change', (e) => {
    if (!e.target) return;
    saveCurrentAnswer();
    updateNavState();
  });

  // For text input, update as the user types
  optionsEl.addEventListener('input', (e) => {
    if (!e.target) return;
    saveCurrentAnswer();
    updateNavState();
  });

  prevBtn.addEventListener('click', () => {
    saveCurrentAnswer();
    if (questionIndex > 0) {
      questionIndex -= 1;
      renderQuestion();
    }
  });

  nextBtn.addEventListener('click', () => {
    saveCurrentAnswer();
    const q = questions[questionIndex];
    if (!isAnswered(q, answers[questionIndex])) return; // guard
    if (questionIndex < questions.length - 1) {
      questionIndex += 1;
      renderQuestion();
    }
  });

  // Compute score; show result
  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveCurrentAnswer();

    const last = questionIndex === questions.length - 1;
    if (!last) return; // avoid accidental Enter-submit mid-quiz

    // Calculate total score
    const correctCount = questions.reduce((sum, q, i) => sum + scoreQuestion(q, answers[i]), 0);
    const totalQuestions = questions.length;

    const percent = Math.round((correctCount / totalQuestions) * 100);
    const passed  = correctCount / totalQuestions >= 0.7; // 70%+ = Pass
    const statusText  = passed ? 'Pass' : 'Fail';
    const statusClass = passed ? 'quiz-pass' : 'quiz-fail';

    // Build a simple results table
    const resultsHTML = questions.map((q, i) => {
      const ans = answers[i];
      let yourAnswer = '';
      let correctAnswer = '';

      if (q.type === 'single') {
        yourAnswer   = (ans != null) ? q.options[ans] : '(no answer)';
        correctAnswer = q.options[q.correctIndex];
      } else if (q.type === 'multi') {
        const your = Array.isArray(ans) ? ans.map(j => q.options[j]) : [];
        const corr = (q.correctIndices || []).map(j => q.options[j]);
        yourAnswer   = your.length ? your.join(', ') : '(no answer)';
        correctAnswer = corr.join(', ');
      } else if (q.type === 'text') {
        yourAnswer   = (ans && ans !== '') ? ans : '(no answer)';
        const accepts = Array.isArray(q.correctText) ? q.correctText : [q.correctText];
        correctAnswer = accepts.join('  |  ');
      }

      const isCorrect = scoreQuestion(q, ans) === 1;
      const correctnessLabel = isCorrect ? 'Correct ' : 'Incorrect';
      const correctnessClass = isCorrect ? 'correct-label' : 'incorrect-label'
      
      return `
        <li class="results-bubbles-styling">
          <h3 class="result-question-heading">
            Q${i + 1} -
            <span class="${correctnessClass}">${correctnessLabel}</span>${isCorrect ? '✅' : ' ❌'}
          </h3>
          <p class="result-question-text">${q.question}</p>
          <em>Your answer:</em> ${yourAnswer}<br>
          <strong>Correct:</strong> ${correctAnswer}
          
        </li>
      `;
    }).join('');

    // Display results container
    resultEl.hidden = false;
    resultEl.innerHTML = `
    <div class="quiz-result-header">
      <h2 class="body-title">Result - <span class="quiz-result-status ${statusClass}">${statusText}</span>${passed ? '✅' : ' ❌'}</h2>

      <p style="text-align: center"><strong>You scored ${correctCount} out of ${questions.length}.</strong></p>
      <ul class="results-styling">${resultsHTML}</ul>
    `;

    // Hide the question UI but keep the card visible
    questionNum.style.display = 'none';
    questionEl.style.display   = 'none';
    quizForm.style.display     = 'none';

    // Lock buttons after finishing
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    submitBtn.disabled = true;
    quizComplete = true;
    updateNavState();
  });

    restartBtn.addEventListener('click', () => {
    // reset state
    quizComplete = false;
    questionIndex = 0;
    answers.fill(null);

    // restore the question UI
    resultEl.hidden = true;
    resultEl.innerHTML = '';
    questionNum.style.display = '';
    questionEl.style.display  = '';
    quizForm.style.display    = '';

    // show normal nav again
    prevBtn.style.display   = 'inline-block';
    nextBtn.style.display   = 'inline-block';
    submitBtn.style.display = 'none';      // first question isn't last
    restartBtn.style.display = 'none';

    renderQuestion(); // re-renders and calls updateNavState()
  });


  // First render
  renderQuestion();
})();
