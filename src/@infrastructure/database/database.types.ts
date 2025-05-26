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
      body_materials: {
        Row: {
          code: string | null
          id: string
          name: string | null
        }
        Insert: {
          code?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          code?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      body_parts: {
        Row: {
          code: string | null
          color: string | null
          id: string
          name: string | null
        }
        Insert: {
          code?: string | null
          color?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          code?: string | null
          color?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      document_statuses: {
        Row: {
          code: string
          id: string
          label: string
        }
        Insert: {
          code: string
          id?: string
          label: string
        }
        Update: {
          code?: string
          id?: string
          label?: string
        }
        Relationships: []
      }
      garages: {
        Row: {
          address: string | null
          city: string | null
          code: string | null
          email: string | null
          id: string
          name: string | null
          percentage_commission: number | null
          phone: string | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          code?: string | null
          email?: string | null
          id?: string
          name?: string | null
          percentage_commission?: number | null
          phone?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          code?: string | null
          email?: string | null
          id?: string
          name?: string | null
          percentage_commission?: number | null
          phone?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "garages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_details: {
        Row: {
          body_material_id: string | null
          body_part_id: string | null
          dent_removal_price: number | null
          id: string
          impact_count_25: number | null
          impact_count_35: number | null
          invoice_id: string | null
          price: number | null
          repair_type_id: string | null
        }
        Insert: {
          body_material_id?: string | null
          body_part_id?: string | null
          dent_removal_price?: number | null
          id?: string
          impact_count_25?: number | null
          impact_count_35?: number | null
          invoice_id?: string | null
          price?: number | null
          repair_type_id?: string | null
        }
        Update: {
          body_material_id?: string | null
          body_part_id?: string | null
          dent_removal_price?: number | null
          id?: string
          impact_count_25?: number | null
          impact_count_35?: number | null
          invoice_id?: string | null
          price?: number | null
          repair_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_details_body_material_id_fkey"
            columns: ["body_material_id"]
            isOneToOne: false
            referencedRelation: "body_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_details_body_part_id_fkey"
            columns: ["body_part_id"]
            isOneToOne: false
            referencedRelation: "body_parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_details_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_details_repair_type_id_fkey"
            columns: ["repair_type_id"]
            isOneToOne: false
            referencedRelation: "repair_types"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          car_brand: string | null
          car_date: number | null
          car_id: string | null
          country: string | null
          created_at: string
          currency: string | null
          end_date: string | null
          forfait_amount: number | null
          garage_address: string | null
          garage_city: string | null
          garage_email: string | null
          garage_id: string | null
          garage_name: string | null
          garage_percentage_commission: number | null
          garage_phone: string | null
          garage_zip_code: string | null
          id: string
          invoice_number: string | null
          is_forfait: boolean | null
          is_sent: boolean | null
          quote_number: string | null
          sent_at: string | null
          start_date: string | null
          status: string | null
          technician_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          car_brand?: string | null
          car_date?: number | null
          car_id?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          end_date?: string | null
          forfait_amount?: number | null
          garage_address?: string | null
          garage_city?: string | null
          garage_email?: string | null
          garage_id?: string | null
          garage_name?: string | null
          garage_percentage_commission?: number | null
          garage_phone?: string | null
          garage_zip_code?: string | null
          id?: string
          invoice_number?: string | null
          is_forfait?: boolean | null
          is_sent?: boolean | null
          quote_number?: string | null
          sent_at?: string | null
          start_date?: string | null
          status?: string | null
          technician_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          car_brand?: string | null
          car_date?: number | null
          car_id?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          end_date?: string | null
          forfait_amount?: number | null
          garage_address?: string | null
          garage_city?: string | null
          garage_email?: string | null
          garage_id?: string | null
          garage_name?: string | null
          garage_percentage_commission?: number | null
          garage_phone?: string | null
          garage_zip_code?: string | null
          id?: string
          invoice_number?: string | null
          is_forfait?: boolean | null
          is_sent?: boolean | null
          quote_number?: string | null
          sent_at?: string | null
          start_date?: string | null
          status?: string | null
          technician_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quote_number_fkey"
            columns: ["quote_number"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_details: {
        Row: {
          body_material_id: string | null
          body_part_id: string | null
          dent_removal_price: number | null
          id: string
          impact_count_25: number | null
          impact_count_35: number | null
          price: number | null
          quote_id: string | null
          repair_type_id: string | null
        }
        Insert: {
          body_material_id?: string | null
          body_part_id?: string | null
          dent_removal_price?: number | null
          id?: string
          impact_count_25?: number | null
          impact_count_35?: number | null
          price?: number | null
          quote_id?: string | null
          repair_type_id?: string | null
        }
        Update: {
          body_material_id?: string | null
          body_part_id?: string | null
          dent_removal_price?: number | null
          id?: string
          impact_count_25?: number | null
          impact_count_35?: number | null
          price?: number | null
          quote_id?: string | null
          repair_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_details_body_material_id_fkey"
            columns: ["body_material_id"]
            isOneToOne: false
            referencedRelation: "body_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_details_body_part_id_fkey"
            columns: ["body_part_id"]
            isOneToOne: false
            referencedRelation: "body_parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_details_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_details_repair_type_id_fkey"
            columns: ["repair_type_id"]
            isOneToOne: false
            referencedRelation: "repair_types"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          car_brand: string | null
          car_date: number | null
          car_id: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          end_date: string | null
          forfait_amount: number | null
          garage_address: string | null
          garage_city: string | null
          garage_email: string | null
          garage_id: string | null
          garage_name: string | null
          garage_percentage_commission: number | null
          garage_phone: string | null
          garage_zip_code: string | null
          id: string
          is_compute_commission_without_dent_removal: boolean | null
          is_display_unit_price: boolean | null
          is_forfait: boolean | null
          is_sent: boolean | null
          quote_number: string | null
          sent_at: string | null
          start_date: string | null
          status_id: string | null
          technician_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          car_brand?: string | null
          car_date?: number | null
          car_id?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          end_date?: string | null
          forfait_amount?: number | null
          garage_address?: string | null
          garage_city?: string | null
          garage_email?: string | null
          garage_id?: string | null
          garage_name?: string | null
          garage_percentage_commission?: number | null
          garage_phone?: string | null
          garage_zip_code?: string | null
          id?: string
          is_compute_commission_without_dent_removal?: boolean | null
          is_display_unit_price?: boolean | null
          is_forfait?: boolean | null
          is_sent?: boolean | null
          quote_number?: string | null
          sent_at?: string | null
          start_date?: string | null
          status_id?: string | null
          technician_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          car_brand?: string | null
          car_date?: number | null
          car_id?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          end_date?: string | null
          forfait_amount?: number | null
          garage_address?: string | null
          garage_city?: string | null
          garage_email?: string | null
          garage_id?: string | null
          garage_name?: string | null
          garage_percentage_commission?: number | null
          garage_phone?: string | null
          garage_zip_code?: string | null
          id?: string
          is_compute_commission_without_dent_removal?: boolean | null
          is_display_unit_price?: boolean | null
          is_forfait?: boolean | null
          is_sent?: boolean | null
          quote_number?: string | null
          sent_at?: string | null
          start_date?: string | null
          status_id?: string | null
          technician_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "document_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_types: {
        Row: {
          code: string | null
          id: string
          name: string | null
        }
        Insert: {
          code?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          code?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      setting_price_body_material_coefficient: {
        Row: {
          body_material_id: string
          material_coefficient: number | null
          user_id: string
        }
        Insert: {
          body_material_id: string
          material_coefficient?: number | null
          user_id: string
        }
        Update: {
          body_material_id?: string
          material_coefficient?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_body_material"
            columns: ["body_material_id"]
            isOneToOne: false
            referencedRelation: "body_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setting_price_body_material_coefficient_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      setting_price_body_part_coefficient: {
        Row: {
          body_part_id: string
          difficulty_coefficient: number | null
          user_id: string
        }
        Insert: {
          body_part_id: string
          difficulty_coefficient?: number | null
          user_id: string
        }
        Update: {
          body_part_id?: string
          difficulty_coefficient?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_body_part"
            columns: ["body_part_id"]
            isOneToOne: false
            referencedRelation: "body_parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setting_price_body_part_coefficient_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      setting_price_diameter_coefficient: {
        Row: {
          coefficient: number | null
          diameter: number | null
          id: string
          user_id: string | null
        }
        Insert: {
          coefficient?: number | null
          diameter?: number | null
          id: string
          user_id?: string | null
        }
        Update: {
          coefficient?: number | null
          diameter?: number | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "setting_price_diameter_coefficient_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      setting_price_general: {
        Row: {
          hourly_rate: number | null
          id: string
          unit_time: number | null
          user_id: string
        }
        Insert: {
          hourly_rate?: number | null
          id?: string
          unit_time?: number | null
          user_id?: string
        }
        Update: {
          hourly_rate?: number | null
          id?: string
          unit_time?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "setting_price_general_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      setting_price_impact_count_to_ut: {
        Row: {
          id: string
          impact_count_max: number | null
          impact_count_min: number | null
          unit_time: number | null
          user_id: string | null
        }
        Insert: {
          id?: string
          impact_count_max?: number | null
          impact_count_min?: number | null
          unit_time?: number | null
          user_id?: string | null
        }
        Update: {
          id?: string
          impact_count_max?: number | null
          impact_count_min?: number | null
          unit_time?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "setting_price_impact_count_to_ut_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      setting_price_repair_type_coefficient: {
        Row: {
          repair_type_coefficient: number | null
          repair_type_id: string
          user_id: string
        }
        Insert: {
          repair_type_coefficient?: number | null
          repair_type_id: string
          user_id: string
        }
        Update: {
          repair_type_coefficient?: number | null
          repair_type_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_repair_type"
            columns: ["repair_type_id"]
            isOneToOne: false
            referencedRelation: "repair_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setting_price_repair_type_coefficient_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          price_cents: number
          stripe_price_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price_cents: number
          stripe_price_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price_cents?: number
          stripe_price_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          plan_id: string
          start_date: string
          status: string
          stripe_subscription_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan_id: string
          start_date: string
          status: string
          stripe_subscription_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan_id?: string
          start_date?: string
          status?: string
          stripe_subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          email: string
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          email: string
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Update: {
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_user_profile: {
        Args: {
          user_id: string
          email: string
          full_name: string
          role: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
