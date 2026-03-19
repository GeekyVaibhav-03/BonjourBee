const gameQuestionBank = [
  {
    question: "What does 'rouge' mean in English?",
    options: ["Red", "Green", "Blue", "Yellow"],
    answer: "Red",
  },
  {
    question: "Choose the French word for cat.",
    options: ["Chien", "Chat", "Oiseau", "Poisson"],
    answer: "Chat",
  },
  {
    question: "What is the correct meaning of 'livre'?",
    options: ["Book", "Desk", "Bag", "Notebook"],
    answer: "Book",
  },
  {
    question: "Translate 'school' to French.",
    options: ["Maison", "Ecole", "Bureau", "Parc"],
    answer: "Ecole",
  },
  {
    question: "Which one means 'thank you'?",
    options: ["Pardon", "Merci", "Salut", "Bonsoir"],
    answer: "Merci",
  },
  {
    question: "Pick the correct French word for 'family'.",
    options: ["Famille", "Voiture", "Ville", "Classe"],
    answer: "Famille",
  },
  {
    question: "What does 'sortie' usually mean on a sign?",
    options: ["Entrance", "Exit", "Street", "Platform"],
    answer: "Exit",
  },
  {
    question: "Choose the right translation: 'apple'.",
    options: ["Pomme", "Poire", "Orange", "Fraise"],
    answer: "Pomme",
  },
  {
    question: "Which French verb means 'to speak'?",
    options: ["Manger", "Parler", "Dormir", "Aimer"],
    answer: "Parler",
  },
  {
    question: "Complete: 'Nous ___ au parc.'",
    options: ["allons", "allez", "vais", "va"],
    answer: "allons",
  },
  {
    question: "Complete: 'Ils ___ francais.'",
    options: ["parlent", "parle", "parlons", "parlez"],
    answer: "parlent",
  },
  {
    question: "Select the best translation of 'Goodbye'.",
    options: ["Bonjour", "Merci", "Au revoir", "A demain"],
    answer: "Au revoir",
  },
  {
    question: "What does 'bureau' mean?",
    options: ["Office", "Kitchen", "Garden", "School"],
    answer: "Office",
  },
  {
    question: "Which phrase means 'Please'?",
    options: ["Merci", "S'il vous plait", "Bonne nuit", "Je suis"],
    answer: "S'il vous plait",
  },
  {
    question: "Choose the correct translation of 'station'.",
    options: ["Gare", "Rue", "Maison", "Fenetre"],
    answer: "Gare",
  },
  {
    question: "What does 'chien' mean?",
    options: ["Dog", "Cat", "Horse", "Bird"],
    answer: "Dog",
  },
  {
    question: "Translate 'green' into French.",
    options: ["Rouge", "Vert", "Noir", "Blanc"],
    answer: "Vert",
  },
  {
    question: "Pick the French word for 'train'.",
    options: ["Avion", "Bateau", "Train", "Bus"],
    answer: "Train",
  },
  {
    question: "Which one means 'library'?",
    options: ["Hopital", "Bibliotheque", "Magasin", "Eglise"],
    answer: "Bibliotheque",
  },
  {
    question: "Choose the correct French for 'read'.",
    options: ["Lire", "Ecrire", "Parler", "Venir"],
    answer: "Lire",
  },
];

