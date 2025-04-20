"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type PatientSymptomData, type TimeRange, processSymptomHeatmapData } from "@/utils/chart-data"

type SymptomHeatmapProps = {
  patientData: PatientSymptomData
  timeRange: TimeRange
  height?: number
}

export function SymptomHeatmap({ patientData, timeRange, height = 300 }: SymptomHeatmapProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<any>(null)

  useEffect(() => {
    if (!chartRef.current || Object.keys(patientData.symptoms).length === 0) return

    const renderChart = async () => {
      // Dynamically import Chart.js and the heatmap plugin
      const { Chart, LinearScale, CategoryScale, Tooltip, Legend } = await import("chart.js")
      const { MatrixController, MatrixElement } = await import("chartjs-chart-matrix")

      // Register required components
      Chart.register(MatrixController, MatrixElement, LinearScale, CategoryScale, Tooltip, Legend)

      // Process data for the heatmap
      const { symptoms, dates, values } = processSymptomHeatmapData(patientData, timeRange)

      // Skip if no data
      if (symptoms.length === 0 || dates.length === 0) return

      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      // Create dataset for the heatmap
      const dataset = {
        label: "Symptom Severity",
        data: values.map((v) => ({
          x: v.date,
          y: v.symptom,
          v: v.severity,
        })),
        width: ({ chart }) => chart.chartArea.width / dates.length - 1,
        height: ({ chart }) => chart.chartArea.height / symptoms.length - 1,
        backgroundColor: ({ raw }) => getHeatmapColor(raw?.v || 0),
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
                labels: dates,
                ticks: {
                  maxRotation: 90,
                  minRotation: 0,
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
                    return ""
                  },
                  label(context) {
                    const v = context.dataset.data[context.dataIndex]
                    return [`Symptom: ${v.y}`, `Date: ${v.x}`, `Severity: ${v.v}/10`]
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
  }, [patientData, timeRange])

  // Helper function to get color based on severity
  const getHeatmapColor = (severity: number) => {
    if (severity === 0) return "rgba(255, 255, 255, 0.2)"
    if (severity <= 3) return "rgba(16, 185, 129, 0.7)" // Green
    if (severity <= 6) return "rgba(245, 158, 11, 0.7)" // Amber
    return "rgba(244, 63, 94, 0.7)" // Rose
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Heatmap</CardTitle>
        <CardDescription>Visual representation of symptom severity over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          {Object.keys(patientData.symptoms).length > 0 ? (
            <canvas ref={chartRef} />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No symptom data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
