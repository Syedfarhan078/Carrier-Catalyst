export const questions = [
  {
    id: 1,
    question: "What is Machine Learning?",
    options: ["A subset of AI that enables systems to learn from data", "A database management tool", "A type of compiler", "An operating system kernel"],
    answer: "A subset of AI that enables systems to learn from data",
    difficulty: "Easy",
    topic: "AI/ML"
  },
  {
    id: 2,
    question: "Which data structure uses LIFO (Last In, First Out) principle?",
    options: ["Queue", "Stack", "Linked List", "Binary Tree"],
    answer: "Stack",
    difficulty: "Easy",
    topic: "Data Structures"
  },
  {
    id: 3,
    question: "What is the time complexity of Binary Search?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"],
    answer: "O(log n)",
    difficulty: "Medium",
    topic: "Algorithms"
  },
  {
    id: 4,
    question: "Which HTTP method is used to update an existing resource in REST APIs?",
    options: ["GET", "POST", "PUT", "DELETE"],
    answer: "PUT",
    difficulty: "Medium",
    topic: "Web Development"
  },
  {
    id: 5,
    question: "What does SQL stand for?",
    options: ["Structured Query Language", "Simple Query Logic", "Structured Question List", "System Query Language"],
    answer: "Structured Query Language",
    difficulty: "Easy",
    topic: "Databases"
  },
  {
    id: 6,
    question: "In React, what hook is used to manage side effects?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    answer: "useEffect",
    difficulty: "Medium",
    topic: "React"
  },
  {
    id: 7,
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Insertion Sort", "Quick Sort", "Selection Sort"],
    answer: "Quick Sort",
    difficulty: "Medium",
    topic: "Algorithms"
  },
  {
    id: 8,
    question: "What is a closure in JavaScript?",
    options: [
      "A function that has access to its outer scope even after the outer function has returned",
      "A method to close browser windows",
      "A way to terminate loops",
      "A CSS property for hiding elements"
    ],
    answer: "A function that has access to its outer scope even after the outer function has returned",
    difficulty: "Hard",
    topic: "JavaScript"
  },
  {
    id: 9,
    question: "What is the purpose of Docker in software development?",
    options: [
      "To write faster code",
      "To containerize applications for consistent deployment",
      "To manage SQL databases",
      "To design user interfaces"
    ],
    answer: "To containerize applications for consistent deployment",
    difficulty: "Medium",
    topic: "DevOps"
  },
  {
    id: 10,
    question: "What is a neural network?",
    options: [
      "A computer network using neural cables",
      "A computational model inspired by the human brain",
      "A type of firewall",
      "A database indexing technique"
    ],
    answer: "A computational model inspired by the human brain",
    difficulty: "Medium",
    topic: "AI/ML"
  },
  {
    id: 11,
    question: "Which of these is NOT a JavaScript framework/library?",
    options: ["React", "Vue", "Django", "Angular"],
    answer: "Django",
    difficulty: "Easy",
    topic: "Web Development"
  },
  {
    id: 12,
    question: "What does API stand for?",
    options: ["Application Programming Interface", "Automated Process Integration", "Application Process Input", "Advanced Programming Index"],
    answer: "Application Programming Interface",
    difficulty: "Easy",
    topic: "General"
  },
  {
    id: 13,
    question: "What is the difference between == and === in JavaScript?",
    options: [
      "No difference, they work the same",
      "=== checks value only, == checks type only",
      "== checks value with type coercion, === checks value and type strictly",
      "=== is used for objects, == for primitives"
    ],
    answer: "== checks value with type coercion, === checks value and type strictly",
    difficulty: "Medium",
    topic: "JavaScript"
  },
  {
    id: 14,
    question: "What is Git used for?",
    options: ["Web hosting", "Version control", "Database management", "UI design"],
    answer: "Version control",
    difficulty: "Easy",
    topic: "DevOps"
  },
  {
    id: 15,
    question: "What is Big O notation used to describe?",
    options: [
      "The size of code files",
      "The number of developers on a project",
      "The performance/complexity of an algorithm",
      "The version of an API"
    ],
    answer: "The performance/complexity of an algorithm",
    difficulty: "Medium",
    topic: "Algorithms"
  }
];

export const assessmentConfig = {
  title: "Full Stack Developer Assessment",
  duration: 1800, // 30 minutes in seconds
  passingScore: 60,
  totalQuestions: questions.length
};