const baseLessons = [
  {
    title: "French Greetings Basics",
    description: "Learn Bonjour, Bonsoir, and polite introductions.",
    level: "A1",
    type: "audio",
    zone: "kids",
    durationMinutes: 8,
    xpReward: 20,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    videoUrl: "https://www.youtube.com/watch?v=qvI_7St3mBk&list=PLhPqxcTpoRSNYyuovAVKTHX8f3UGHBCi3&index=3",
    content: "Practice greeting friends and teachers in French.",
    quiz: [
      {
        question: "What does 'Bonjour' mean?",
        options: ["Goodbye", "Hello", "Please", "Thanks"],
        answer: "Hello",
      },
      {
        question: "Which phrase is polite in the morning?",
        options: ["Bonjour", "Bonne nuit", "Merci", "Pardon"],
        answer: "Bonjour",
      },
    ],
  },
  {
    title: "Color Hunt Game",
    description: "Match French color names with objects.",
    level: "A1",
    type: "game",
    zone: "kids",
    durationMinutes: 10,
    xpReward: 25,
    content: "Play a drag-and-match game to identify colors.",
    quiz: [
      {
        question: "'Rouge' means?",
        options: ["Blue", "Red", "Green", "Yellow"],
        answer: "Red",
      },
    ],
  },
  {
    title: "Numbers and Counting Song",
    description: "Build counting confidence from 1 to 20 with rhythm drills.",
    level: "A1",
    type: "audio",
    zone: "kids",
    durationMinutes: 9,
    xpReward: 22,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    videoUrl: "https://www.youtube.com/watch?v=DGCB0ySwfok&list=PLhPqxcTpoRSNYyuovAVKTHX8f3UGHBCi3&index=2",
    content: "Listen and repeat number patterns in French.",
    quiz: [
      {
        question: "What is 'dix'?",
        options: ["Seven", "Ten", "Two", "Twelve"],
        answer: "Ten",
      },
      {
        question: "What comes after 'trois'?",
        options: ["cinq", "quatre", "deux", "un"],
        answer: "quatre",
      },
    ],
  },
  {
    title: "Animal Match Adventure",
    description: "Match French animal words with playful picture clues.",
    level: "A1",
    type: "game",
    zone: "kids",
    durationMinutes: 11,
    xpReward: 26,
    content: "Identify common animals in French under a timer.",
    quiz: [
      {
        question: "'Chat' means?",
        options: ["Dog", "Bird", "Cat", "Fish"],
        answer: "Cat",
      },
    ],
  },
  {
    title: "My Family Speak-Along",
    description: "Practice saying family member names in short spoken lines.",
    level: "A1",
    type: "speaking",
    zone: "kids",
    durationMinutes: 10,
    xpReward: 24,
    videoUrl: "https://www.youtube.com/watch?v=FV4d5X4RT4o&list=PLhPqxcTpoRSNYyuovAVKTHX8f3UGHBCi3&index=15",
    content: "Say and repeat: mother, father, brother, sister in French.",
    quiz: [
      {
        question: "How do you say 'mother' in French?",
        options: ["pere", "mere", "frere", "soeur"],
        answer: "mere",
      },
    ],
  },
  {
    title: "Classroom Objects Quest",
    description: "Learn school vocabulary through a quick item hunt game.",
    level: "A1",
    type: "game",
    zone: "kids",
    durationMinutes: 9,
    xpReward: 23,
    content: "Find and match words for book, pen, and desk.",
    quiz: [
      {
        question: "'Livre' means?",
        options: ["Notebook", "Book", "Desk", "Bag"],
        answer: "Book",
      },
    ],
  },
  {
    title: "Days and Weather Audio",
    description: "Understand days of the week and common weather phrases.",
    level: "A1",
    type: "audio",
    zone: "kids",
    durationMinutes: 8,
    xpReward: 21,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    content: "Listen to short daily weather conversations.",
    quiz: [
      {
        question: "What does 'lundi' mean?",
        options: ["Monday", "Sunday", "Friday", "Tuesday"],
        answer: "Monday",
      },
    ],
  },
  {
    title: "Mini Dialogues Hello and Goodbye",
    description: "Use greeting and farewell phrases in mini conversation scenes.",
    level: "A1",
    type: "speaking",
    zone: "kids",
    durationMinutes: 9,
    xpReward: 22,
    content: "Role-play simple greetings with classmates and teachers.",
    quiz: [
      {
        question: "Which phrase means 'Goodbye'?",
        options: ["Bonjour", "Merci", "Au revoir", "Pardon"],
        answer: "Au revoir",
      },
    ],
  },
  {
    title: "School Life French Starter",
    description: "Learn common classroom and schedule phrases for teens.",
    level: "A1",
    type: "audio",
    zone: "teen",
    durationMinutes: 10,
    xpReward: 24,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    content: "Follow short dialogues about classes and routines.",
    quiz: [
      {
        question: "'Classe' means?",
        options: ["Class", "Homework", "Teacher", "Break"],
        answer: "Class",
      },
    ],
  },
  {
    title: "Self Introduction Speaking Drill",
    description: "Build confidence introducing yourself in French.",
    level: "A1",
    type: "speaking",
    zone: "teen",
    durationMinutes: 11,
    xpReward: 25,
    content: "Practice name, age, hobbies, and hometown in French.",
    quiz: [
      {
        question: "How do you say 'My name is...'?",
        options: ["Je m'appelle", "J'ai", "Je suis", "Je vais"],
        answer: "Je m'appelle",
      },
    ],
  },
  {
    title: "City Signs Vocabulary Game",
    description: "Decode common city sign words in a speed challenge.",
    level: "A1",
    type: "game",
    zone: "teen",
    durationMinutes: 10,
    xpReward: 25,
    content: "Match French signs with everyday city places.",
    quiz: [
      {
        question: "'Sortie' means?",
        options: ["Entrance", "Exit", "Street", "Train"],
        answer: "Exit",
      },
    ],
  },
  {
    title: "Everyday Polite French",
    description: "Master useful polite expressions for daily interactions.",
    level: "A1",
    type: "audio",
    zone: "adult",
    durationMinutes: 9,
    xpReward: 23,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    content: "Listen and repeat practical polite phrases.",
    quiz: [
      {
        question: "Which phrase means 'Please'?",
        options: ["Merci", "S'il vous plait", "Bonsoir", "Pardon"],
        answer: "S'il vous plait",
      },
    ],
  },
  {
    title: "Beginner Conversation Roleplay",
    description: "Practice speaking in common social situations.",
    level: "A1",
    type: "speaking",
    zone: "adult",
    durationMinutes: 12,
    xpReward: 27,
    content: "Use short dialogue templates in pair practice.",
    quiz: [
      {
        question: "A polite way to ask someone to repeat is?",
        options: ["Encore", "Repetez, s'il vous plait", "Pardon", "Oui"],
        answer: "Repetez, s'il vous plait",
      },
    ],
  },
  {
    title: "Workplace Nouns Match",
    description: "Match essential workplace vocabulary in a quick game.",
    level: "A1",
    type: "game",
    zone: "adult",
    durationMinutes: 10,
    xpReward: 24,
    content: "Identify desk, meeting, and office tools in French.",
    quiz: [
      {
        question: "'Bureau' means?",
        options: ["Office", "Kitchen", "Market", "School"],
        answer: "Office",
      },
    ],
  },
  {
    title: "Speak at the Cafe",
    description: "Speaking practice for ordering food and drinks.",
    level: "A2",
    type: "speaking",
    zone: "teen",
    durationMinutes: 12,
    xpReward: 30,
    content: "Use voice prompts to order a meal politely.",
    quiz: [
      {
        question: "How do you say 'I would like'?",
        options: ["Je suis", "Je vais", "Je voudrais", "Je prends"],
        answer: "Je voudrais",
      },
    ],
  },
  {
    title: "Daily Routine Story Audio",
    description: "Train listening with a full A2-level daily routine story.",
    level: "A2",
    type: "audio",
    zone: "teen",
    durationMinutes: 12,
    xpReward: 29,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    content: "Follow a teen's routine from morning to evening.",
    quiz: [
      {
        question: "What does 'je me leve' mean?",
        options: ["I wake up", "I eat", "I work", "I travel"],
        answer: "I wake up",
      },
    ],
  },
  {
    title: "Restaurant Roleplay Challenge",
    description: "Handle menu choices and polite ordering with confidence.",
    level: "A2",
    type: "speaking",
    zone: "teen",
    durationMinutes: 13,
    xpReward: 31,
    content: "Role-play customer and server interactions.",
    quiz: [
      {
        question: "How do you ask for the bill?",
        options: ["L'addition, s'il vous plait", "Je voudrais du pain", "Ou est la gare", "Merci beaucoup"],
        answer: "L'addition, s'il vous plait",
      },
    ],
  },
  {
    title: "Verb Builder Game",
    description: "Assemble correct present tense verb forms quickly.",
    level: "A2",
    type: "game",
    zone: "teen",
    durationMinutes: 12,
    xpReward: 30,
    content: "Build conjugations with timed rounds.",
    quiz: [
      {
        question: "Correct form for 'ils parler' is?",
        options: ["ils parle", "ils parlons", "ils parlez", "ils parlent"],
        answer: "ils parlent",
      },
    ],
  },
  {
    title: "Listening at the Market",
    description: "Understand quantity, price, and product questions.",
    level: "A2",
    type: "audio",
    zone: "adult",
    durationMinutes: 12,
    xpReward: 30,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    content: "Listen to practical shopping conversations.",
    quiz: [
      {
        question: "What does 'Combien' usually ask about?",
        options: ["Time", "Price or quantity", "Direction", "Weather"],
        answer: "Price or quantity",
      },
    ],
  },
  {
    title: "Small Talk Confidence Coach",
    description: "Build smooth small talk for meetings and networking.",
    level: "A2",
    type: "speaking",
    zone: "adult",
    durationMinutes: 14,
    xpReward: 33,
    content: "Practice introducing topics and responding naturally.",
    quiz: [
      {
        question: "A friendly opener is?",
        options: ["Enchanté de vous rencontrer", "Je suis fatigue", "Je ne sais pas", "Pas maintenant"],
        answer: "Enchanté de vous rencontrer",
      },
    ],
  },
  {
    title: "Preposition Puzzle Run",
    description: "Use place and movement prepositions with speed rounds.",
    level: "A2",
    type: "game",
    zone: "adult",
    durationMinutes: 11,
    xpReward: 29,
    content: "Choose the best preposition in context.",
    quiz: [
      {
        question: "Correct phrase is 'sur ___ table'.",
        options: ["le", "la", "les", "de"],
        answer: "la",
      },
    ],
  },
  {
    title: "Verb Conjugation Sprint",
    description: "Quick game for present tense conjugations.",
    level: "B1",
    type: "game",
    zone: "teen",
    durationMinutes: 14,
    xpReward: 35,
    content: "Choose the correct verb forms under time pressure.",
    quiz: [
      {
        question: "Correct for 'nous aller' is?",
        options: ["nous allons", "nous allez", "nous va", "nous vais"],
        answer: "nous allons",
      },
    ],
  },
  {
    title: "Business Meeting Audio",
    description: "Advanced listening for workplace communication.",
    level: "B2",
    type: "audio",
    zone: "adult",
    durationMinutes: 16,
    xpReward: 45,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    content: "Understand agenda, requests, and follow-up actions.",
    quiz: [
      {
        question: "'Ordre du jour' means?",
        options: ["Project plan", "Agenda", "Deadline", "Invoice"],
        answer: "Agenda",
      },
    ],
  },
  {
    title: "Presentation Speaking Coach",
    description: "Practice formal speaking with guided prompts.",
    level: "C1",
    type: "speaking",
    zone: "adult",
    durationMinutes: 18,
    xpReward: 55,
    content: "Record and improve confidence for professional French.",
    quiz: [
      {
        question: "Best formal opener is?",
        options: ["Salut tout le monde", "Bonjour à tous", "Yo", "Coucou"],
        answer: "Bonjour à tous",
      },
    ],
  },
];

function ensureGameLessonQuiz(lesson, lessonIndex) {
  if (lesson.type !== "game") {
    return lesson;
  }

  const normalizedQuiz = (lesson.quiz || []).filter(
    (item) =>
      item &&
      item.question &&
      Array.isArray(item.options) &&
      item.options.length > 0 &&
      item.answer,
  );

  const usedQuestions = new Set(normalizedQuiz.map((item) => item.question));
  const mergedQuiz = normalizedQuiz.map((item) => ({
    question: item.question,
    options: [...item.options],
    answer: item.answer,
  }));

  for (let offset = 0; mergedQuiz.length < 10 && offset < gameQuestionBank.length * 2; offset += 1) {
    const candidate = gameQuestionBank[(lessonIndex + offset) % gameQuestionBank.length];
    if (usedQuestions.has(candidate.question)) {
      continue;
    }

    mergedQuiz.push({
      question: candidate.question,
      options: [...candidate.options],
      answer: candidate.answer,
    });
    usedQuestions.add(candidate.question);
  }

  return {
    ...lesson,
    quiz: mergedQuiz.slice(0, 10),
  };
}

module.exports = baseLessons.map((lesson, index) => ensureGameLessonQuiz(lesson, index));
