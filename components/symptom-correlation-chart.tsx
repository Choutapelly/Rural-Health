"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type PatientSymptomData, processSymptomCorrelationData } from "@/utils/chart-data"

type SymptomCorrelationChartProps = {
  patientData: PatientSymptomData
  height?: number
}

export function SymptomCorrelationChart({ patientData, height = 300 }: SymptomCorrelationChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<any>(null)

  useEffect(() => {
    if (!chartRef.current || Object.keys(patientData.symptoms).length < 2) return

    const renderChart = async () => {
      // Dynamically import Chart.js and the heatmap plugin
      const { Chart, LinearScale, CategoryScale, Tooltip, Legend } = await import("chart.js")
      const { MatrixController, MatrixElement } = await import("chartjs-chart-matrix")

      // Register required components
      Chart.register(MatrixController, MatrixElement, LinearScale, CategoryScale, Tooltip, Legend)

      // Process data for the correlation matrix
      const { symptoms, correlationMatrix } = processSymptomCorrelationData(patientData)

      // Skip if not enough symptoms
      if (symptoms.length < 2) return

      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      // Create dataset for the correlation matrix
      const data = []
      for (let i = 0; i < symptoms.length; i++) {
        for (let j = 0; j < symptoms.length; j++) {
          data.push({
            x: symptoms[j],
            y: symptoms[i],
            v: correlationMatrix[i][j],
          })
        }
      }

      const dataset = {
        label: "Symptom Correlation",
        data,
        width: ({ chart }) => chart.chartArea.width / symptoms.length - 1,
        height: ({ chart }) => chart.chartArea.height / symptoms.length - 1,
        backgroundColor: ({ raw }) => getCorrelationColor(raw?.v || 0),
      }

      // Create new chart
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "matrix",
          data: {
            datasets: [dataset],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                type: "category",
                labels: symptoms,
                ticks: {
                  maxRotation: 90,
                  minRotation: 45,
                },
                grid: {
                  display: false,
                },
              },
              y: {
                type: "category",
                labels: symptoms,
                offset: true,
                grid: {
                  display: false,
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  title() {
                    return "Correlation"
                  },
                  label(context) {
                    const v = context.dataset.data[context.dataIndex]
                    return [`${v.y} ↔ ${v.x}`, `Correlation: ${(v.v).toFixed(2)}`]
                  },
                },
              },
              legend: {
                display: false,
              },
            },
          },
        })
      }
    }

    renderChart()

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [patientData])

  // Helper function to get color based on correlation value
  const getCorrelationColor = (correlation: number) => {
    if (correlation === 1) return "rgba(255, 255, 255, 0.2)" // Diagonal (self-correlation)
    if (correlation >= 0.7) return "rgba(244, 63, 94, 0.7)" // Strong positive (rose)
    if (correlation >= 0.3) return "rgba(245, 158, 11, 0.7)" // Moderate positive (amber)
    if (correlation >= -0.3) return "rgba(229, 231, 235, 0.7)" // Weak/no correlation (gray)
    if (correlation >= -0.7) return "rgba(59, 130, 246, 0.5)" // Moderate negative (blue)
    return "rgba(59, 130, 246, 0.8)" // Strong negative (darker blue)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Correlation</CardTitle>
        <CardDescription>Analyzing relationships between different symptoms</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          {Object.keys(patientData.symptoms).length >= 2 ? (
            <canvas ref={chartRef} />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Need at least two symptoms to analyze correlations
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
