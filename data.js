/*
 * EDIT THIS FILE to add / rename files.
 * Paths are relative to the site root (same level as index.html).
 * Set question or answer to null if the file doesn't exist yet.
 *
 */
const SUBJECTS = [
  {
    id: "dsp",
    name: "Data Structures with Python",
    code: "25CS33I",
    tests: [
      { title: "CIE Test I",
        question: "papers/CIE_Test_I_Data_Structures_Python_25CS331.pdf",
        answer:   "answers/Data_Structures_Python_CIE_Test_I_Model_Answers.pdf" },
      { title: "CIE Practice Test II",
        question: "papers/CIE_Practice_Test_II_Data_Structures_Python_25CS33I.pdf",
        answer:   "answers/Data_Structures_Python_CIE_Test_II_Model_Answers.pdf" },
      { title: "CIE Test III (Theory)",
        question: "papers/CIE_Test_III_Data_Structures_Python_25CS33I.pdf",
        answer:   "answers/DSP_CIE_Theory_Test_III_Answers_25CS33I.pdf" },
      { title: "CIE Practice Test IV",
        question: "papers/CIE_Practice_Test_IV_Data_Structures_Python_25CS33I.pdf",
        answer:   "answers/DSP_CIE_Practice_Test_IV_Answers_25CS33I.pdf" }
    ],
    rubrics: [
      { title: "Data Structures Python Activities",
        file: "Activity Rubrics/Data_Structures_Python_Activities.pdf" }
    ]
  },
  {
    id: "pc",
    name: "Programming Concepts in Mechanical Engineering",
    code: "25ME34I",
    tests: [
      { title: "CIE Practice Test I",
        question: "papers/CIE_Practice_Test_I_25ME34I.pdf",
        answer:   "answers/CIE_Theory_Test_I_Answers_25ME34I.pdf" },
      { title: "CIE Practice Test II",
        question: "papers/CIE_Practice_Test_II_25ME34I.pdf",
        answer:   "answers/CIE_Practice_Test_II_Answers_25ME34I.pdf" },
      { title: "CIE Theory Test III",
        question: "papers/CIE_Theory_Test_III_25ME34I.pdf",
        answer:   "answers/CIE_Theory_Test_III_Answers_25ME34I.pdf" },
      { title: "CIE Practice Test IV",
        question: "papers/CIE_Practice_Test_IV_25ME34I.pdf",
        answer:   "answers/CIE_Practice_Test_IV_Answers_25ME34I.pdf" }
    ],
    rubrics: [
      { title: "Programming Concepts in Mechanical Engineering Activities",
        file: "Activity Rubrics/Programming_Concepts_in_Mechanical_Engineering_Activities.pdf" }
    ]
  },
  {
    id: "sna",
    name: "System & Network Administration",
    code: "25CS34I",
    tests: [
      { title: "CIE Practice Test I",
        question: "papers/SNA_CIE_Practice_Test_I_25CS34I.pdf",
        answer:   "answers/System and Network Administration 25CS34I_CIE_Test_I_Model_Answers.pdf" },
      { title: "CIE Practice Test II",
        question: "papers/SNA_CIE_Practice_Test_II_25CS34I.pdf",
        answer:   "answers/System_Network_Admin_CIE_Test_II_Answer_3pages.pdf" },
      { title: "CIE Theory Test III",
        question: "papers/SNA_CIE_Theory_Test_III_25CS34I.pdf",
        answer:   "answers/SNA_CIE_Theory_Test_III_Answers_25CS34I.pdf" },
      { title: "CIE Practice Test IV",
        question: "papers/SNA_CIE_Practice_Test_IV_25CS34I.pdf",
        answer:   "answers/SNA_CIE_Practice_Test_IV_Answers_25CS34I.pdf" }
    ],
    rubrics: [
      { title: "System & Network Admin Activities",
        file: "Activity Rubrics/System_Network_Admin_Activities.pdf" }
    ]
  }
];