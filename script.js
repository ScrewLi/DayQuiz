// Fonction pour se connecter avec Twitch
function connectWithTwitch() {
  // Remplacer CLIENT_ID par votre propre client ID
  const CLIENT_ID = "bbgt09sz9i3vlwveohg12cicwig2cb";

  // Rediriger l'utilisateur vers l'URL d'autorisation Twitch avec les scopes nécessaires
  window.location.href = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=http://localhost:8000&scope=user:read:email`;
}

// Fonction pour récupérer un token d'accès Twitch à partir de l'URL de redirection
function getAccessTokenFromUrl() {
  // Extraire le token d'accès de l'URL
  const params = new URLSearchParams(window.location.hash.slice(1));
  return params.get("access_token");
}

// Objet de configuration pour les questions et réponses du quiz
const quizConfig = {
  questions: [
    {
      question: "Quel est le plus grand pays du monde en superficie ?",
      answers: [
        { text: "Russie", correct: true },
        { text: "Canada", correct: false },
        { text: "Chine", correct: false },
        { text: "États-Unis", correct: false },
      ],
    },
    {
      question: "Quel est le plus petit pays du monde en superficie ?",
      answers: [
        { text: "Monaco", correct: true },
        { text: "Vatican", correct: false },
        { text: "Nauru", correct: false },
        { text: "Saint-Marin", correct: false },
      ],
    },
    {
      question: "Quel est le plus grand océan du monde ?",
      answers: [
        { text: "Atlantique", correct: false },
        { text: "Arctique", correct: false },
        { text: "Indien", correct: false },
        { text: "Pacifique", correct: true },
      ],
    },
    {
      question: "Quel est le plus grand désert du monde ?",
      answers: [
        { text: "Sahara", correct: true },
        { text: "Arctique", correct: false },
        { text: "Gobi", correct: false },
        { text: "Kalahari", correct: false },
      ],
    },
    {
      question: "Quel est le pays le plus peuplé du monde ?",
      answers: [
        { text: "Chine", correct: true },
        { text: "Inde", correct: false },
        { text: "États-Unis", correct: false },
        { text: "Russie", correct: false },
      ],
    },
    {
      question: "Quelle est la plus grande chaîne de montagnes du monde ?",
      answers: [
        { text: "Himalaya", correct: true },
        { text: "Alpes", correct: false },
        { text: "Andes", correct: false },
        { text: "Rockies", correct: false },
      ],
    },
    {
      question: "Quelle est la plus haute montagne du monde ?",
      answers: [
        { text: "Everest", correct: true },
        { text: "K2", correct: false },
        { text: "Makalu", correct: false },
        { text: "Kilimandjaro", correct: false },
      ],
    },
    {
      question: "Quel est le plus grand lac du monde ?",
      answers: [
        { text: "Caspian", correct: true },
        { text: "Supérieur", correct: false },
        { text: "Baïkal", correct: false },
        { text: "Victoria", correct: false },
      ],
    },
    {
      question: "Quel est le plus grand fleuve du monde ?",
      answers: [
        { text: "Nil", correct: false },
        { text: "Amazone", correct: true },
        { text: "Mississippi", correct: false },
        { text: "Yangtsé", correct: false },
      ],
    },
    {
      question: "Quel est le plus grand animal du monde ?",
      answers: [
        { text: "Baleine bleue", correct: true },
        { text: "Éléphant", correct: false },
        { text: "Girafe", correct: false },
        { text: "Requin blanc", correct: false },
      ],
    },
  ],
  timePerQuestion: 30, // temps en secondes par question
};

let accessToken = null;

// Gérer le clic sur le bouton "Se connecter avec Twitch"
document.getElementById("twitch-btn").addEventListener("click", () => {
  connectWithTwitch();
});

