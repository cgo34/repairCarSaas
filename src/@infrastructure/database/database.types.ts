export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  car_repair: {
    Tables: {
      body_materials: {
        Row: {
          code: string
          id: string
          name: string
        }
        Insert: {
          code: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      body_parts: {
        Row: {
          code: string
          color: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          color?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          color?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      garages: {
        Row: {
          address: string | null
          city: string | null
          code: string
          email: string | null
          id: string
          name: string | null
          percentage_commission: number | null
          phone: string | null
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          code?: string
          email?: string | null
          id?: string
          name?: string | null
          percentage_commission?: number | null
          phone?: string | null
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          code?: string
          email?: string | null
          id?: string
          name?: string | null
          percentage_commission?: number | null
          phone?: string | null
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      repair_types: {
        Row: {
          code: string
          id: string
          name: string
        }
        Insert: {
          code: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      setting_price_body_material_coefficient: {
        Row: {
          body_material_id: string
          material_coefficient: number
          user_id: string
        }
        Insert: {
          body_material_id?: string
          material_coefficient: number
          user_id: string
        }
        Update: {
          body_material_id?: string
          material_coefficient?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "setting_price_body_material_coefficient_body_material_id_fkey"
            columns: ["body_material_id"]
            isOneToOne: false
            referencedRelation: "body_materials"
            referencedColumns: ["id"]
          },
        ]
      }
      setting_price_body_part_coefficient: {
        Row: {
          body_part_id: string
          difficulty_coefficient: number
          user_id: string
        }
        Insert: {
          body_part_id?: string
          difficulty_coefficient: number
          user_id: string
        }
        Update: {
          body_part_id?: string
          difficulty_coefficient?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "setting_price_body_part_coefficient_body_part_id_fkey"
            columns: ["body_part_id"]
            isOneToOne: true
            referencedRelation: "body_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      setting_price_diameter_coefficient: {
        Row: {
          coefficient: number
          diameter: number
          id: string
          user_id: string
        }
        Insert: {
          coefficient: number
          diameter: number
          id?: string
          user_id: string
        }
        Update: {
          coefficient?: number
          diameter?: number
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      setting_price_general: {
        Row: {
          hourly_rate: number
          id: string
          unit_time: number
          user_id: string
        }
        Insert: {
          hourly_rate: number
          id?: string
          unit_time?: number
          user_id: string
        }
        Update: {
          hourly_rate?: number
          id?: string
          unit_time?: number
          user_id?: string
        }
        Relationships: []
      }
      setting_price_impact_count_to_ut: {
        Row: {
          id: string
          impact_count_max: number
          impact_count_min: number
          unit_time: number
          user_id: string
        }
        Insert: {
          id?: string
          impact_count_max: number
          impact_count_min: number
          unit_time: number
          user_id: string
        }
        Update: {
          id?: string
          impact_count_max?: number
          impact_count_min?: number
          unit_time?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          password: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          password: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          password?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  quoting: {
    Tables: {
      invoice_details: {
        Row: {
          body_material_id: string | null
          body_part_id: string | null
          id: string
          impact_count_25: number | null
          impact_count_35: number | null
          invoice_id: string | null
          price: number
          quote_detail_id: string | null
          repair_type_id: string | null
          stripping_percentage: number | null
        }
        Insert: {
          body_material_id?: string | null
          body_part_id?: string | null
          id?: string
          impact_count_25?: number | null
          impact_count_35?: number | null
          invoice_id?: string | null
          price: number
          quote_detail_id?: string | null
          repair_type_id?: string | null
          stripping_percentage?: number | null
        }
        Update: {
          body_material_id?: string | null
          body_part_id?: string | null
          id?: string
          impact_count_25?: number | null
          impact_count_35?: number | null
          invoice_id?: string | null
          price?: number
          quote_detail_id?: string | null
          repair_type_id?: string | null
          stripping_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_details_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_details_quote_detail_id_fkey"
            columns: ["quote_detail_id"]
            isOneToOne: false
            referencedRelation: "quote_details"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          car_brand: string | null
          car_date: number | null
          car_id: string | null
          country: string
          currency: string
          end_date: string | null
          forfait_amount: number | null
          garage_id: string | null
          id: string
          invoice_number: string
          is_forfait: boolean | null
          is_sent: boolean | null
          quote_number: string | null
          sent_at: string | null
          start_date: string | null
          status: string | null
          technician_id: string | null
          user_id: string | null
        }
        Insert: {
          car_brand?: string | null
          car_date?: number | null
          car_id?: string | null
          country: string
          currency: string
          end_date?: string | null
          forfait_amount?: number | null
          garage_id?: string | null
          id?: string
          invoice_number: string
          is_forfait?: boolean | null
          is_sent?: boolean | null
          quote_number?: string | null
          sent_at?: string | null
          start_date?: string | null
          status?: string | null
          technician_id?: string | null
          user_id?: string | null
        }
        Update: {
          car_brand?: string | null
          car_date?: number | null
          car_id?: string | null
          country?: string
          currency?: string
          end_date?: string | null
          forfait_amount?: number | null
          garage_id?: string | null
          id?: string
          invoice_number?: string
          is_forfait?: boolean | null
          is_sent?: boolean | null
          quote_number?: string | null
          sent_at?: string | null
          start_date?: string | null
          status?: string | null
          technician_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_quote_number_fkey"
            columns: ["quote_number"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["quote_number"]
          },
        ]
      }
      quote_details: {
        Row: {
          body_material_id: string | null
          body_part_id: string | null
          id: string
          impact_count_25: number | null
          impact_count_35: number | null
          price: number
          quote_id: string | null
          repair_type_id: string | null
          stripping_percentage: number | null
        }
        Insert: {
          body_material_id?: string | null
          body_part_id?: string | null
          id?: string
          impact_count_25?: number | null
          impact_count_35?: number | null
          price: number
          quote_id?: string | null
          repair_type_id?: string | null
          stripping_percentage?: number | null
        }
        Update: {
          body_material_id?: string | null
          body_part_id?: string | null
          id?: string
          impact_count_25?: number | null
          impact_count_35?: number | null
          price?: number
          quote_id?: string | null
          repair_type_id?: string | null
          stripping_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_details_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          car_brand: string | null
          car_date: number | null
          car_id: string | null
          country: string
          currency: string
          end_date: string | null
          forfait_amount: number | null
          garage_id: string | null
          id: string
          is_forfait: boolean | null
          is_sent: boolean | null
          quote_number: string
          sent_at: string | null
          start_date: string | null
          status: string | null
          technician_id: string | null
          user_id: string | null
        }
        Insert: {
          car_brand?: string | null
          car_date?: number | null
          car_id?: string | null
          country: string
          currency: string
          end_date?: string | null
          forfait_amount?: number | null
          garage_id?: string | null
          id?: string
          is_forfait?: boolean | null
          is_sent?: boolean | null
          quote_number: string
          sent_at?: string | null
          start_date?: string | null
          status?: string | null
          technician_id?: string | null
          user_id?: string | null
        }
        Update: {
          car_brand?: string | null
          car_date?: number | null
          car_id?: string | null
          country?: string
          currency?: string
          end_date?: string | null
          forfait_amount?: number | null
          garage_id?: string | null
          id?: string
          is_forfait?: boolean | null
          is_sent?: boolean | null
          quote_number?: string
          sent_at?: string | null
          start_date?: string | null
          status?: string | null
          technician_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
