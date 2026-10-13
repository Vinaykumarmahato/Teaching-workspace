/* Starting content. Edit freely, or add items from inside the site.
   Note: after the site has been used, saved changes live in your browser (localStorage).
   To start fresh from this file, use your browser to clear site data for this page. */

const CIE_TABLE = [
  { test: "CIE-1 Theory Test I",    week: 4,  duration: "90 min",  marks: 50 },
  { test: "CIE-2 Practice Test II", week: 7,  duration: "180 min", marks: 50 },
  { test: "CIE-3 Theory Test III",  week: 10, duration: "90 min",  marks: 50 },
  { test: "CIE-4 Practice Test IV", week: 13, duration: "180 min", marks: 50 }
];

const DEFAULT_DATA = {
  notes: "CIE-3 reminder: check the portion with the class in-charge.",
  recent: [],
  subjects: [
    {
      id: "me", name: "Programming Concepts in Mechanical Engineering", code: "25ME34I",
      cie: CIE_TABLE,
      schedule: [
        { week: "1-4",  topic: "Python basics, flowcharts, loops, functions" },
        { week: "5-7",  topic: "Lists, dictionaries, file and exception handling, OOP" },
        { week: "8-9",  topic: "Raspberry Pi: sensors and motor control" },
        { week: "10-11", topic: "Statistical quality control, Cp and Cpk" },
        { week: "12-13", topic: "Hypothesis testing, TQM, finite element method" }
      ],
      papers: [
        { title: "CIE Theory Test III (weeks 5-13)",   file: "papers/CIE_Theory_Test_III_25ME34I.pdf" },
        { title: "CIE Practice Test II (weeks 1-7)",   file: "papers/CIE_Practice_Test_II_25ME34I.pdf" },
        { title: "CIE Practice Test IV (weeks 8-13)",  file: "papers/CIE_Practice_Test_IV_25ME34I.pdf" }
      ],
      answers: [],
      questions: [
        { week: "Week 5-6", marks: 6, co: "CO1", q: "Differentiate between a list and a dictionary in Python with an example.",
          a: "A list is an ordered collection accessed by index, e.g. [10, 20, 30]. A dictionary stores key-value pairs accessed by key, e.g. {'force': 50}. Lists are used for sequences; dictionaries for labelled data." },
        { week: "Week 10", marks: 6, co: "CO3", q: "Define Cp and Cpk. What does Cpk < 1 indicate?",
          a: "Cp = (USL - LSL) / 6 sigma measures process spread against tolerance. Cpk = min[(USL - mean)/3 sigma, (mean - LSL)/3 sigma] also accounts for centring. Cpk < 1 means the process is not capable and produces defects." }
      ],
      programs: [
        { title: "Factorial using a while loop", aim: "To find the factorial of a number.",
          code: "n = int(input('Enter n: '))\nf = 1\nwhile n > 1:\n    f *= n\n    n -= 1\nprint('Factorial =', f)",
          output: "Enter n: 5\nFactorial = 120",
          viva: "What is the base case?\nWhy use a while loop instead of for?" }
      ],
      tips: [
        { group: "Theory", text: "Read the OR choice carefully and attempt only one question per section." },
        { group: "Theory", text: "Write the formula first, then substitute values, then the unit." },
        { group: "Practical", text: "Draw the flowchart before the program. It carries marks." },
        { group: "Practical", text: "Test with one sample input and write the output in the record." }
      ]
    },
    {
      id: "sna", name: "System and Network Administration", code: "SNA",
      cie: CIE_TABLE, schedule: [], papers: [], answers: [],
      questions: [{ week: "Unit 1", marks: 5, co: "CO1", q: "What is the role of a system administrator?",
        a: "Installs and configures systems, manages users and permissions, monitors performance, applies backups and security updates, and troubleshoots faults." }],
      programs: [], tips: []
    },
    {
      id: "dsp", name: "Data Structures with Python", code: "DSP",
      cie: CIE_TABLE, schedule: [], papers: [], answers: [],
      questions: [{ week: "Unit 1", marks: 5, co: "CO1", q: "Differentiate between a stack and a queue.",
        a: "Stack follows LIFO (last in, first out) with push and pop at one end. Queue follows FIFO (first in, first out) with enqueue at the rear and dequeue at the front." }],
      programs: [], tips: []
    }
  ]
};
