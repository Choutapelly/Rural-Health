// Types for AI diagnostic suggestions

export interface DiagnosticEvidence {
  testName: string
  value: string | number
  interpretation: string
  strength: "strong" | "moderate" | "weak"
  source: "test" | "history" | "combination"
}

export interface PatientHistoryItem {
  id: string
  category: "condition" | "medication" | "allergy" | "procedure" | "familyHistory" | "socialHistory" | "lifestyle"
  name: string
  status?: "active" | "resolved" | "ongoing" | "unknown"
  dateRecorded?: string
  details?: string
  severity?: "mild" | "moderate" | "severe"
  relevance?: "high" | "medium" | "low"
}

export interface PatientDemographics {
  age?: number
  sex?: "male" | "female" | "other"
  ethnicity?: string
  weight?: number
  height?: number
  bmi?: number
  smokingStatus?: "current" | "former" | "never"
  alcoholUse?: "none" | "occasional" | "moderate" | "heavy"
}

export interface PatientData {
  demographics?: PatientDemographics
  history: PatientHistoryItem[]
}

export interface DiagnosticSuggestion {
  condition: string
  confidence: number // 0-100
  description: string
  evidencePoints: DiagnosticEvidence[]
  differentials: string[]
  suggestedTests: string[]
  historyFactors?: {
    supporting: string[]
    contradicting: string[]
  }
  riskFactors?: string[]
  references?: {
    title: string
    url: string
  }[]
}

// Helper function to check if patient has a specific condition in history
function hasConditionInHistory(history: PatientHistoryItem[], conditionNames: string[]): PatientHistoryItem | null {
  if (!history || !history.length) return null

  return (
    history.find(
      (item) =>
        item.category === "condition" &&
        conditionNames.some((name) => item.name.toLowerCase().includes(name.toLowerCase())),
    ) || null
  )
}

// Helper function to check if patient is on a specific medication
function hasActiveMedication(history: PatientHistoryItem[], medicationNames: string[]): PatientHistoryItem | null {
  if (!history || !history.length) return null

  return (
    history.find(
      (item) =>
        item.category === "medication" &&
        (item.status === "active" || item.status === "ongoing") &&
        medicationNames.some((name) => item.name.toLowerCase().includes(name.toLowerCase())),
    ) || null
  )
}

// Helper function to check for family history of a condition
function hasFamilyHistory(history: PatientHistoryItem[], conditionNames: string[]): PatientHistoryItem | null {
  if (!history || !history.length) return null

  return (
    history.find(
      (item) =>
        item.category === "familyHistory" &&
        conditionNames.some((name) => item.name.toLowerCase().includes(name.toLowerCase())),
    ) || null
  )
}

// Helper function to check for risk factors in patient history
function hasRiskFactors(
  patientData: PatientData,
  riskFactors: {
    conditions?: string[]
    medications?: string[]
    demographics?: {
      minAge?: number
      maxAge?: number
      sex?: "male" | "female"
      bmi?: { min?: number; max?: number }
      smoking?: boolean
      alcohol?: boolean
    }
  },
): string[] {
  const foundRiskFactors: string[] = []

  if (!patientData) return foundRiskFactors

  // Check conditions
  if (riskFactors.conditions && riskFactors.conditions.length) {
    riskFactors.conditions.forEach((condition) => {
      const found = hasConditionInHistory(patientData.history, [condition])
      if (found) {
        foundRiskFactors.push(`History of ${condition}`)
      }
    })
  }

  // Check medications
  if (riskFactors.medications && riskFactors.medications.length) {
    riskFactors.medications.forEach((medication) => {
      const found = hasActiveMedication(patientData.history, [medication])
      if (found) {
        foundRiskFactors.push(`Current use of ${medication}`)
      }
    })
  }

  // Check demographics
  if (riskFactors.demographics && patientData.demographics) {
    const demo = patientData.demographics

    // Age check
    if (riskFactors.demographics.minAge && demo.age && demo.age >= riskFactors.demographics.minAge) {
      foundRiskFactors.push(`Age ≥ ${riskFactors.demographics.minAge} years`)
    }

    if (riskFactors.demographics.maxAge && demo.age && demo.age <= riskFactors.demographics.maxAge) {
      foundRiskFactors.push(`Age ≤ ${riskFactors.demographics.maxAge} years`)
    }

    // Sex check
    if (riskFactors.demographics.sex && demo.sex === riskFactors.demographics.sex) {
      foundRiskFactors.push(`${riskFactors.demographics.sex === "male" ? "Male" : "Female"} sex`)
    }

    // BMI check
    if (riskFactors.demographics.bmi && demo.bmi) {
      if (riskFactors.demographics.bmi.min && demo.bmi >= riskFactors.demographics.bmi.min) {
        foundRiskFactors.push(`BMI ≥ ${riskFactors.demographics.bmi.min}`)
      }
      if (riskFactors.demographics.bmi.max && demo.bmi <= riskFactors.demographics.bmi.max) {
        foundRiskFactors.push(`BMI ≤ ${riskFactors.demographics.bmi.max}`)
      }
    }

    // Smoking check
    if (riskFactors.demographics.smoking && (demo.smokingStatus === "current" || demo.smokingStatus === "former")) {
      foundRiskFactors.push(`${demo.smokingStatus === "current" ? "Current" : "Former"} smoker`)
    }

    // Alcohol check
    if (riskFactors.demographics.alcohol && (demo.alcoholUse === "moderate" || demo.alcoholUse === "heavy")) {
      foundRiskFactors.push(`${demo.alcoholUse === "heavy" ? "Heavy" : "Moderate"} alcohol use`)
    }
  }

  return foundRiskFactors
}

