
/**
 * Script de patch à exécuter après la génération automatique de `database.types.ts`
 * Il ajoute manuellement les relations à la table `quotes` dans le schema `quoting`.
 */

import fs from 'fs'

const path = 'src/@infrastructure/database/database.types.ts' // adapte au besoin

const PATCH = `        Relationships: [
          {
            foreignKeyName: "quotes_garage_id_fkey",
            columns: ["garage_id"],
            isOneToOne: false,
            referencedRelation: "garages",
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_user_id_fkey",
            columns: ["user_id"],
            isOneToOne: false,
            referencedRelation: "users",
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_technician_id_fkey",
            columns: ["technician_id"],
            isOneToOne: false,
            referencedRelation: "users",
            referencedColumns: ["id"]
          }
        ]`

const FILE = fs.readFileSync(path, 'utf8')

const result = FILE.replace(
  /quotes: {\s+Row: {[^}]+}\s+Insert: {[^}]+}\s+Update: {[^}]+}\s+Relationships: \[\]/,
  match => match.replace('Relationships: []', PATCH)
)

fs.writeFileSync(path, result, 'utf8')

console.log('✅ Patch des relations quotes appliqué avec succès.')
