"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"

type Question = {
  id: string
  text: string
  type: "text" | "boolean" | "multiple" | "scale"
  options?: string[]
  answer?: string | boolean | number
}

type FollowUpQuestionsProps = {
  questions: Question[]
  onAnswerChange: (questionId: string, answer: string | boolean | number) => void
  onComplete: () => void
}

export function FollowUpQuestions({ questions, onAnswerChange, onComplete }: FollowUpQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [completed, setCompleted] = useState(false)

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setCompleted(true)
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const answeredQuestions = questions.filter((q) => q.answer !== undefined).length

  if (completed) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">All Questions Answered</h3>
          <p className="text-muted-foreground mb-4">
            Thank you for providing additional information. This will help with a more accurate assessment.
          </p>
          <Button onClick={() => setCompleted(false)}>Review Answers</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Follow-up Questions</h3>
        <span className="text-sm text-muted-foreground">
          {answeredQuestions}/{questions.length} answered
        </span>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="font-medium">{currentQuestion.text}</p>

            {currentQuestion.type === "text" && (
              <Textarea
                value={(currentQuestion.answer as string) || ""}
                onChange={(e) => onAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Type your answer here..."
              />
            )}

            {currentQuestion.type === "boolean" && (
              <RadioGroup
                value={currentQuestion.answer?.toString()}
                onValueChange={(value) => onAnswerChange(currentQuestion.id, value === "true")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id={`${currentQuestion.id}-yes`} />
                  <Label htmlFor={`${currentQuestion.id}-yes`}>Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id={`${currentQuestion.id}-no`} />
                  <Label htmlFor={`${currentQuestion.id}-no`}>No</Label>
                </div>
              </RadioGroup>
            )}

            {currentQuestion.type === "multiple" && currentQuestion.options && (
              <RadioGroup
                value={currentQuestion.answer as string}
                onValueChange={(value) => onAnswerChange(currentQuestion.id, value)}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${currentQuestion.id}-${index}`} />
                    <Label htmlFor={`${currentQuestion.id}-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === "scale" && (
              <div className="space-y-2">
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={(currentQuestion.answer as number) || 5}
                  onChange={(e) => onAnswerChange(currentQuestion.id, Number.parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 (Lowest)</span>
                  <span>5</span>
                  <span>10 (Highest)</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              Previous
            </Button>
            <Button onClick={handleNext}>{currentQuestionIndex === questions.length - 1 ? "Complete" : "Next"}</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        {questions.map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className={`w-8 h-8 p-0 mx-1 rounded-full ${
              index === currentQuestionIndex
                ? "bg-primary text-primary-foreground"
                : questions[index].answer !== undefined
                  ? "bg-primary/20"
                  : ""
            }`}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  )
}
