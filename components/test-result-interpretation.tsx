"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Minus,
  Info,
  FileText,
  Clipboard,
  ClipboardCheck,
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TestResult {
  id: string
  name: string
  category: string
  value: string | number
  unit: string
  referenceRange: string
  abnormal: boolean
  critical?: boolean
  date: Date
  trend?: "increasing" | "decreasing" | "stable"
  previousResults?: {
    value: string | number
    date: Date
  }[]
}

interface TestResultGroup {
  category: string
  results: TestResult[]
}

interface TestResultInterpretationProps {
  patientId: string
  patientName: string
  testResults: TestResult[]
  onAddToNotes?: (interpretation: string) => void
}

export function TestResultInterpretation({
  patientId,
  patientName,
  testResults,
  onAddToNotes,
}: TestResultInterpretationProps) {
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null)
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)

  // Group test results by category
  const groupedResults: TestResultGroup[] = testResults.reduce((groups: TestResultGroup[], result) => {
    const existingGroup = groups.find((group) => group.category === result.category)
    if (existingGroup) {
      existingGroup.results.push(result)
    } else {
      groups.push({
        category: result.category,
        results: [result],
      })
    }
    return groups
  }, [])

  // Count abnormal and critical results
  const abnormalCount = testResults.filter((result) => result.abnormal).length
  const criticalCount = testResults.filter((result) => result.critical).length

  // Get clinical interpretations for test results
  const getInterpretation = (result: TestResult): string => {
    // This would ideally come from a medical knowledge base
    // For now, we'll use some common interpretations
    const interpretations: Record<string, string> = {
      Hemoglobin: result.abnormal
        ? Number(result.value) < 12
          ? "Low hemoglobin indicates anemia. Consider iron studies, B12/folate levels, and evaluation for blood loss."
          : "Elevated hemoglobin may indicate polycythemia, dehydration, or chronic hypoxic conditions."
        : "Hemoglobin is within normal range, indicating adequate oxygen-carrying capacity.",

      "White Blood Cell Count": result.abnormal
        ? Number(result.value) > 11000
          ? "Elevated WBC count suggests infection, inflammation, or leukemic process. Consider differential count and clinical correlation."
          : "Low WBC count may indicate bone marrow suppression, viral infection, or autoimmune disorder."
        : "WBC count is within normal range, suggesting absence of significant infection or inflammation.",

      "Platelet Count": result.abnormal
        ? Number(result.value) < 150000
          ? "Low platelet count (thrombocytopenia) may indicate bone marrow suppression, immune destruction, or consumption. Monitor for bleeding risk."
          : "Elevated platelet count (thrombocytosis) may be reactive or indicate myeloproliferative disorder."
        : "Platelet count is within normal range, indicating adequate hemostatic function.",

      Glucose: result.abnormal
        ? Number(result.value) > 126
          ? "Elevated fasting glucose is consistent with diabetes mellitus. Consider HbA1c for confirmation and assessment of glycemic control."
          : "Low glucose may indicate hypoglycemia. Evaluate for insulin excess, medications, or liver dysfunction."
        : "Glucose is within normal range, suggesting normal carbohydrate metabolism.",

      HbA1c: result.abnormal
        ? Number(result.value) > 6.5
          ? `HbA1c of ${result.value}% is consistent with diabetes mellitus. This represents an estimated average glucose of ${Math.round(28.7 * Number(result.value) - 46.7)} mg/dL over the past 3 months.`
          : "HbA1c is borderline elevated, suggesting prediabetes. Recommend lifestyle modifications and monitoring."
        : "HbA1c is within normal range, suggesting normal glycemic control over the past 3 months.",

      Creatinine: result.abnormal
        ? "Elevated creatinine suggests impaired renal function. Calculate eGFR and consider renal ultrasound if significantly elevated."
        : "Creatinine is within normal range, suggesting adequate renal function.",

      ALT: result.abnormal
        ? "Elevated ALT indicates hepatocellular injury. Consider viral hepatitis, medication effect, alcohol use, or fatty liver disease."
        : "ALT is within normal range, suggesting absence of significant hepatocellular injury.",

      "Total Cholesterol": result.abnormal
        ? "Elevated total cholesterol increases cardiovascular risk. Evaluate complete lipid panel and assess ASCVD risk."
        : "Total cholesterol is within target range, suggesting well-controlled lipid metabolism.",

      "LDL Cholesterol": result.abnormal
        ? "Elevated LDL cholesterol increases cardiovascular risk. Consider lifestyle modifications and statin therapy based on ASCVD risk."
        : "LDL cholesterol is within target range, suggesting well-controlled lipid metabolism.",

      "HDL Cholesterol": result.abnormal
        ? Number(result.value) < 40
          ? "Low HDL cholesterol increases cardiovascular risk. Encourage exercise and dietary modifications."
          : "HDL cholesterol is above target, which is cardioprotective."
        : "HDL cholesterol is within target range, providing adequate cardioprotection.",

      Triglycerides: result.abnormal
        ? "Elevated triglycerides increase cardiovascular risk and may indicate metabolic syndrome. Recommend dietary modifications and exercise."
        : "Triglycerides are within normal range, suggesting normal lipid metabolism.",

      TSH: result.abnormal
        ? Number(result.value) > 4.5
          ? "Elevated TSH suggests primary hypothyroidism. Check free T4 and consider thyroid antibodies."
          : "Low TSH may indicate hyperthyroidism or inappropriate TSH secretion. Check free T4 and T3."
        : "TSH is within normal range, suggesting normal thyroid function.",

      "Vitamin D": result.abnormal
        ? Number(result.value) < 30
          ? "Low vitamin D levels may contribute to bone health issues. Consider supplementation and repeat testing in 3 months."
          : "Vitamin D is above normal range. Evaluate for excessive supplementation."
        : "Vitamin D is within normal range, suggesting adequate levels for bone health.",

      "Vitamin B12": result.abnormal
        ? Number(result.value) < 200
          ? "Low vitamin B12 may cause neurological symptoms and macrocytic anemia. Consider supplementation and evaluation for malabsorption."
          : "Vitamin B12 is above normal range, which is generally not clinically significant."
        : "Vitamin B12 is within normal range, suggesting adequate levels for neurological function and erythropoiesis.",

      Ferritin: result.abnormal
        ? Number(result.value) < 30
          ? "Low ferritin indicates iron deficiency. Evaluate for causes of blood loss or malabsorption."
          : "Elevated ferritin may indicate iron overload, inflammation, or liver disease."
        : "Ferritin is within normal range, suggesting adequate iron stores.",

      Sodium: result.abnormal
        ? Number(result.value) < 135
          ? "Hyponatremia may be due to fluid overload, SIADH, or medication effect. Evaluate volume status and symptoms."
          : "Hypernatremia suggests dehydration or diabetes insipidus. Evaluate fluid status and intake."
        : "Sodium is within normal range, suggesting normal fluid and electrolyte balance.",

      Potassium: result.abnormal
        ? Number(result.value) < 3.5
          ? "Hypokalemia may cause cardiac arrhythmias. Evaluate for diuretic use, GI losses, or renal losses."
          : "Hyperkalemia may cause cardiac arrhythmias. Evaluate for renal dysfunction, medication effect, or lab error."
        : "Potassium is within normal range, suggesting normal electrolyte balance.",

      Calcium: result.abnormal
        ? Number(result.value) < 8.5
          ? "Hypocalcemia may be due to vitamin D deficiency, hypoparathyroidism, or renal disease. Check PTH and vitamin D."
          : "Hypercalcemia may be due to hyperparathyroidism, malignancy, or other causes. Check PTH and evaluate for symptoms."
        : "Calcium is within normal range, suggesting normal calcium metabolism.",

      Magnesium: result.abnormal
        ? Number(result.value) < 1.8
          ? "Hypomagnesemia may cause cardiac arrhythmias and neuromuscular symptoms. Consider supplementation."
          : "Hypermagnesemia may cause neuromuscular and cardiac effects. Evaluate for renal dysfunction or excessive intake."
        : "Magnesium is within normal range, suggesting normal electrolyte balance.",

      Phosphorus: result.abnormal
        ? Number(result.value) < 2.5
          ? "Hypophosphatemia may be due to malnutrition, refeeding syndrome, or renal losses."
          : "Hyperphosphatemia may be due to renal dysfunction, excessive intake, or cell lysis."
        : "Phosphorus is within normal range, suggesting normal phosphate metabolism.",

      "Uric Acid": result.abnormal
        ? Number(result.value) > 7
          ? "Elevated uric acid may predispose to gout and nephrolithiasis. Consider dietary modifications and medication if symptomatic."
          : "Low uric acid is generally not clinically significant."
        : "Uric acid is within normal range, suggesting normal purine metabolism.",

      eGFR: result.abnormal
        ? Number(result.value) < 60
          ? `Reduced eGFR of ${result.value} mL/min/1.73m² indicates chronic kidney disease. Stage ${
              Number(result.value) >= 45
                ? "3a"
                : Number(result.value) >= 30
                  ? "3b"
                  : Number(result.value) >= 15
                    ? "4"
                    : "5"
            }. Monitor renal function and adjust medication dosages as needed.`
          : "eGFR is borderline reduced. Monitor renal function."
        : "eGFR is within normal range, suggesting normal renal function.",

      Troponin: result.abnormal
        ? result.critical
          ? "Critically elevated troponin indicates myocardial injury. Urgent evaluation for acute coronary syndrome is recommended."
          : "Elevated troponin indicates myocardial injury. Evaluate for acute coronary syndrome, myocarditis, or other causes."
        : "Troponin is within normal range, suggesting absence of significant myocardial injury.",

      BNP: result.abnormal
        ? "Elevated BNP suggests heart failure. Correlate with clinical symptoms and echocardiogram findings."
        : "BNP is within normal range, suggesting absence of significant heart failure.",

      CRP: result.abnormal
        ? "Elevated CRP indicates inflammation. Evaluate for infection, autoimmune disease, or other inflammatory conditions."
        : "CRP is within normal range, suggesting absence of significant inflammation.",

      ESR: result.abnormal
        ? "Elevated ESR indicates inflammation. Evaluate for infection, autoimmune disease, or other inflammatory conditions."
        : "ESR is within normal range, suggesting absence of significant inflammation.",

      PSA: result.abnormal
        ? "Elevated PSA may indicate prostate cancer, prostatitis, or benign prostatic hyperplasia. Consider urology referral."
        : "PSA is within normal range, suggesting low risk of prostate cancer.",

      "CA-125": result.abnormal
        ? "Elevated CA-125 may indicate ovarian cancer, but can also be elevated in other conditions. Consider gynecology referral."
        : "CA-125 is within normal range, suggesting low risk of ovarian cancer.",

      CEA: result.abnormal
        ? "Elevated CEA may indicate colorectal cancer, but can also be elevated in other conditions. Consider gastroenterology referral."
        : "CEA is within normal range, suggesting low risk of colorectal cancer.",

      AFP: result.abnormal
        ? "Elevated AFP may indicate hepatocellular carcinoma, testicular cancer, or other conditions. Consider appropriate imaging."
        : "AFP is within normal range, suggesting low risk of hepatocellular carcinoma or testicular cancer.",
    }

    return (
      interpretations[result.name] ||
      (result.abnormal
        ? `${result.name} is outside the reference range. Clinical correlation is recommended.`
        : `${result.name} is within normal range.`)
    )
  }

  // Get recommended follow-up actions for abnormal results
  const getRecommendedActions = (result: TestResult): string[] => {
    // This would ideally come from a medical knowledge base
    // For now, we'll use some common recommendations
    if (!result.abnormal) return []

    const actions: Record<string, string[]> = {
      Hemoglobin: [
        Number(result.value) < 12
          ? "Consider iron studies, B12/folate levels, and peripheral blood smear"
          : "Consider arterial blood gas and pulse oximetry",
        "Repeat CBC in 4-6 weeks to monitor trend",
      ],

      "White Blood Cell Count": [
        Number(result.value) > 11000
          ? "Order WBC differential to characterize leukocytosis"
          : "Consider viral studies and autoimmune workup",
        "Repeat CBC in 2-4 weeks to monitor trend",
      ],

      "Platelet Count": [
        Number(result.value) < 150000
          ? "Consider peripheral blood smear and hematology consultation if <50,000"
          : "Consider inflammatory markers and peripheral blood smear",
        "Repeat CBC in 2-4 weeks to monitor trend",
      ],

      Glucose: [
        Number(result.value) > 126
          ? "Order HbA1c for confirmation of diabetes mellitus"
          : "Consider 72-hour fast if hypoglycemia is suspected",
        "Recommend dietary counseling and lifestyle modifications",
      ],

      HbA1c: [
        Number(result.value) > 6.5
          ? "Initiate or adjust diabetes management plan"
          : "Recommend lifestyle modifications for prediabetes",
        "Repeat HbA1c in 3 months to monitor glycemic control",
      ],

      Creatinine: [
        "Calculate eGFR using CKD-EPI or MDRD formula",
        "Consider renal ultrasound if significantly elevated",
        "Review medication list for nephrotoxic agents",
      ],

      ALT: [
        "Check other liver function tests (AST, ALP, bilirubin)",
        "Consider viral hepatitis panel, alcohol use assessment",
        "Consider liver ultrasound if persistently elevated",
      ],

      "Total Cholesterol": [
        "Evaluate complete lipid panel (LDL, HDL, triglycerides)",
        "Assess ASCVD risk using appropriate calculator",
        "Consider statin therapy based on risk assessment",
      ],

      "LDL Cholesterol": [
        "Assess ASCVD risk using appropriate calculator",
        "Consider statin therapy based on risk assessment",
        "Recommend dietary modifications and exercise",
      ],

      "HDL Cholesterol": [
        Number(result.value) < 40
          ? "Encourage regular aerobic exercise and dietary modifications"
          : "Continue current lifestyle measures",
        "Repeat lipid panel in 3-6 months",
      ],

      Triglycerides: [
        "Recommend dietary modifications (reduce simple carbohydrates)",
        "Assess for metabolic syndrome",
        "Consider fibrate therapy if significantly elevated",
      ],

      TSH: [
        Number(result.value) > 4.5 ? "Check free T4 and consider thyroid antibodies" : "Check free T4 and T3",
        "Consider endocrinology referral if significantly abnormal",
      ],

      "Vitamin D": [
        Number(result.value) < 30
          ? "Recommend vitamin D supplementation (typically 1000-2000 IU daily)"
          : "Evaluate for excessive supplementation",
        "Repeat vitamin D level in 3 months",
      ],

      "Vitamin B12": [
        Number(result.value) < 200
          ? "Recommend B12 supplementation and evaluate for malabsorption"
          : "No specific action needed for elevated levels",
        "Consider methylmalonic acid level for borderline results",
      ],

      Ferritin: [
        Number(result.value) < 30
          ? "Evaluate for causes of iron deficiency (GI blood loss, menorrhagia)"
          : "Check transferrin saturation to distinguish between iron overload and inflammation",
        "Consider hematology referral for significantly abnormal results",
      ],

      Sodium: [
        Number(result.value) < 135
          ? "Evaluate volume status, medication effects, and consider SIADH workup"
          : "Evaluate fluid status and intake, consider diabetes insipidus workup",
        "Monitor electrolytes closely until normalized",
      ],

      Potassium: [
        Number(result.value) < 3.5
          ? "Evaluate for diuretic use, GI losses, or renal losses"
          : "Evaluate for renal dysfunction, medication effect, or lab error",
        "Obtain ECG if significantly abnormal",
        "Monitor electrolytes closely until normalized",
      ],

      Calcium: [
        Number(result.value) < 8.5 ? "Check PTH and vitamin D levels" : "Check PTH and evaluate for malignancy",
        "Consider endocrinology referral for significantly abnormal results",
      ],

      Troponin: [
        result.critical
          ? "Immediate cardiology consultation and ECG"
          : "Serial troponin measurements, ECG, and cardiology consultation",
        "Consider stress testing or coronary angiography based on clinical presentation",
      ],

      BNP: [
        "Correlate with clinical symptoms and echocardiogram findings",
        "Consider cardiology referral for heart failure management",
        "Optimize fluid status and heart failure medications",
      ],

      CRP: [
        "Evaluate for infection, autoimmune disease, or other inflammatory conditions",
        "Consider more specific testing based on clinical presentation",
        "Repeat in 2-4 weeks to monitor trend",
      ],

      PSA: [
        "Consider urology referral for prostate biopsy",
        "Evaluate for prostatitis or benign prostatic hyperplasia",
        "Repeat PSA in 1-3 months to confirm elevation",
      ],
    }

    return actions[result.name] || ["Clinical correlation is recommended", "Consider repeat testing to confirm result"]
  }

  // Get potential diagnoses associated with abnormal results
  const getPotentialDiagnoses = (result: TestResult): string[] => {
    if (!result.abnormal) return []

    // This would ideally come from a medical knowledge base
    // For now, we'll use some common associations
    const diagnoses: Record<string, string[]> = {
      Hemoglobin: [
        Number(result.value) < 12
          ? "Iron deficiency anemia, B12/folate deficiency, chronic disease anemia, blood loss"
          : "Polycythemia vera, dehydration, chronic hypoxic conditions, smoking",
      ],

      "White Blood Cell Count": [
        Number(result.value) > 11000
          ? "Bacterial infection, inflammation, leukemia, stress response, medication effect"
          : "Viral infection, bone marrow suppression, autoimmune disorders, HIV",
      ],

      "Platelet Count": [
        Number(result.value) < 150000
          ? "Immune thrombocytopenia, bone marrow suppression, DIC, hypersplenism"
          : "Reactive thrombocytosis, essential thrombocythemia, iron deficiency",
      ],

      Glucose: [
        Number(result.value) > 126
          ? "Diabetes mellitus, stress hyperglycemia, medication effect, pancreatitis"
          : "Insulinoma, medication effect, adrenal insufficiency, liver disease",
      ],

      HbA1c: [
        Number(result.value) > 6.5
          ? "Diabetes mellitus, prediabetes"
          : "Prediabetes, recent improvement in glycemic control",
      ],

      Creatinine: ["Acute kidney injury, chronic kidney disease, dehydration, medication effect, rhabdomyolysis"],

      ALT: ["Viral hepatitis, medication-induced liver injury, alcohol-related liver disease, NAFLD/NASH"],

      "Total Cholesterol": ["Familial hypercholesterolemia, hypothyroidism, nephrotic syndrome, cholestasis"],

      "LDL Cholesterol": ["Familial hypercholesterolemia, hypothyroidism, nephrotic syndrome"],

      "HDL Cholesterol": [
        Number(result.value) < 40
          ? "Metabolic syndrome, diabetes mellitus, sedentary lifestyle, smoking"
          : "Genetic factors, regular exercise, moderate alcohol consumption",
      ],

      Triglycerides: ["Metabolic syndrome, diabetes mellitus, alcohol use, hypothyroidism, medication effect"],

      TSH: [
        Number(result.value) > 4.5
          ? "Primary hypothyroidism, subclinical hypothyroidism, recovery from illness"
          : "Hyperthyroidism, subclinical hyperthyroidism, central hypothyroidism",
      ],

      "Vitamin D": [
        Number(result.value) < 30
          ? "Inadequate sun exposure, malabsorption, chronic kidney disease, obesity"
          : "Excessive supplementation, granulomatous disorders, Williams syndrome",
      ],

      "Vitamin B12": [
        Number(result.value) < 200
          ? "Pernicious anemia, malabsorption, strict vegetarian diet, gastric surgery"
          : "Excessive supplementation, liver disease, myeloproliferative disorders",
      ],

      Ferritin: [
        Number(result.value) < 30
          ? "Iron deficiency, blood loss, malabsorption, pregnancy"
          : "Hemochromatosis, inflammation, liver disease, malignancy",
      ],

      Sodium: [
        Number(result.value) < 135
          ? "SIADH, heart failure, cirrhosis, diuretic use, adrenal insufficiency"
          : "Dehydration, diabetes insipidus, excessive sodium intake",
      ],

      Potassium: [
        Number(result.value) < 3.5
          ? "Diuretic use, GI losses, renal losses, alkalosis, insulin effect"
          : "Renal failure, medication effect, acidosis, cell lysis, pseudohyperkalemia",
      ],

      Calcium: [
        Number(result.value) < 8.5
          ? "Vitamin D deficiency, hypoparathyroidism, renal disease, malabsorption"
          : "Hyperparathyroidism, malignancy, vitamin D toxicity, thiazide diuretics",
      ],

      Troponin: ["Myocardial infarction, myocarditis, cardiac contusion, renal failure, sepsis"],

      BNP: ["Heart failure, pulmonary embolism, renal failure, ARDS, sepsis"],

      CRP: ["Infection, inflammation, autoimmune disease, malignancy, tissue injury"],

      PSA: ["Prostate cancer, prostatitis, benign prostatic hyperplasia, recent instrumentation"],
    }

    return diagnoses[result.name] || ["Various conditions may be associated with this abnormality"]
  }

  // Generate a comprehensive interpretation for a test result
  const generateComprehensiveInterpretation = (result: TestResult): string => {
    let interpretation = `Test: ${result.name}\n`
    interpretation += `Value: ${result.value} ${result.unit} (Reference Range: ${result.referenceRange})\n`
    interpretation += `Date: ${result.date.toLocaleDateString()}\n\n`

    interpretation += `Clinical Interpretation: ${getInterpretation(result)}\n\n`

    if (result.trend) {
      interpretation += `Trend: ${result.trend.charAt(0).toUpperCase() + result.trend.slice(1)} compared to previous results.\n\n`
    }

    const potentialDiagnoses = getPotentialDiagnoses(result)
    if (potentialDiagnoses.length > 0) {
      interpretation += "Potential Associated Conditions:\n"
      potentialDiagnoses.forEach((diagnosis) => {
        interpretation += `- ${diagnosis}\n`
      })
      interpretation += "\n"
    }

    const recommendedActions = getRecommendedActions(result)
    if (recommendedActions.length > 0) {
      interpretation += "Recommended Actions:\n"
      recommendedActions.forEach((action) => {
        interpretation += `- ${action}\n`
      })
    }

    return interpretation
  }

  // Handle copying interpretation to clipboard
  const handleCopyToClipboard = () => {
    if (!selectedResult) return

    const interpretation = generateComprehensiveInterpretation(selectedResult)
    navigator.clipboard.writeText(interpretation)
    setCopiedToClipboard(true)

    setTimeout(() => {
      setCopiedToClipboard(false)
    }, 2000)
  }

  // Handle adding interpretation to clinical notes
  const handleAddToNotes = () => {
    if (!selectedResult || !onAddToNotes) return

    const interpretation = generateComprehensiveInterpretation(selectedResult)
    onAddToNotes(interpretation)
  }

  // Render trend indicator
  const renderTrendIndicator = (trend?: string) => {
    if (!trend) return null

    if (trend === "increasing") {
      return <TrendingUp className="h-4 w-4 text-red-500" />
    } else if (trend === "decreasing") {
      return <TrendingDown className="h-4 w-4 text-green-500" />
    } else {
      return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  // Render value status indicator
  const renderValueStatus = (result: TestResult) => {
    if (result.critical) {
      return <AlertCircle className="h-4 w-4 text-red-500" />
    } else if (result.abnormal) {
      return <AlertTriangle className="h-4 w-4 text-amber-500" />
    } else {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
  }

  // Format reference range for display
  const formatReferenceRange = (range: string) => {
    // Handle numeric ranges like "3.5-5.0"
    if (/^\d+(\.\d+)?-\d+(\.\d+)?$/.test(range)) {
      const [min, max] = range.split("-")
      return (
        <span className="flex items-center gap-1">
          <span>{min}</span>
          <ArrowRight className="h-3 w-3" />
          <span>{max}</span>
        </span>
      )
    }

    // Handle ranges with operators like ">40" or "<200"
    if (/^[<>]\d+(\.\d+)?$/.test(range)) {
      const operator = range.charAt(0)
      const value = range.substring(1)
      return (
        <span className="flex items-center gap-0.5">
          {operator === ">" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          <span>{value}</span>
        </span>
      )
    }

    // Default case
    return range
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Test Result Interpretation</span>
          {(abnormalCount > 0 || criticalCount > 0) && (
            <div className="flex items-center gap-2">
              {criticalCount > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {criticalCount} Critical
                </Badge>
              )}
              {abnormalCount > 0 && (
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  {abnormalCount} Abnormal
                </Badge>
              )}
            </div>
          )}
        </CardTitle>
        <CardDescription>Clinical interpretation of laboratory and diagnostic test results</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="byCategory" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="byCategory">By Category</TabsTrigger>
            <TabsTrigger value="byStatus">By Status</TabsTrigger>
          </TabsList>

          <TabsContent value="byCategory" className="space-y-4 pt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {groupedResults.map((group) => (
                  <div key={group.category} className="space-y-2">
                    <h3 className="font-medium text-sm text-muted-foreground">{group.category}</h3>
                    <Separator />
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[30%]">Test</TableHead>
                          <TableHead className="w-[20%]">Result</TableHead>
                          <TableHead className="w-[20%]">Reference Range</TableHead>
                          <TableHead className="w-[15%]">Date</TableHead>
                          <TableHead className="w-[15%]">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.results.map((result) => (
                          <TableRow
                            key={result.id}
                            className={`cursor-pointer ${result.critical ? "bg-red-50" : result.abnormal ? "bg-amber-50" : ""}`}
                            onClick={() => setSelectedResult(result)}
                          >
                            <TableCell className="font-medium">{result.name}</TableCell>
                            <TableCell className="flex items-center gap-1">
                              <span>
                                {result.value} {result.unit}
                              </span>
                              {renderTrendIndicator(result.trend)}
                            </TableCell>
                            <TableCell>{formatReferenceRange(result.referenceRange)}</TableCell>
                            <TableCell>{result.date.toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {renderValueStatus(result)}
                                <span className="sr-only">
                                  {result.critical ? "Critical" : result.abnormal ? "Abnormal" : "Normal"}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="byStatus" className="space-y-4 pt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {criticalCount > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Critical Results
                    </h3>
                    <Separator className="bg-red-200" />
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[30%]">Test</TableHead>
                          <TableHead className="w-[20%]">Result</TableHead>
                          <TableHead className="w-[20%]">Reference Range</TableHead>
                          <TableHead className="w-[15%]">Date</TableHead>
                          <TableHead className="w-[15%]">Category</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {testResults
                          .filter((r) => r.critical)
                          .map((result) => (
                            <TableRow
                              key={result.id}
                              className="cursor-pointer bg-red-50"
                              onClick={() => setSelectedResult(result)}
                            >
                              <TableCell className="font-medium">{result.name}</TableCell>
                              <TableCell className="flex items-center gap-1">
                                <span>
                                  {result.value} {result.unit}
                                </span>
                                {renderTrendIndicator(result.trend)}
                              </TableCell>
                              <TableCell>{formatReferenceRange(result.referenceRange)}</TableCell>
                              <TableCell>{result.date.toLocaleDateString()}</TableCell>
                              <TableCell>{result.category}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {abnormalCount - criticalCount > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-amber-500 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      Abnormal Results
                    </h3>
                    <Separator className="bg-amber-200" />
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[30%]">Test</TableHead>
                          <TableHead className="w-[20%]">Result</TableHead>
                          <TableHead className="w-[20%]">Reference Range</TableHead>
                          <TableHead className="w-[15%]">Date</TableHead>
                          <TableHead className="w-[15%]">Category</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {testResults
                          .filter((r) => r.abnormal && !r.critical)
                          .map((result) => (
                            <TableRow
                              key={result.id}
                              className="cursor-pointer bg-amber-50"
                              onClick={() => setSelectedResult(result)}
                            >
                              <TableCell className="font-medium">{result.name}</TableCell>
                              <TableCell className="flex items-center gap-1">
                                <span>
                                  {result.value} {result.unit}
                                </span>
                                {renderTrendIndicator(result.trend)}
                              </TableCell>
                              <TableCell>{formatReferenceRange(result.referenceRange)}</TableCell>
                              <TableCell>{result.date.toLocaleDateString()}</TableCell>
                              <TableCell>{result.category}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-green-500 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Normal Results
                  </h3>
                  <Separator className="bg-green-200" />
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30%]">Test</TableHead>
                        <TableHead className="w-[20%]">Result</TableHead>
                        <TableHead className="w-[20%]">Reference Range</TableHead>
                        <TableHead className="w-[15%]">Date</TableHead>
                        <TableHead className="w-[15%]">Category</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testResults
                        .filter((r) => !r.abnormal)
                        .map((result) => (
                          <TableRow
                            key={result.id}
                            className="cursor-pointer"
                            onClick={() => setSelectedResult(result)}
                          >
                            <TableCell className="font-medium">{result.name}</TableCell>
                            <TableCell className="flex items-center gap-1">
                              <span>
                                {result.value} {result.unit}
                              </span>
                              {renderTrendIndicator(result.trend)}
                            </TableCell>
                            <TableCell>{formatReferenceRange(result.referenceRange)}</TableCell>
                            <TableCell>{result.date.toLocaleDateString()}</TableCell>
                            <TableCell>{result.category}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {selectedResult && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-4 w-full">
                <Info className="mr-2 h-4 w-4" />
                View Detailed Interpretation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>
                    {selectedResult.name} - {selectedResult.value} {selectedResult.unit}
                  </span>
                  <Badge
                    variant={selectedResult.critical ? "destructive" : selectedResult.abnormal ? "outline" : "default"}
                    className={
                      selectedResult.abnormal && !selectedResult.critical
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : ""
                    }
                  >
                    {selectedResult.critical ? "Critical" : selectedResult.abnormal ? "Abnormal" : "Normal"}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span>Performed on {selectedResult.date.toLocaleDateString()}</span>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Clinical Interpretation</h3>
                  <p className="text-sm">{getInterpretation(selectedResult)}</p>

                  {selectedResult.previousResults && selectedResult.previousResults.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Previous Results</h3>
                      <ul className="text-sm space-y-1">
                        {selectedResult.previousResults.map((prev, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span>
                              {prev.value} {selectedResult.unit}
                            </span>
                            <span className="text-muted-foreground">({prev.date.toLocaleDateString()})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedResult.abnormal && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Potential Associated Conditions</h3>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {getPotentialDiagnoses(selectedResult).map((diagnosis, index) => (
                          <li key={index}>{diagnosis}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  {selectedResult.abnormal && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Recommended Actions</h3>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {getRecommendedActions(selectedResult).map((action, index) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Reference Information</h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reference Range:</span>
                        <span>{selectedResult.referenceRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span>{selectedResult.category}</span>
                      </div>
                      {selectedResult.trend && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Trend:</span>
                          <span className="flex items-center gap-1">
                            {renderTrendIndicator(selectedResult.trend)}
                            {selectedResult.trend.charAt(0).toUpperCase() + selectedResult.trend.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={handleCopyToClipboard} className="flex items-center gap-2">
                  {copiedToClipboard ? (
                    <>
                      <ClipboardCheck className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-4 w-4" />
                      Copy Interpretation
                    </>
                  )}
                </Button>
                {onAddToNotes && (
                  <Button onClick={handleAddToNotes} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Add to Clinical Notes
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        <TooltipProvider>
          <div className="flex items-center justify-between mt-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>Normal</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-amber-500" />
                <span>Abnormal</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-red-500" />
                <span>Critical</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-red-500" />
                  <span>Increasing</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Value is increasing compared to previous results</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <span>Decreasing</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Value is decreasing compared to previous results</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1">
                  <Minus className="h-3 w-3 text-gray-500" />
                  <span>Stable</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Value is stable compared to previous results</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
