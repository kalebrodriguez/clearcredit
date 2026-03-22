// AP Credit Equivalencies for Florida state colleges (per SBE Rule 6A-10.0315)
// Each exam maps score → array of HCC course equivalencies
export const AP_CREDITS = [
  {
    exam: "Art History",
    subject: "Humanities",
    score3: [{ course: "ARH 1000", credits: 3 }],
    score4: [{ course: "ARH 1000", credits: 3 }],
    score5: [{ course: "ARH 1000", credits: 3 }],
  },
  {
    exam: "Biology",
    subject: "Natural Science",
    score3: [{ course: "BSC 1010C", credits: 3 }],
    score4: [{ course: "BSC 1010C", credits: 4 }],
    score5: [{ course: "BSC 1010C", credits: 4 }, { course: "BSC 1011C", credits: 4 }],
  },
  {
    exam: "Calculus AB",
    subject: "Mathematics",
    score3: [{ course: "MAC 2311", credits: 4 }],
    score4: [{ course: "MAC 2311", credits: 4 }],
    score5: [{ course: "MAC 2311", credits: 4 }],
  },
  {
    exam: "Calculus BC",
    subject: "Mathematics",
    score3: [{ course: "MAC 2311", credits: 4 }],
    score4: [{ course: "MAC 2311", credits: 4 }, { course: "MAC 2312", credits: 4 }],
    score5: [{ course: "MAC 2311", credits: 4 }, { course: "MAC 2312", credits: 4 }],
  },
  {
    exam: "Chemistry",
    subject: "Natural Science",
    score3: [{ course: "CHM 1045C", credits: 3 }],
    score4: [{ course: "CHM 1045C", credits: 4 }],
    score5: [{ course: "CHM 1045C", credits: 4 }, { course: "CHM 1046C", credits: 4 }],
  },
  {
    exam: "Chinese Language and Culture",
    subject: "Foreign Language",
    score3: [{ course: "CHI 1120", credits: 3 }],
    score4: [{ course: "CHI 1120", credits: 3 }],
    score5: [{ course: "CHI 1120", credits: 3 }, { course: "CHI 2200", credits: 3 }],
  },
  {
    exam: "Comparative Government and Politics",
    subject: "Social Science",
    score3: [{ course: "CPO 2002", credits: 3 }],
    score4: [{ course: "CPO 2002", credits: 3 }],
    score5: [{ course: "CPO 2002", credits: 3 }],
  },
  {
    exam: "Computer Science A",
    subject: "Computer Science",
    score3: [{ course: "COP 2250", credits: 3 }],
    score4: [{ course: "COP 2250", credits: 3 }],
    score5: [{ course: "COP 2250", credits: 3 }],
  },
  {
    exam: "Computer Science Principles",
    subject: "Computer Science",
    score3: [{ course: "COP 1000", credits: 3 }],
    score4: [{ course: "COP 1000", credits: 3 }],
    score5: [{ course: "COP 1000", credits: 3 }],
  },
  {
    exam: "English Language and Composition",
    subject: "English",
    score3: [{ course: "ENC 1101", credits: 3 }],
    score4: [{ course: "ENC 1101", credits: 3 }],
    score5: [{ course: "ENC 1101", credits: 3 }, { course: "ENC 1102", credits: 3 }],
  },
  {
    exam: "English Literature and Composition",
    subject: "English",
    score3: [{ course: "ENC 1101", credits: 3 }],
    score4: [{ course: "ENC 1101", credits: 3 }],
    score5: [{ course: "ENC 1101", credits: 3 }, { course: "ENC 1102", credits: 3 }],
  },
  {
    exam: "Environmental Science",
    subject: "Natural Science",
    score3: [{ course: "EVR 1001", credits: 3 }],
    score4: [{ course: "EVR 1001", credits: 3 }],
    score5: [{ course: "EVR 1001", credits: 3 }],
  },
  {
    exam: "European History",
    subject: "Humanities",
    score3: [{ course: "EUH 1000", credits: 3 }],
    score4: [{ course: "EUH 1000", credits: 3 }],
    score5: [{ course: "EUH 1000", credits: 3 }, { course: "EUH 1001", credits: 3 }],
  },
  {
    exam: "French Language and Culture",
    subject: "Foreign Language",
    score3: [{ course: "FRE 1120", credits: 3 }],
    score4: [{ course: "FRE 1120", credits: 3 }],
    score5: [{ course: "FRE 1120", credits: 3 }, { course: "FRE 2200", credits: 3 }],
  },
  {
    exam: "Human Geography",
    subject: "Social Science",
    score3: [{ course: "GEO 2420", credits: 3 }],
    score4: [{ course: "GEO 2420", credits: 3 }],
    score5: [{ course: "GEO 2420", credits: 3 }],
  },
  {
    exam: "Latin",
    subject: "Foreign Language",
    score3: [{ course: "LAT 1120", credits: 3 }],
    score4: [{ course: "LAT 1120", credits: 3 }],
    score5: [{ course: "LAT 1120", credits: 3 }],
  },
  {
    exam: "Macroeconomics",
    subject: "Social Science",
    score3: [{ course: "ECO 2013", credits: 3 }],
    score4: [{ course: "ECO 2013", credits: 3 }],
    score5: [{ course: "ECO 2013", credits: 3 }],
  },
  {
    exam: "Microeconomics",
    subject: "Social Science",
    score3: [{ course: "ECO 2023", credits: 3 }],
    score4: [{ course: "ECO 2023", credits: 3 }],
    score5: [{ course: "ECO 2023", credits: 3 }],
  },
  {
    exam: "Music Theory",
    subject: "Humanities",
    score3: [{ course: "MUT 1001", credits: 3 }],
    score4: [{ course: "MUT 1001", credits: 3 }],
    score5: [{ course: "MUT 1001", credits: 3 }],
  },
  {
    exam: "Physics 1",
    subject: "Natural Science",
    score3: [{ course: "PHY 2053C", credits: 4 }],
    score4: [{ course: "PHY 2053C", credits: 4 }],
    score5: [{ course: "PHY 2053C", credits: 4 }],
  },
  {
    exam: "Physics 2",
    subject: "Natural Science",
    score3: [{ course: "PHY 2054C", credits: 4 }],
    score4: [{ course: "PHY 2054C", credits: 4 }],
    score5: [{ course: "PHY 2054C", credits: 4 }],
  },
  {
    exam: "Physics C: Electricity and Magnetism",
    subject: "Natural Science",
    score3: [{ course: "PHY 2049C", credits: 4 }],
    score4: [{ course: "PHY 2049C", credits: 4 }],
    score5: [{ course: "PHY 2049C", credits: 4 }],
  },
  {
    exam: "Physics C: Mechanics",
    subject: "Natural Science",
    score3: [{ course: "PHY 2048C", credits: 4 }],
    score4: [{ course: "PHY 2048C", credits: 4 }],
    score5: [{ course: "PHY 2048C", credits: 4 }],
  },
  {
    exam: "Psychology",
    subject: "Social Science",
    score3: [{ course: "PSY 2012", credits: 3 }],
    score4: [{ course: "PSY 2012", credits: 3 }],
    score5: [{ course: "PSY 2012", credits: 3 }],
  },
  {
    exam: "Spanish Language and Culture",
    subject: "Foreign Language",
    score3: [{ course: "SPN 1120", credits: 3 }],
    score4: [{ course: "SPN 1120", credits: 3 }],
    score5: [{ course: "SPN 1120", credits: 3 }, { course: "SPN 2200", credits: 3 }],
  },
  {
    exam: "Spanish Literature and Culture",
    subject: "Foreign Language",
    score3: [{ course: "SPN 2300", credits: 3 }],
    score4: [{ course: "SPN 2300", credits: 3 }],
    score5: [{ course: "SPN 2300", credits: 3 }],
  },
  {
    exam: "Statistics",
    subject: "Mathematics",
    score3: [{ course: "STA 2023", credits: 3 }],
    score4: [{ course: "STA 2023", credits: 3 }],
    score5: [{ course: "STA 2023", credits: 3 }],
  },
  {
    exam: "United States Government and Politics",
    subject: "Social Science",
    score3: [{ course: "POS 2041", credits: 3 }],
    score4: [{ course: "POS 2041", credits: 3 }],
    score5: [{ course: "POS 2041", credits: 3 }],
  },
  {
    exam: "United States History",
    subject: "Social Science",
    score3: [{ course: "AMH 2010", credits: 3 }],
    score4: [{ course: "AMH 2010", credits: 3 }],
    score5: [{ course: "AMH 2010", credits: 3 }, { course: "AMH 2020", credits: 3 }],
  },
  {
    exam: "World History: Modern",
    subject: "Humanities",
    score3: [{ course: "WOH 1012", credits: 3 }],
    score4: [{ course: "WOH 1012", credits: 3 }],
    score5: [{ course: "WOH 1012", credits: 3 }, { course: "WOH 1022", credits: 3 }],
  },
]

// Returns the HCC courses earned for a given AP exam + score (3, 4, or 5)
// Returns empty array if score < 3 or exam not found
export function getAPCredits(examName, score) {
  if (score < 3) return []
  const entry = AP_CREDITS.find(e => e.exam === examName)
  if (!entry) return []
  if (score === 3) return entry.score3
  if (score === 4) return entry.score4
  return entry.score5
}
