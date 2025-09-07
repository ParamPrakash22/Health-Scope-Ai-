
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, type = 'natural' } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Food query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing food:', query, 'Type:', type);

    let nutritionData;

    if (type === 'barcode') {
      // Handle barcode lookup
      const response = await fetch(`https://trackapi.nutritionix.com/v2/search/item?upc=${query}`, {
        method: 'GET',
        headers: {
          'x-app-id': 'a16951b4',
          'x-app-key': '1d99613f2fddfe0e005b53a8a5fa382b',
        }
      });

      if (!response.ok) {
        throw new Error(`Nutritionix API error: ${response.status}`);
      }

      const data = await response.json();
      const foods = data.foods || [];
      
      if (foods.length > 0) {
        const food = foods[0];
        nutritionData = {
          name: food.food_name,
          calories: Math.round(food.nf_calories || 0),
          protein: Math.round(food.nf_protein || 0),
          carbs: Math.round(food.nf_total_carbohydrate || 0),
          fat: Math.round(food.nf_total_fat || 0),
          fiber: Math.round(food.nf_dietary_fiber || 0),
          sugar: Math.round(food.nf_sugars || 0),
          sodium: Math.round(food.nf_sodium || 0),
          scan_type: 'barcode',
        };
      }
    } else {
      // Handle natural language food analysis
      const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
        method: 'POST',
        headers: {
          'x-app-id': 'a16951b4',
          'x-app-key': '1d99613f2fddfe0e005b53a8a5fa382b',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error(`Nutritionix API error: ${response.status}`);
      }

      const data = await response.json();
      const foods = data.foods || [];
      
      if (foods.length > 0) {
        // Aggregate nutrition data for multiple foods
        const totalNutrition = foods.reduce((total: any, food: any) => ({
          calories: total.calories + (food.nf_calories || 0),
          protein: total.protein + (food.nf_protein || 0),
          carbs: total.carbs + (food.nf_total_carbohydrate || 0),
          fat: total.fat + (food.nf_total_fat || 0),
          fiber: total.fiber + (food.nf_dietary_fiber || 0),
          sugar: total.sugar + (food.nf_sugars || 0),
          sodium: total.sodium + (food.nf_sodium || 0),
        }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 });

        nutritionData = {
          name: foods.map((f: any) => f.food_name).join(', '),
          calories: Math.round(totalNutrition.calories),
          protein: Math.round(totalNutrition.protein),
          carbs: Math.round(totalNutrition.carbs),
          fat: Math.round(totalNutrition.fat),
          fiber: Math.round(totalNutrition.fiber),
          sugar: Math.round(totalNutrition.sugar),
          sodium: Math.round(totalNutrition.sodium),
          scan_type: 'manual',
          foods: foods.map((f: any) => ({
            name: f.food_name,
            calories: Math.round(f.nf_calories || 0),
            serving: f.serving_qty + ' ' + f.serving_unit
          }))
        };
      }
    }

    if (!nutritionData) {
      return new Response(
        JSON.stringify({ error: 'No nutrition data found for this item' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Nutrition data:', nutritionData);

    return new Response(
      JSON.stringify({ nutritionData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-food function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
