"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type PatientSymptomData, type TimeRange, processSymptomTrendData } from "@/utils/chart-data"

type SymptomTrendChartProps = {
  patientData: PatientSymptomData
  selectedSymptoms: string[]
  timeRange: TimeRange
  height?: number
}

export function SymptomTrendChart({ patientData, selectedSymptoms, timeRange, height = 300 }: SymptomTrendChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<any>(null)

  useEffect(() => {
    if (!chartRef.current || selectedSymptoms.length === 0) return

    const renderChart = async () => {
      // Dynamically import Chart.js to avoid SSR issues
      const {
        Chart,
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        TimeScale,
        Title,
        Tooltip,
        Legend,
        CategoryScale,
      } = await import("chart.js")

      // Register required components
      Chart.register(
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        TimeScale,
        Title,
        Tooltip,
        Legend,
        CategoryScale,
      )

      // Process data for the chart
      const chartData = processSymptomTrendData(patientData, selectedSymptoms, timeRange)

      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      // Create new chart
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "line",
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 10,
                title: {
                  display: true,
                  text: "Severity (1-10)",
                },
                ticks: {
                  stepSize: 1,
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Date",
                },
              },
            },
            plugins: {
              tooltip: {
                mode: "index",
                intersect: false,
              },
              legend: {
                position: "top",
                labels: {
                  usePointStyle: true,
                },
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
  }, [patientData, selectedSymptoms, timeRange])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Severity Trends</CardTitle>
        <CardDescription>Tracking symptom severity over time for {patientData.patientName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          {selectedSymptoms.length > 0 ? (
            <canvas ref={chartRef} />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Select symptoms to display trend data
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
