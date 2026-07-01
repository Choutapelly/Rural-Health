import { NextRequest, NextResponse } from 'next/server'

// Mock user database - in production this would be a real database
const users: Record<string, any> = {}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, password, role, specialty, languages, location, dob, license } = data

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    if (users[email]) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Create user object
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password, // In production, this should be hashed
      role,
      createdAt: new Date().toISOString(),
      ...(role === 'doctor' && { specialty, languages, license }),
      ...(role === 'patient' && { location, dob }),
    }

    // Store user (in production this would be database)
    users[email] = user

    return NextResponse.json(
      { 
        success: true, 
        message: 'User registered successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
