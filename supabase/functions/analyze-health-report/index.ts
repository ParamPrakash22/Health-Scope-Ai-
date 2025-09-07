
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { reportData, memberName, memberAge, memberGender } = await req.json()

    console.log('Analyzing health report for:', memberName)

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a health analysis AI assistant. Analyze the provided health report data and provide insights in JSON format. Focus on:
            1. Identifying good/healthy indicators
            2. Highlighting areas of concern or focus
            3. Providing actionable lifestyle suggestions
            4. Considering the person's age (${memberAge}) and gender (${memberGender || 'not specified'})
            
            Return your response in this exact JSON format:
            {
              "goodIndicators": ["list of positive health markers"],
              "focusAreas": ["list of areas that need attention"],
              "suggestions": ["list of actionable lifestyle and safety tips"],
              "overallAssessment": "brief overall health assessment"
            }`
          },
          {
            role: 'user',
            content: `Please analyze this health report data for ${memberName}: ${JSON.stringify(reportData)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const openaiData = await openaiResponse.json()
    const analysisText = openaiData.choices[0].message.content

    console.log('Raw OpenAI response:', analysisText)

    // Parse the JSON response from OpenAI
    let analysis
    try {
      analysis = JSON.parse(analysisText)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError)
      // Fallback analysis if JSON parsing fails
      analysis = {
        goodIndicators: ["Health report received and processed"],
        focusAreas: ["Consult with healthcare provider for detailed analysis"],
        suggestions: ["Regular check-ups recommended", "Maintain healthy lifestyle"],
        overallAssessment: "Analysis completed - please consult healthcare provider"
      }
    }

    return new Response(
      JSON.stringify({ analysis }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error analyzing health report:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze health report',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
