export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      family_health_reports: {
        Row: {
          ai_analysis: Json | null
          ai_suggestions: string[] | null
          created_at: string
          family_member_id: string
          file_url: string | null
          focus_areas: string[] | null
          good_indicators: string[] | null
          id: string
          report_data: Json | null
          report_name: string
          report_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          ai_suggestions?: string[] | null
          created_at?: string
          family_member_id: string
          file_url?: string | null
          focus_areas?: string[] | null
          good_indicators?: string[] | null
          id?: string
          report_data?: Json | null
          report_name: string
          report_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          ai_suggestions?: string[] | null
          created_at?: string
          family_member_id?: string
          file_url?: string | null
          focus_areas?: string[] | null
          good_indicators?: string[] | null
          id?: string
          report_data?: Json | null
          report_name?: string
          report_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_health_reports_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_health_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          age: number
          avatar_url: string | null
          created_at: string | null
          existing_conditions: string[] | null
          gender: string | null
          health_focus: string | null
          height: number | null
          id: string
          lifestyle: string | null
          name: string
          relationship: string
          user_id: string
          weight: number | null
        }
        Insert: {
          age: number
          avatar_url?: string | null
          created_at?: string | null
          existing_conditions?: string[] | null
          gender?: string | null
          health_focus?: string | null
          height?: number | null
          id?: string
          lifestyle?: string | null
          name: string
          relationship: string
          user_id: string
          weight?: number | null
        }
        Update: {
          age?: number
          avatar_url?: string | null
          created_at?: string | null
          existing_conditions?: string[] | null
          gender?: string | null
          health_focus?: string | null
          height?: number | null
          id?: string
          lifestyle?: string | null
          name?: string
          relationship?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "family_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      food_scans: {
        Row: {
          barcode: string | null
          calories: number
          carbs: number
          created_at: string | null
          date: string
          fat: number
          fiber: number
          id: string
          image_url: string | null
          name: string
          protein: number
          scan_type: Database["public"]["Enums"]["food_scan_type"]
          sodium: number
          sugar: number
          user_id: string
        }
        Insert: {
          barcode?: string | null
          calories?: number
          carbs?: number
          created_at?: string | null
          date?: string
          fat?: number
          fiber?: number
          id?: string
          image_url?: string | null
          name: string
          protein?: number
          scan_type: Database["public"]["Enums"]["food_scan_type"]
          sodium?: number
          sugar?: number
          user_id: string
        }
        Update: {
          barcode?: string | null
          calories?: number
          carbs?: number
          created_at?: string | null
          date?: string
          fat?: number
          fiber?: number
          id?: string
          image_url?: string | null
          name?: string
          protein?: number
          scan_type?: Database["public"]["Enums"]["food_scan_type"]
          sodium?: number
          sugar?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_scans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_data: {
        Row: {
          alcohol: number
          created_at: string | null
          date: string
          exercise_frequency: number
          id: string
          junk_food_level: number
          sleep_hours: number
          smoking: boolean
          steps: number
          stress_level: number
          user_id: string
          water_intake: number
        }
        Insert: {
          alcohol?: number
          created_at?: string | null
          date?: string
          exercise_frequency?: number
          id?: string
          junk_food_level?: number
          sleep_hours: number
          smoking?: boolean
          steps?: number
          stress_level?: number
          user_id: string
          water_intake: number
        }
        Update: {
          alcohol?: number
          created_at?: string | null
          date?: string
          exercise_frequency?: number
          id?: string
          junk_food_level?: number
          sleep_hours?: number
          smoking?: boolean
          steps?: number
          stress_level?: number
          user_id?: string
          water_intake?: number
        }
        Relationships: [
          {
            foreignKeyName: "health_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_risks: {
        Row: {
          created_at: string | null
          date: string
          id: string
          risk_level: Database["public"]["Enums"]["risk_level"]
          score: number
          suggestions: string[]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          risk_level: Database["public"]["Enums"]["risk_level"]
          score: number
          suggestions: string[]
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          risk_level?: Database["public"]["Enums"]["risk_level"]
          score?: number
          suggestions?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_risks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          meal_reminders: boolean | null
          push_notifications: boolean | null
          sleep_reminders: boolean | null
          updated_at: string | null
          user_id: string
          water_reminders: boolean | null
          weekly_reports: boolean | null
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          meal_reminders?: boolean | null
          push_notifications?: boolean | null
          sleep_reminders?: boolean | null
          updated_at?: string | null
          user_id: string
          water_reminders?: boolean | null
          weekly_reports?: boolean | null
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          meal_reminders?: boolean | null
          push_notifications?: boolean | null
          sleep_reminders?: boolean | null
          updated_at?: string | null
          user_id?: string
          water_reminders?: boolean | null
          weekly_reports?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          city: string | null
          created_at: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          health_conditions: string[] | null
          height: number | null
          id: string
          name: string
          subscription_expires_at: string | null
          subscription_plan:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          city?: string | null
          created_at?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          health_conditions?: string[] | null
          height?: number | null
          id: string
          name: string
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          city?: string | null
          created_at?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          health_conditions?: string[] | null
          height?: number | null
          id?: string
          name?: string
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      food_scan_type: "barcode" | "plate"
      gender_type: "male" | "female" | "other"
      risk_level: "Low" | "Medium" | "High"
      subscription_plan: "free" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      food_scan_type: ["barcode", "plate"],
      gender_type: ["male", "female", "other"],
      risk_level: ["Low", "Medium", "High"],
      subscription_plan: ["free", "premium"],
    },
  },
} as const