// Vérifier si l'utilisateur vient de se connecter avec Twitch
if (window.location.hash.includes("access_token")) {
  accessToken = getAccessTokenFromUrl();
  // Masquer le bouton "Se connecter avec Twitch" et afficher le bouton "Jouer maintenant"
  document.getElementById("twitch-btn").style.display = "none";
  document.getElementById("play-btn").style.display = "block";
} else {
  // Afficher le bouton "Se connecter avec Twitch" et masquer le bouton "Jouer maintenant"
  document.getElementById("twitch-btn").style.display = "block";
  document.getElementById("play-btn").style.display = "none";
}

// Gérer le clic sur le bouton "Jouer maintenant"
document.getElementById("play-btn").addEventListener("click", () => {
  startQuiz();
});

// Fonction pour démarrer le quizz
function startQuiz() {
  // Masquer le bouton "Jouer maintenant" et afficher le quizz
  document.getElementById("play-btn").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";

  // Initialiser les variables de score et de question
  let score = 0;
  let questionIndex = 0;

  // Afficher la première question
  showQuestion();

  // Fonction pour afficher la question suivante
  function showQuestion() {
    // Vérifier s'il reste des questions dans le quizz
    if (questionIndex >= quizConfig.questions.length) {
      // Afficher le score final et le bouton pour revenir à la page d'accueil
      document.getElementById("quiz-container").innerHTML = `
        <h2>Quiz terminé !</h2>
        <p>Score final : ${score}/${quizConfig.questions.length}</p>
        <button id="home-btn">Revenir à la page d'accueil</button>
      `;
      // Gérer le clic sur le bouton "Revenir à la page d'accueil"
      document.getElementById("home-btn").addEventListener("click", () => {
        window.location.href = "index.html";
      });
      return;
    }

    // Récupérer la question actuelle
    const question = quizConfig.questions[questionIndex];

    // Afficher la question et les réponses
    // Afficher la question et les réponses
    const questionElement = document.getElementById("question");
    questionElement.innerText = question.question;
    const answerElements = document.getElementById("answers");
    answerElements.innerHTML = "";
    for (let i = 0; i < question.answers.length; i++) {
      const answer = question.answers[i];
      const answerElement = document.createElement("button");
      answerElement.innerText = answer.text;
      answerElement.classList.add("answer-btn");
      answerElements.appendChild(answerElement);

      // Gérer le clic sur la réponse
      answerElement.addEventListener("click", () => {
        // Vérifier si la réponse est correcte
        if (answer.correct) {
          score++;
          document.getElementById("score").innerText = `Score : ${score}`;
        }

        // Passer à la question suivante
        questionIndex++;
        setTimeout(showQuestion, 1000); // Attendre 1 seconde avant d'afficher la question suivante
      });
    }

    // Lancer le compte à rebours
    startCountdown();

    // Fonction pour lancer le compte à rebours
    function startCountdown() {
      let timeLeft = quizConfig.timePerQuestion;
      const countdownElement = document.getElementById("countdown");
      countdownElement.innerText = `Temps restant : ${timeLeft}s`;
      const intervalId = setInterval(() => {
        timeLeft--;
        countdownElement.innerText = `Temps restant : ${timeLeft}s`;
        if (timeLeft === 0) {
          // Passer à la question suivante
          questionIndex++;
          clearInterval(intervalId);
          setTimeout(showQuestion, 1000); // Attendre 1 seconde avant d'afficher la question suivante
        }
      }, 1000);
    }
  }
}

// Fonction pour se connecter avec Twitch
async function connectWithTwitch() {
  const clientId = "bbgt09sz9i3vlwveohg12cicwig2cb"; // Remplacer par votre propre client ID
  const redirectUri = "https://screwli.github.io/DayQuiz/"; // Remplacer par votre propre URL de redirection
  const responseType = "token";
  const scope = "openid";

  const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
  window.location.href = authUrl;
}

// Fonction pour récupérer l'access token depuis l'URL de redirection
function getAccessTokenFromUrl() {
  const hash = window.location.hash.substr(1);
  const params = new URLSearchParams(hash);
  return params.get("access_token");
}