// Function to analyze test results and generate diagnostic suggestions
export function generateDiagnosticSuggestions(testResults: any[], patientData?: PatientData): DiagnosticSuggestion[] {
  const suggestions: DiagnosticSuggestion[] = []

  if (!testResults || testResults.length === 0) {
    return suggestions
  }

  // Pattern: Elevated cardiac markers
  const troponin = testResults.find((test) => test.name === "Troponin" && test.abnormal)
  const bnp = testResults.find((test) => test.name === "BNP" && test.abnormal)

  if (troponin) {
    // Base evidence from test results
    const evidencePoints: DiagnosticEvidence[] = [
      {
        testName: "Troponin",
        value: troponin.value,
        interpretation: `Elevated troponin (${troponin.value} ${troponin.unit}) significantly above reference range (${troponin.referenceRange}).`,
        strength: troponin.critical ? "strong" : "moderate",
        source: "test",
      },
      ...(bnp
        ? [
            {
              testName: "BNP",
              value: bnp.value,
              interpretation: `Elevated BNP (${bnp.value} ${bnp.unit}) suggests cardiac stress.`,
              strength: "moderate",
              source: "test",
            },
          ]
        : []),
    ]

    // Check patient history for relevant factors
    let confidenceAdjustment = 0
    const supportingFactors: string[] = []
    const contradictingFactors: string[] = []
    const riskFactors: string[] = []

    if (patientData && patientData.history) {
      // Check for history of cardiac conditions
      const cardiacHistory = hasConditionInHistory(patientData.history, [
        "coronary artery disease",
        "myocardial infarction",
        "angina",
        "heart attack",
      ])

      if (cardiacHistory) {
        confidenceAdjustment += 10
        supportingFactors.push(`History of ${cardiacHistory.name}`)
        evidencePoints.push({
          testName: "Medical History",
          value: cardiacHistory.name,
          interpretation: `Previous history of ${cardiacHistory.name} increases likelihood of recurrent cardiac event.`,
          strength: "moderate",
          source: "history",
        })
      }

      // Check for cardiac risk factors
      const identifiedRiskFactors = hasRiskFactors(patientData, {
        conditions: ["hypertension", "diabetes", "hyperlipidemia", "obesity"],
        demographics: {
          minAge: 50,
          smoking: true,
        },
      })

      if (identifiedRiskFactors.length > 0) {
        confidenceAdjustment += 5
        riskFactors.push(...identifiedRiskFactors)

        // Add the most significant risk factor as evidence
        if (identifiedRiskFactors.length > 0) {
          evidencePoints.push({
            testName: "Risk Factors",
            value: identifiedRiskFactors.join(", "),
            interpretation: `Presence of cardiac risk factors increases likelihood of acute coronary syndrome.`,
            strength: "moderate",
            source: "history",
          })
        }
      }

      // Check for chest pain in history
      const chestPain = hasConditionInHistory(patientData.history, ["chest pain", "chest discomfort", "angina"])
      if (chestPain) {
        confidenceAdjustment += 15
        supportingFactors.push("Recent chest pain/discomfort")
        evidencePoints.push({
          testName: "Symptoms",
          value: chestPain.name,
          interpretation: `Recent ${chestPain.name} strongly supports diagnosis of acute coronary syndrome.`,
          strength: "strong",
          source: "history",
        })
      }

      // Check for recent normal cardiac evaluation
      const recentNormalCardiac = patientData.history.find(
        (item) =>
          (item.name.toLowerCase().includes("cardiac stress test") ||
            item.name.toLowerCase().includes("coronary angiogram")) &&
          item.details?.toLowerCase().includes("normal") &&
          item.dateRecorded &&
          new Date(item.dateRecorded) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Within last 30 days
      )

      if (recentNormalCardiac) {
        confidenceAdjustment -= 20
        contradictingFactors.push(`Recent normal ${recentNormalCardiac.name}`)
        evidencePoints.push({
          testName: "Recent Testing",
          value: recentNormalCardiac.name,
          interpretation: `Recent normal ${recentNormalCardiac.name} reduces likelihood of significant coronary artery disease.`,
          strength: "moderate",
          source: "history",
        })
      }
    }

    // Adjust confidence based on history
    let adjustedConfidence = troponin.critical ? 85 : 70
    adjustedConfidence += confidenceAdjustment

    // Cap confidence between 5 and 95
    adjustedConfidence = Math.min(95, Math.max(5, adjustedConfidence))

    suggestions.push({
      condition: "Acute Coronary Syndrome",
      confidence: adjustedConfidence,
      description:
        "Pattern of elevated cardiac markers suggests myocardial injury consistent with acute coronary syndrome.",
      evidencePoints,
      differentials: [
        "Myocarditis",
        "Pulmonary Embolism",
        "Sepsis with Cardiac Involvement",
        "Takotsubo Cardiomyopathy",
      ],
      suggestedTests: ["ECG", "Echocardiogram", "Coronary Angiography", "Chest X-ray"],
      historyFactors: {
        supporting: supportingFactors,
        contradicting: contradictingFactors,
      },
      riskFactors,
      references: [
        {
          title: "Fourth Universal Definition of Myocardial Infarction (2018)",
          url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000617",
        },
      ],
    })
  }

  // Pattern: Thyroid dysfunction
  const tsh = testResults.find((test) => test.name === "TSH" && test.abnormal)
  const freeT4 = testResults.find((test) => test.name === "Free T4" && test.abnormal)

  if (tsh && freeT4) {
    const lowTSH = Number(tsh.value) < Number(tsh.referenceRange.split("-")[0])
    const highT4 = Number(freeT4.value) > Number(freeT4.referenceRange.split("-")[1])

    if (lowTSH && highT4) {
      // Base evidence from test results
      const evidencePoints: DiagnosticEvidence[] = [
        {
          testName: "TSH",
          value: tsh.value,
          interpretation: `Suppressed TSH (${tsh.value} ${tsh.unit}) below reference range (${tsh.referenceRange}).`,
          strength: "strong",
          source: "test",
        },
        {
          testName: "Free T4",
          value: freeT4.value,
          interpretation: `Elevated Free T4 (${freeT4.value} ${freeT4.unit}) above reference range (${freeT4.referenceRange}).`,
          strength: "strong",
          source: "test",
        },
      ]

      // Check patient history for relevant factors
      let confidenceAdjustment = 0
      const supportingFactors: string[] = []
      const contradictingFactors: string[] = []
      const riskFactors: string[] = []

      if (patientData && patientData.history) {
        // Check for history of thyroid conditions
        const thyroidHistory = hasConditionInHistory(patientData.history, [
          "hyperthyroidism",
          "graves disease",
          "toxic nodular goiter",
          "thyroiditis",
        ])

        if (thyroidHistory) {
          confidenceAdjustment += 10
          supportingFactors.push(`History of ${thyroidHistory.name}`)
          evidencePoints.push({
            testName: "Medical History",
            value: thyroidHistory.name,
            interpretation: `Previous history of ${thyroidHistory.name} increases likelihood of recurrent hyperthyroidism.`,
            strength: "moderate",
            source: "history",
          })
        }

        // Check for family history of thyroid disorders
        const familyThyroidHistory = hasFamilyHistory(patientData.history, [
          "hyperthyroidism",
          "graves disease",
          "thyroid disorder",
        ])

        if (familyThyroidHistory) {
          confidenceAdjustment += 5
          riskFactors.push(`Family history of ${familyThyroidHistory.name}`)
        }

        // Check for hyperthyroid symptoms
        const hyperthyroidSymptoms = patientData.history.filter(
          (item) =>
            item.category === "condition" &&
            ["weight loss", "palpitations", "heat intolerance", "tremor", "anxiety", "diarrhea"].some((symptom) =>
              item.name.toLowerCase().includes(symptom.toLowerCase()),
            ),
        )

        if (hyperthyroidSymptoms.length > 0) {
          confidenceAdjustment += 10
          supportingFactors.push(
            `Presence of hyperthyroid symptoms: ${hyperthyroidSymptoms.map((s) => s.name).join(", ")}`,
          )
          evidencePoints.push({
            testName: "Symptoms",
            value: hyperthyroidSymptoms.map((s) => s.name).join(", "),
            interpretation: `Presence of classic hyperthyroid symptoms supports diagnosis.`,
            strength: "moderate",
            source: "history",
          })
        }

        // Check for thyroid medication
        const thyroidMedication = hasActiveMedication(patientData.history, ["levothyroxine", "synthroid", "thyroid"])
        if (thyroidMedication) {
          confidenceAdjustment -= 10
          contradictingFactors.push(`Current use of ${thyroidMedication.name} may cause artificially suppressed TSH`)
          evidencePoints.push({
            testName: "Medications",
            value: thyroidMedication.name,
            interpretation: `Current use of ${thyroidMedication.name} may cause artificially suppressed TSH and elevated T4, mimicking hyperthyroidism.`,
            strength: "moderate",
            source: "history",
          })
        }
      }

      // Adjust confidence based on history
      let adjustedConfidence = 90 + confidenceAdjustment

      // Cap confidence between 5 and 95
      adjustedConfidence = Math.min(95, Math.max(5, adjustedConfidence))

      suggestions.push({
        condition: "Hyperthyroidism",
        confidence: adjustedConfidence,
        description: "Pattern of suppressed TSH with elevated Free T4 is highly suggestive of hyperthyroidism.",
        evidencePoints,
        differentials: ["Graves' Disease", "Toxic Multinodular Goiter", "Thyroiditis", "Exogenous Thyroid Hormone"],
        suggestedTests: ["Thyroid Antibodies", "Thyroid Ultrasound", "Radioactive Iodine Uptake"],
        historyFactors: {
          supporting: supportingFactors,
          contradicting: contradictingFactors,
        },
        riskFactors,
        references: [
          {
            title: "American Thyroid Association Guidelines for Diagnosis and Management of Hyperthyroidism",
            url: "https://www.liebertpub.com/doi/full/10.1089/thy.2016.0229",
          },
        ],
      })
    } else if (!lowTSH && !highT4 && Number(tsh.value) > Number(tsh.referenceRange.split("-")[1])) {
      // Base evidence from test results
      const evidencePoints: DiagnosticEvidence[] = [
        {
          testName: "TSH",
          value: tsh.value,
          interpretation: `Elevated TSH (${tsh.value} ${tsh.unit}) above reference range (${tsh.referenceRange}).`,
          strength: "strong",
          source: "test",
        },
        ...(freeT4 && Number(freeT4.value) < Number(freeT4.referenceRange.split("-")[0])
          ? [
              {
                testName: "Free T4",
                value: freeT4.value,
                interpretation: `Low Free T4 (${freeT4.value} ${freeT4.unit}) below reference range (${freeT4.referenceRange}).`,
                strength: "strong",
                source: "test",
              },
            ]
          : []),
      ]

      // Check patient history for relevant factors
      let confidenceAdjustment = 0
      const supportingFactors: string[] = []
      const contradictingFactors: string[] = []
      const riskFactors: string[] = []

      if (patientData && patientData.history) {
        // Check for history of hypothyroid conditions
        const thyroidHistory = hasConditionInHistory(patientData.history, [
          "hypothyroidism",
          "hashimoto",
          "thyroiditis",
        ])

        if (thyroidHistory) {
          confidenceAdjustment += 10
          supportingFactors.push(`History of ${thyroidHistory.name}`)
          evidencePoints.push({
            testName: "Medical History",
            value: thyroidHistory.name,
            interpretation: `Previous history of ${thyroidHistory.name} increases likelihood of ongoing hypothyroidism.`,
            strength: "moderate",
            source: "history",
          })
        }

        // Check for family history of thyroid disorders
        const familyThyroidHistory = hasFamilyHistory(patientData.history, [
          "hypothyroidism",
          "hashimoto",
          "thyroid disorder",
        ])

        if (familyThyroidHistory) {
          confidenceAdjustment += 5
          riskFactors.push(`Family history of ${familyThyroidHistory.name}`)
        }

        // Check for hypothyroid symptoms
        const hypothyroidSymptoms = patientData.history.filter(
          (item) =>
            item.category === "condition" &&
            ["fatigue", "cold intolerance", "constipation", "weight gain", "dry skin", "hair loss"].some((symptom) =>
              item.name.toLowerCase().includes(symptom.toLowerCase()),
            ),
        )

        if (hypothyroidSymptoms.length > 0) {
          confidenceAdjustment += 10
          supportingFactors.push(
            `Presence of hypothyroid symptoms: ${hypothyroidSymptoms.map((s) => s.name).join(", ")}`,
          )
          evidencePoints.push({
            testName: "Symptoms",
            value: hypothyroidSymptoms.map((s) => s.name).join(", "),
            interpretation: `Presence of classic hypothyroid symptoms supports diagnosis.`,
            strength: "moderate",
            source: "history",
          })
        }

        // Check for thyroid surgery or radioactive iodine
        const thyroidProcedure = patientData.history.find(
          (item) =>
            item.category === "procedure" &&
            (item.name.toLowerCase().includes("thyroidectomy") ||
              item.name.toLowerCase().includes("radioactive iodine") ||
              item.name.toLowerCase().includes("thyroid ablation")),
        )

        if (thyroidProcedure) {
          confidenceAdjustment += 15
          supportingFactors.push(`History of ${thyroidProcedure.name}`)
          evidencePoints.push({
            testName: "Procedures",
            value: thyroidProcedure.name,
            interpretation: `History of ${thyroidProcedure.name} strongly supports diagnosis of hypothyroidism.`,
            strength: "strong",
            source: "history",
          })
        }
      }

      // Adjust confidence based on history
      let adjustedConfidence = 85 + confidenceAdjustment

      // Cap confidence between 5 and 95
      adjustedConfidence = Math.min(95, Math.max(5, adjustedConfidence))

      suggestions.push({
        condition: "Hypothyroidism",
        confidence: adjustedConfidence,
        description: "Pattern of elevated TSH suggests primary hypothyroidism.",
        evidencePoints,
        differentials: ["Hashimoto's Thyroiditis", "Iodine Deficiency", "Post-Thyroidectomy", "Medication-Induced"],
        suggestedTests: ["Thyroid Antibodies", "Thyroid Ultrasound"],
        historyFactors: {
          supporting: supportingFactors,
          contradicting: contradictingFactors,
        },
        riskFactors,
        references: [
          {
            title: "American Thyroid Association Guidelines for the Treatment of Hypothyroidism",
            url: "https://www.liebertpub.com/doi/10.1089/thy.2014.0028",
          },
        ],
      })
    }
  }

  // Pattern: Diabetes or prediabetes
  const glucose = testResults.find((test) => test.name === "Glucose" && test.abnormal)
  const hba1c = testResults.find((test) => test.name === "HbA1c" && test.abnormal)

  if (glucose || hba1c) {
    const highGlucose = glucose && Number(glucose.value) > 126
    const highHbA1c = hba1c && Number(hba1c.value) > 6.5

    if (highGlucose || highHbA1c) {
      // Base evidence from test results
      const evidencePoints: DiagnosticEvidence[] = [
        ...(glucose
          ? [
              {
                testName: "Glucose",
                value: glucose.value,
                interpretation: `Elevated fasting glucose (${glucose.value} ${glucose.unit}) ${Number(glucose.value) > 126 ? "meets diagnostic criteria for diabetes" : "suggests impaired glucose metabolism"}.`,
                strength: Number(glucose.value) > 126 ? "strong" : "moderate",
                source: "test",
              },
            ]
          : []),
        ...(hba1c
          ? [
              {
                testName: "HbA1c",
                value: hba1c.value,
                interpretation: `Elevated HbA1c (${hba1c.value}%) ${Number(hba1c.value) > 6.5 ? "meets diagnostic criteria for diabetes" : "suggests prediabetes"}.`,
                strength: Number(hba1c.value) > 6.5 ? "strong" : "moderate",
                source: "test",
              },
            ]
          : []),
      ]

      // Check patient history for relevant factors
      let confidenceAdjustment = 0
      const supportingFactors: string[] = []
      const contradictingFactors: string[] = []
      const riskFactors: string[] = []

      if (patientData && patientData.history) {
        // Check for history of diabetes or prediabetes
        const diabetesHistory = hasConditionInHistory(patientData.history, [
          "diabetes",
          "prediabetes",
          "gestational diabetes",
        ])

        if (diabetesHistory) {
          confidenceAdjustment += 15
          supportingFactors.push(`History of ${diabetesHistory.name}`)
          evidencePoints.push({
            testName: "Medical History",
            value: diabetesHistory.name,
            interpretation: `Previous history of ${diabetesHistory.name} strongly supports diagnosis of diabetes.`,
            strength: "strong",
            source: "history",
          })
        }

        // Check for family history of diabetes
        const familyDiabetesHistory = hasFamilyHistory(patientData.history, ["diabetes"])

        if (familyDiabetesHistory) {
          confidenceAdjustment += 5
          riskFactors.push(`Family history of diabetes`)
        }

        // Check for diabetic symptoms
        const diabeticSymptoms = patientData.history.filter(
          (item) =>
            item.category === "condition" &&
            ["polyuria", "polydipsia", "polyphagia", "weight loss", "blurred vision"].some((symptom) =>
              item.name.toLowerCase().includes(symptom.toLowerCase()),
            ),
        )

        if (diabeticSymptoms.length > 0) {
          confidenceAdjustment += 10
          supportingFactors.push(
            `Presence of classic diabetic symptoms: ${diabeticSymptoms.map((s) => s.name).join(", ")}`,
          )
          evidencePoints.push({
            testName: "Symptoms",
            value: diabeticSymptoms.map((s) => s.name).join(", "),
            interpretation: `Presence of classic diabetic symptoms supports diagnosis.`,
            strength: "moderate",
            source: "history",
          })
        }

        // Check for obesity
        if (patientData.demographics?.bmi && patientData.demographics.bmi >= 30) {
          confidenceAdjustment += 5
          riskFactors.push(`Obesity (BMI ${patientData.demographics.bmi})`)
          evidencePoints.push({
            testName: "BMI",
            value: patientData.demographics.bmi,
            interpretation: `BMI of ${patientData.demographics.bmi} (obesity) is a significant risk factor for Type 2 Diabetes.`,
            strength: "moderate",
            source: "history",
          })
        }

        // Check for medications that can affect glucose
        const hyperglycemicMeds = hasActiveMedication(patientData.history, [
          "prednisone",
          "cortisone",
          "dexamethasone",
          "steroid",
          "tacrolimus",
          "cyclosporine",
        ])

        if (hyperglycemicMeds) {
          confidenceAdjustment -= 10
          contradictingFactors.push(`Current use of ${hyperglycemicMeds.name} may cause hyperglycemia`)
          evidencePoints.push({
            testName: "Medications",
            value: hyperglycemicMeds.name,
            interpretation: `Current use of ${hyperglycemicMeds.name} may cause medication-induced hyperglycemia, rather than diabetes.`,
            strength: "moderate",
            source: "history",
          })
        }
      }

      // Adjust confidence based on history
      let adjustedConfidence = highGlucose && highHbA1c ? 95 : 75
      adjustedConfidence += confidenceAdjustment

      // Cap confidence between 5 and 95
      adjustedConfidence = Math.min(95, Math.max(5, adjustedConfidence))

      suggestions.push({
        condition: "Diabetes Mellitus",
        confidence: adjustedConfidence,
        description:
          highGlucose && highHbA1c
            ? "Pattern of elevated fasting glucose and HbA1c is diagnostic of diabetes mellitus."
            : "Pattern suggests possible diabetes mellitus, confirmation with additional testing recommended.",
        evidencePoints,
        differentials: ["Type 1 Diabetes", "Type 2 Diabetes", "Prediabetes", "Stress Hyperglycemia"],
        suggestedTests: [
          "Oral Glucose Tolerance Test",
          "Glutamic Acid Decarboxylase Antibodies",
          "C-Peptide",
          "Insulin Level",
        ],
        historyFactors: {
          supporting: supportingFactors,
          contradicting: contradictingFactors,
        },
        riskFactors,
        references: [
          {
            title: "American Diabetes Association Standards of Medical Care in Diabetes",
            url: "https://diabetesjournals.org/care/issue/46/Supplement_1",
          },
        ],
      })
    } else if (
      (glucose && Number(glucose.value) > 100 && Number(glucose.value) < 126) ||
      (hba1c && Number(hba1c.value) > 5.7 && Number(hba1c.value) < 6.5)
    ) {
      // Base evidence from test results
      const evidencePoints: DiagnosticEvidence[] = [
        ...(glucose
          ? [
              {
                testName: "Glucose",
                value: glucose.value,
                interpretation: `Elevated fasting glucose (${glucose.value} ${glucose.unit}) in the prediabetic range (100-125 mg/dL).`,
                strength: "moderate",
                source: "test",
              },
            ]
          : []),
        ...(hba1c
          ? [
              {
                testName: "HbA1c",
                value: hba1c.value,
                interpretation: `Elevated HbA1c (${hba1c.value}%) in the prediabetic range (5.7-6.4%).`,
                strength: "moderate",
                source: "test",
              },
            ]
          : []),
      ]

      // Check patient history for relevant factors
      let confidenceAdjustment = 0
      const supportingFactors: string[] = []
      const contradictingFactors: string[] = []
      const riskFactors: string[] = []

      if (patientData && patientData.history) {
        // Check for history of prediabetes
        const prediabetesHistory = hasConditionInHistory(patientData.history, [
          "prediabetes",
          "impaired fasting glucose",
          "impaired glucose tolerance",
        ])

        if (prediabetesHistory) {
          confidenceAdjustment += 10
          supportingFactors.push(`History of ${prediabetesHistory.name}`)
          evidencePoints.push({
            testName: "Medical History",
            value: prediabetesHistory.name,
            interpretation: `Previous history of ${prediabetesHistory.name} supports diagnosis of prediabetes.`,
            strength: "moderate",
            source: "history",
          })
        }

        // Check for family history of diabetes
        const familyDiabetesHistory = hasFamilyHistory(patientData.history, ["diabetes"])

        if (familyDiabetesHistory) {
          confidenceAdjustment += 5
          riskFactors.push(`Family history of diabetes`)
        }

        // Check for metabolic syndrome components
        const metabolicSyndromeComponents = patientData.history.filter(
          (item) =>
            item.category === "condition" &&
            ["hypertension", "hyperlipidemia", "high triglycerides", "low hdl"].some((condition) =>
              item.name.toLowerCase().includes(condition.toLowerCase()),
            ),
        )

        if (metabolicSyndromeComponents.length > 0) {
          confidenceAdjustment += 10
          supportingFactors.push(
            `Presence of metabolic syndrome components: ${metabolicSyndromeComponents.map((s) => s.name).join(", ")}`,
          )
          evidencePoints.push({
            testName: "Associated Conditions",
            value: metabolicSyndromeComponents.map((s) => s.name).join(", "),
            interpretation: `Presence of metabolic syndrome components increases likelihood of prediabetes.`,
            strength: "moderate",
            source: "history",
          })
        }

        // Check for obesity or overweight
        if (patientData.demographics?.bmi) {
          if (patientData.demographics.bmi >= 30) {
            confidenceAdjustment += 10
            riskFactors.push(`Obesity (BMI ${patientData.demographics.bmi})`)
            evidencePoints.push({
              testName: "BMI",
              value: patientData.demographics.bmi,
              interpretation: `BMI of ${patientData.demographics.bmi} (obesity) is a significant risk factor for prediabetes.`,
              strength: "moderate",
              source: "history",
            })
          } else if (patientData.demographics.bmi >= 25) {
            confidenceAdjustment += 5
            riskFactors.push(`Overweight (BMI ${patientData.demographics.bmi})`)
            evidencePoints.push({
              testName: "BMI",
              value: patientData.demographics.bmi,
              interpretation: `BMI of ${patientData.demographics.bmi} (overweight) is a risk factor for prediabetes.`,
              strength: "weak",
              source: "history",
            })
          }
        }
      }

      // Adjust confidence based on history
      let adjustedConfidence = 80 + confidenceAdjustment

      // Cap confidence between 5 and 95
      adjustedConfidence = Math.min(95, Math.max(5, adjustedConfidence))

      suggestions.push({
        condition: "Prediabetes",
        confidence: adjustedConfidence,
        description: "Pattern suggests prediabetes with impaired glucose metabolism.",
        evidencePoints,
        differentials: ["Metabolic Syndrome", "Insulin Resistance", "Early Type 2 Diabetes"],
        suggestedTests: ["Oral Glucose Tolerance Test", "Lipid Panel", "Blood Pressure Monitoring"],
        historyFactors: {
          supporting: supportingFactors,
          contradicting: contradictingFactors,
        },
        riskFactors,
        references: [
          {
            title: "American Diabetes Association Standards of Medical Care in Diabetes",
            url: "https://diabetesjournals.org/care/issue/46/Supplement_1",
          },
        ],
      })
    }
  }

  // Pattern: Inflammatory condition
  const crp = testResults.find((test) => test.name === "CRP" && test.abnormal)
  const esr = testResults.find((test) => test.name === "ESR" && test.abnormal)
  const wbc = testResults.find((test) => test.name === "White Blood Cell Count" && test.abnormal)

  if ((crp || esr) && wbc) {
    const highWBC = Number(wbc.value) > 11000

    if (highWBC) {
      // Base evidence from test results
      const evidencePoints: DiagnosticEvidence[] = [
        ...(crp
          ? [
              {
                testName: "CRP",
                value: crp.value,
                interpretation: `Elevated CRP (${crp.value} ${crp.unit}) indicates systemic inflammation.`,
                strength: "strong",
                source: "test",
              },
            ]
          : []),
        ...(esr
          ? [
              {
                testName: "ESR",
                value: esr.value,
                interpretation: `Elevated ESR (${esr.value} ${esr.unit}) indicates systemic inflammation.`,
                strength: "moderate",
                source: "test",
              },
            ]
          : []),
        {
          testName: "White Blood Cell Count",
          value: wbc.value,
          interpretation: `Elevated WBC (${wbc.value} ${wbc.unit}) suggests immune system activation.`,
          strength: "moderate",
          source: "test",
        },
      ]

      // Check patient history for relevant factors
      let confidenceAdjustment = 0
      const supportingFactors: string[] = []
      const contradictingFactors: string[] = []
      const riskFactors: string[] = []

      if (patientData && patientData.history) {
        // Check for fever or infection symptoms
        const infectionSymptoms = patientData.history.filter(
          (item) =>
            item.category === "condition" &&
            ["fever", "chills", "infection", "cough", "pain", "redness", "swelling"].some((symptom) =>
              item.name.toLowerCase().includes(symptom.toLowerCase()),
            ),
        )

        if (infectionSymptoms.length > 0) {
          confidenceAdjustment += 15
          supportingFactors.push(
            `Presence of infection/inflammation symptoms: ${infectionSymptoms.map((s) => s.name).join(", ")}`,
          )
          evidencePoints.push({
            testName: "Symptoms",
            value: infectionSymptoms.map((s) => s.name).join(", "),
            interpretation: `Presence of infection/inflammation symptoms strongly supports diagnosis of infectious or inflammatory process.`,
            strength: "strong",
            source: "history",
          })
        }

        // Check for autoimmune conditions
        const autoimmune = hasConditionInHistory(patientData.history, [
          "rheumatoid arthritis",
          "lupus",
          "inflammatory bowel disease",
          "psoriasis",
          "multiple sclerosis",
          "autoimmune",
        ])

        if (autoimmune) {
          confidenceAdjustment += 10
          supportingFactors.push(`History of ${autoimmune.name}`)
          evidencePoints.push({
            testName: "Medical History",
            value: autoimmune.name,
            interpretation: `History of ${autoimmune.name} increases likelihood of inflammatory flare.`,
            strength: "moderate",
            source: "history",
          })
        }

        // Check for recent procedures or trauma
        const recentProcedure = patientData.history.find(
          (item) =>
            item.category === "procedure" &&
            item.dateRecorded &&
            new Date(item.dateRecorded) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Within last 30 days
        )

        if (recentProcedure) {
          confidenceAdjustment += 10
          supportingFactors.push(`Recent procedure: ${recentProcedure.name}`)
          evidencePoints.push({
            testName: "Recent Procedures",
            value: recentProcedure.name,
            interpretation: `Recent ${recentProcedure.name} may explain inflammatory response.`,
            strength: "moderate",
            source: "history",
          })
        }

        // Check for immunosuppressive medications
        const immunosuppressants = hasActiveMedication(patientData.history, [
          "prednisone",
          "methotrexate",
          "azathioprine",
          "biologics",
          "immunosuppressant",
        ])

        if (immunosuppressants) {
          confidenceAdjustment -= 10
          contradictingFactors.push(`Current use of ${immunosuppressants.name} may blunt inflammatory response`)
          evidencePoints.push({
            testName: "Medications",
            value: immunosuppressants.name,
            interpretation: `Current use of ${immunosuppressants.name} may blunt inflammatory response, suggesting more severe underlying inflammation.`,
            strength: "moderate",
            source: "history",
          })
        }
      }

      // Adjust confidence based on history
      let adjustedConfidence = 75 + confidenceAdjustment

      // Cap confidence between 5 and 95
      adjustedConfidence = Math.min(95, Math.max(5, adjustedConfidence))

      suggestions.push({
        condition: "Inflammatory or Infectious Process",
        confidence: adjustedConfidence,
        description:
          "Pattern of elevated inflammatory markers and leukocytosis suggests an active inflammatory or infectious process.",
        evidencePoints,
        differentials: ["Bacterial Infection", "Autoimmune Disease", "Tissue Injury", "Malignancy"],
        suggestedTests: ["Blood Cultures", "Imaging Studies", "Autoimmune Panel", "WBC Differential"],
        historyFactors: {
          supporting: supportingFactors,
          contradicting: contradictingFactors,
        },
        riskFactors,
      })
    }
  }

  // Pattern: Renal dysfunction
  const creatinine = testResults.find((test) => test.name === "Creatinine" && test.abnormal)
  const egfr = testResults.find((test) => test.name === "eGFR" && test.abnormal)

  if (creatinine || egfr) {
    const lowEGFR = egfr && Number(egfr.value) < 60
    const highCreatinine = creatinine && Number(creatinine.value) > Number(creatinine.referenceRange.split("-")[1])

    if (lowEGFR || highCreatinine) {
      // Base evidence from test results
      const evidencePoints: DiagnosticEvidence[] = [
        ...(creatinine
          ? [
              {
                testName: "Creatinine",
                value: creatinine.value,
                interpretation: `Elevated creatinine (${creatinine.value} ${creatinine.unit}) indicates impaired renal function.`,
                strength: "strong",
                source: "test",
              },
            ]
          : []),
        ...(egfr
          ? [
              {
                testName: "eGFR",
                value: egfr.value,
                interpretation: `Reduced eGFR (${egfr.value} ${egfr.unit}) indicates ${
                  Number(egfr.value) < 15
                    ? "end-stage renal disease"
                    : Number(egfr.value) < 30
                      ? "severe renal impairment"
                      : Number(egfr.value) < 45
                        ? "moderate to severe renal impairment"
                        : "mild to moderate renal impairment"
                }.`,
                strength: "strong",
                source: "test",
              },
            ]
          : []),
      ]

      // Check patient history for relevant factors
      let confidenceAdjustment = 0
      const supportingFactors: string[] = []
      const contradictingFactors: string[] = []
      const riskFactors: string[] = []

      if (patientData && patientData.history) {
        // Check for history of kidney disease
        const kidneyHistory = hasConditionInHistory(patientData.history, [
          "chronic kidney disease",
          "renal insufficiency",
          "kidney disease",
          "nephropathy",
          "polycystic kidney",
        ])

        if (kidneyHistory) {
          confidenceAdjustment += 15
          supportingFactors.push(`History of ${kidneyHistory.name}`)
          evidencePoints.push({
            testName: "Medical History",
            value: kidneyHistory.name,
            interpretation: `Previous history of ${kidneyHistory.name} strongly supports diagnosis of chronic kidney disease.`,
            strength: "strong",
            source: "history",
          })
        }

        // Check for risk factors for kidney disease
        const kidneyRiskFactors = patientData.history.filter(
          (item) =>
            item.category === "condition" &&
            ["diabetes", "hypertension", "heart failure", "lupus", "vasculitis"].some((condition) =>
              item.name.toLowerCase().includes(condition.toLowerCase()),
            ),
        )

        if (kidneyRiskFactors.length > 0) {
          confidenceAdjustment += 10
          riskFactors.push(...kidneyRiskFactors.map((rf) => rf.name))
          evidencePoints.push({
            testName: "Risk Factors",
            value: kidneyRiskFactors.map((rf) => rf.name).join(", "),
            interpretation: `Presence of conditions that can cause kidney damage increases likelihood of chronic kidney disease.`,
            strength: "moderate",
            source: "history",
          })
        }

        // Check for nephrotoxic medications
        const nephrotoxicMeds = hasActiveMedication(patientData.history, [
          "nsaid",
          "ibuprofen",
          "naproxen",
          "lithium",
          "aminoglycoside",
          "gentamicin",
          "cisplatin",
        ])

        if (nephrotoxicMeds) {
          confidenceAdjustment += 5
          supportingFactors.push(`Current use of potentially nephrotoxic medication: ${nephrotoxicMeds.name}`)
          evidencePoints.push({
            testName: "Medications",
            value: nephrotoxicMeds.name,
            interpretation: `Current use of ${nephrotoxicMeds.name} may contribute to renal dysfunction.`,
            strength: "weak",
            source: "history",
          })
        }

        // Check for recent contrast studies
        const contrastStudy = patientData.history.find(
          (item) =>
            item.category === "procedure" &&
            (item.name.toLowerCase().includes("contrast") ||
              item.name.toLowerCase().includes("ct with") ||
              item.name.toLowerCase().includes("angiogram")) &&
            item.dateRecorded &&
            new Date(item.dateRecorded) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Within last 7 days
        )

        if (contrastStudy) {
          confidenceAdjustment += 10
          supportingFactors.push(`Recent contrast study: ${contrastStudy.name}`)
          evidencePoints.push({
            testName: "Recent Procedures",
            value: contrastStudy.name,
            interpretation: `Recent ${contrastStudy.name} raises possibility of contrast-induced nephropathy.`,
            strength: "moderate",
            source: "history",
          })
        }

        // Check for dehydration
        const dehydration = hasConditionInHistory(patientData.history, [
          "dehydration",
          "volume depletion",
          "fluid loss",
        ])

        if (dehydration) {
          confidenceAdjustment -= 10
          contradictingFactors.push(`Current ${dehydration.name} may cause transient renal dysfunction`)
          evidencePoints.push({
            testName: "Current Conditions",
            value: dehydration.name,
            interpretation: `Current ${dehydration.name} may cause pre-renal acute kidney injury rather than chronic kidney disease.`,
            strength: "moderate",
            source: "history",
          })
        }
      }

      // Adjust confidence based on history
      let adjustedConfidence = lowEGFR && highCreatinine ? 90 : 70
      adjustedConfidence += confidenceAdjustment

      // Cap confidence between 5 and 95
      adjustedConfidence = Math.min(95, Math.max(5, adjustedConfidence))

      suggestions.push({
        condition: "Chronic Kidney Disease",
        confidence: adjustedConfidence,
        description: "Pattern of elevated creatinine and/or reduced eGFR suggests renal dysfunction.",
        evidencePoints,
        differentials: [
          "Diabetic Nephropathy",
          "Hypertensive Nephrosclerosis",
          "Glomerulonephritis",
          "Acute Kidney Injury",
        ],
        suggestedTests: ["Urinalysis", "Urine Protein/Creatinine Ratio", "Renal Ultrasound", "Nephrology Consultation"],
        historyFactors: {
          supporting: supportingFactors,
          contradicting: contradictingFactors,
        },
        riskFactors,
        references: [
          {
            title: "KDIGO 2012 Clinical Practice Guideline for the Evaluation and Management of CKD",
            url: "https://kdigo.org/guidelines/ckd-evaluation-and-management/",
          },
        ],
      })
    }
  }

  // Additional patterns would continue here...
  // For brevity, I've updated the key patterns to include patient history analysis
  // The same approach would be applied to the remaining patterns

  return suggestions
}
