/* ==========================================================================
   1. NAVIGASI SIDEBAR — scroll ke section + highlight menu aktif
   ========================================================================== */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.main-content > section');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('data-target');
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Tutup sidebar otomatis setelah memilih menu (khusus tampilan HP)
    closeSidebar();
  });
});

// Menandai menu aktif sesuai section yang sedang terlihat di layar
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-target') === id);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' }); // aktif saat section berada di area tengah layar

sections.forEach(section => sectionObserver.observe(section));

/* ==========================================================================
   2. HAMBURGER MENU — buka/tutup sidebar di tampilan mobile
   ========================================================================== */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function openSidebar() {
  sidebar.classList.add('is-open');
  sidebarOverlay.classList.add('is-visible');
  hamburgerBtn.classList.add('is-open');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
}

function closeSidebar() {
  sidebar.classList.remove('is-open');
  sidebarOverlay.classList.remove('is-visible');
  hamburgerBtn.classList.remove('is-open');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
}

hamburgerBtn.addEventListener('click', () => {
  const isOpen = sidebar.classList.contains('is-open');
  isOpen ? closeSidebar() : openSidebar();
});

sidebarOverlay.addEventListener('click', closeSidebar);

/* ==========================================================================
   3. TAB TOGGLE — "Materi Lanjut" vs "Kuis"
   Hanya salah satu panel yang tampil dalam satu waktu.
   ========================================================================== */
const btnMateriLanjut = document.getElementById('btnMateriLanjut');
const btnKuis = document.getElementById('btnKuis');
const panelMateriLanjut = document.getElementById('panelMateriLanjut');
const panelKuis = document.getElementById('panelKuis');

function showPanel(panelToShow) {
  const isMateri = panelToShow === 'materi';

  panelMateriLanjut.classList.toggle('hidden', !isMateri);
  panelKuis.classList.toggle('hidden', isMateri);

  btnMateriLanjut.classList.toggle('active', isMateri);
  btnKuis.classList.toggle('active', !isMateri);

  btnMateriLanjut.setAttribute('aria-selected', String(isMateri));
  btnKuis.setAttribute('aria-selected', String(!isMateri));
}

btnMateriLanjut.addEventListener('click', () => showPanel('materi'));
btnKuis.addEventListener('click', () => showPanel('kuis'));

/* ==========================================================================
   4. KUIS INTERAKTIF
   GANTI/TAMBAH soal di array quizData berikut. Setiap soal butuh:
   - question   : teks pertanyaan
   - options    : daftar pilihan jawaban (array string)
   - answerIndex: index jawaban benar pada array options (mulai dari 0)
   ========================================================================== */
const quizData = [
  {
    question: '1. Gerbang logika apa yang menghasilkan keluaran 1 hanya jika SEMUA masukannya bernilai 1?',
    options: ['OR', 'AND', 'NOT', 'XOR'],
    answerIndex: 1
  },
  {
    question: '2. Gerbang NOT memiliki berapa jumlah input?',
    options: ['1', '2', '3', 'Tidak terbatas'],
    answerIndex: 0
  },
  {
    question: '3. Gerbang apa yang merupakan kebalikan (invers) dari gerbang OR?',
    options: ['NAND', 'AND', 'NOR', 'XOR'],
    answerIndex: 2
  }
];

const quizContainer = document.getElementById('quizContainer');
const btnCekJawaban = document.getElementById('btnCekJawaban');
const quizResult = document.getElementById('quizResult');

// Membuat elemen HTML untuk setiap soal secara dinamis
function renderQuiz() {
  quizContainer.innerHTML = '';

  quizData.forEach((item, qIndex) => {
    const questionEl = document.createElement('div');
    questionEl.className = 'quiz-question';
    questionEl.dataset.qIndex = qIndex;

    const questionText = document.createElement('p');
    questionText.className = 'question-text';
    questionText.textContent = item.question;
    questionEl.appendChild(questionText);

    const optionsWrap = document.createElement('div');
    optionsWrap.className = 'quiz-options';

    item.options.forEach((optionText, oIndex) => {
      const label = document.createElement('label');
      label.className = 'quiz-option';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `question-${qIndex}`;
      radio.value = oIndex;

      label.appendChild(radio);
      label.appendChild(document.createTextNode(optionText));
      optionsWrap.appendChild(label);
    });

    questionEl.appendChild(optionsWrap);
    quizContainer.appendChild(questionEl);
  });
}

// Mengecek jawaban pengguna, menandai benar/salah, dan menghitung skor
function checkAnswers() {
  let score = 0;

  quizData.forEach((item, qIndex) => {
    const questionEl = quizContainer.querySelector(`[data-q-index="${qIndex}"]`) ||
      quizContainer.children[qIndex];
    const selected = questionEl.querySelector(`input[name="question-${qIndex}"]:checked`);
    const optionLabels = questionEl.querySelectorAll('.quiz-option');

    // Bersihkan status sebelumnya
    optionLabels.forEach(label => label.classList.remove('correct', 'incorrect'));

    // Tandai opsi yang benar
    optionLabels[item.answerIndex].classList.add('correct');

    if (selected) {
      const selectedIndex = parseInt(selected.value, 10);
      if (selectedIndex === item.answerIndex) {
        score++;
      } else {
        optionLabels[selectedIndex].classList.add('incorrect');
      }
    }
  });

  const total = quizData.length;
  quizResult.textContent = `Skor kamu: ${score} dari ${total} benar.`;
}

btnCekJawaban.addEventListener('click', checkAnswers);

// Render soal kuis saat halaman pertama kali dimuat
renderQuiz();
