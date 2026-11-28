export type FeatureKey =
  | 'quote_email_sending'
  | 'invoice_email_sending'
  | 'car_view'
  | 'quote_to_invoice'
  | 'max_seats'
  | 'max_garages'
  | 'max_quotes_per_month'
  | 'max_invoices_per_month'
  | 'max_conversions_per_month'

// boolean: feature on/off — number: limit — null: unlimited
export type FeatureValue = boolean | number | null
