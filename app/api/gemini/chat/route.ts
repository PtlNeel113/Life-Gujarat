import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'

// Shared server-side Gemini client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.')
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      messages = [],
      prompt,
      model = 'gemini-3.8-flash',
      rolePersona = 'coach',
      userContext,
    } = body

    // Validate model selection
    const allowedModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-4-argon']
    const selectedModel = allowedModels.includes(model) ? model : 'gemini-3.8-flash'

    // Craft specialized system instruction based on selected role persona
    let systemInstruction = `You are the official LiFE Gujarat AI Sustainability & Energy Coach, deployed under the Government of Gujarat's Climate Change Department and Mission LiFE initiative.
Your mission is to guide Gujarat citizens on:
1. Practical household energy efficiency actions (BEE 24°C thermostat standard, BLDC ceiling fan retrofits, avoiding standby power).
2. Gujarat power utilities (UGVCL, DGVCL, MGVCL, PGVCL, Torrent Power) and tariff slabs.
3. Rooftop solar under the PM Surya Ghar: Muft Bijli Yojana, net metering rules, and subsidies.
4. Carbon footprint reduction grounded in the Central Electricity Authority (CEA) standard grid emission factor (0.716 kg CO₂/kWh).

Tone: Encouraging, knowledgeable, clear, culturally attuned to Gujarat (occasional greetings like "Namaste"), practical, and concise. Format responses with clean bullet points and clear takeaways.`

    if (rolePersona === 'solar') {
      systemInstruction = `You are the PM Surya Ghar Rooftop Solar Technical Specialist for Gujarat.
Specialized in:
- System capacity sizing (1 kW to 10+ kW based on monthly electricity consumption).
- Subsidies under PM Surya Ghar (₹30,000 for 1 kW, ₹60,000 for 2 kW, ₹78,000 for 3 kW+).
- Gujarat DISCOM net metering procedures, grid interconnection, and generation run-rate (~4 kWh per kW/day, ~1400-1500 kWh/year in Gujarat's high solar irradiance).
- Return on Investment (ROI) and typical 3.5 to 4.5 year payback periods.

Tone: Technical, accurate, financial-savvy, and straightforward.`
    } else if (rolePersona === 'auditor') {
      systemInstruction = `You are the Gujarat Electricity Tariff & Home Energy Auditor.
Specialized in:
- Dissecting household electricity bills and identifying slab escalation (FPPPA charges, fixed charges, electricity duty).
- Power factor optimization, connected load limits, and air conditioning heat-load calculations.
- Quantifying rupee savings from BEE 5-star appliance transitions and vampire phantom power isolation.
- Calculating precise kilowatt-hour and greenhouse gas mitigation metrics.

Tone: Analytical, numbers-driven, precise, and actionable.`
    }

    if (userContext) {
      systemInstruction += `\n\nActive Citizen Context:
- Name: ${userContext.name || 'Citizen'}
- District: ${userContext.district || 'Ahmedabad'}, Gujarat
- Utility DISCOM: ${userContext.discom || 'UGVCL'}
- Household Size: ${userContext.householdMembers || 4} members
- Recent Consumption: ${userContext.latestKwh || 260} kWh/month
- LiFE Points Balance: ${userContext.points || 420}`
    }

    // Assemble multi-turn contents
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []

    if (Array.isArray(messages) && messages.length > 0) {
      for (const msg of messages) {
        if (!msg.text || !msg.text.trim()) continue
        const role = msg.sender === 'user' ? 'user' : 'model'
        contents.push({
          role,
          parts: [{ text: msg.text.trim() }],
        })
      }
    } else if (prompt) {
      contents.push({
        role: 'user',
        parts: [{ text: prompt.trim() }],
      })
    }

    if (contents.length === 0) {
      return NextResponse.json({ error: 'No message prompt provided' }, { status: 400 })
    }

    // Ensure the last message is from 'user'
    if (contents[contents.length - 1].role !== 'user') {
      return NextResponse.json({ error: 'The last turn must be from the user' }, { status: 400 })
    }

    const ai = getGenAI()
    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    })

    const text = response.text || ''

    return NextResponse.json({
      text,
      model: selectedModel,
      rolePersona,
    })
  } catch (err: any) {
    console.error('Gemini Chat API Error:', err)
    return NextResponse.json(
      {
        error: err.message || 'Failed to generate AI response',
        fallback: true,
      },
      { status: 500 }
    )
  }
}
