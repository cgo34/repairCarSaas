# 🚀 Méthodologie pour la gestion des schémas et permissions sur Supabase

Ce document décrit les étapes essentielles pour :
- Créer un schéma PostgreSQL sur Supabase.
- Activer **Row Level Security (RLS)**.
- Ajouter des **policies** pour différents types d’utilisateurs (**admin** et **utilisateurs standards**).
- Gérer les **permissions** sur le schéma et les tables.

---

## 📌 1️⃣ Créer un schéma dans Supabase

```sql
-- Créer un nouveau schéma nommé "new_schema"
CREATE SCHEMA new_schema;
```

### 🎯 Ajouter des tables dans le schéma

```sql
-- Exemple : Création d'une table "items" dans le schéma "new_schema"
CREATE TABLE new_schema.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now()
);
```

---

## 🔐 2️⃣ Activer **Row Level Security (RLS)**

```sql
ALTER TABLE new_schema.items ENABLE ROW LEVEL SECURITY;
```

---

## 🎯 3️⃣ Ajouter des policies pour gérer les accès

### ✅ 3.1. Policy **Admin** : Accès total

```sql
CREATE POLICY admin_manage_items
ON new_schema.items
FOR ALL
TO admin
USING (true);
```

### 👤 3.2. Policy **Utilisateur** : Accès uniquement à ses propres données

```sql
CREATE POLICY user_can_access_own_items
ON new_schema.items
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY user_can_insert_items
ON new_schema.items
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY user_can_update_own_items
ON new_schema.items
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY user_can_delete_own_items
ON new_schema.items
FOR DELETE
TO authenticated
USING (user_id = auth.uid());
```

---

## 🔑 4️⃣ Gérer les **permissions** sur le schéma et les tables

### 🔹 4.1. Donner accès à **admin**

```sql
GRANT USAGE ON SCHEMA new_schema TO admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA new_schema TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA new_schema TO admin;
```

### 🔹 4.2. Donner accès aux utilisateurs authentifiés

```sql
GRANT USAGE ON SCHEMA new_schema TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON new_schema.items TO authenticated;
```

---

## 🎯 5️⃣ Vérifications et tests

### ✅ Vérifier si **RLS** est activé
```sql
SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'items';
```

### ✅ Lister toutes les `POLICIES` appliquées à une table
```sql
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'new_schema' AND tablename = 'items';
```

### ✅ Tester un `SELECT` en mode **admin**
```sql
SET ROLE admin;
SELECT * FROM new_schema.items;
```

---

## 🎯 6️⃣ Supprimer ou modifier une policy existante

### 🔹 Supprimer une policy existante
```sql
DROP POLICY IF EXISTS user_can_access_own_items ON new_schema.items;
```

### 🔹 Modifier une policy
Il faut **supprimer la policy existante** et **en recréer une nouvelle**.

---

## 🎯 7️⃣ Ajouter un nouvel utilisateur à un rôle spécifique

### 🔹 Ajouter un utilisateur au rôle `admin`
```sql
ALTER USER my_user SET ROLE admin;
```

### 🔹 Ajouter un utilisateur au rôle `authenticated`
```sql
ALTER USER my_user SET ROLE authenticated;
```

---

## 📌 📌 **Résumé des étapes pour un nouveau schéma Supabase**

1️⃣ **Créer le schéma et la table** 📂
2️⃣ **Activer `RLS`** 🔐
3️⃣ **Créer des policies pour les rôles (`admin`, `authenticated`)** 🎯
4️⃣ **Gérer les permissions (`GRANT USAGE`, `GRANT SELECT/INSERT/UPDATE/DELETE`)** 🔑
5️⃣ **Vérifier que les accès fonctionnent (`SELECT`, `pg_policies`)** ✅
6️⃣ **Modifier ou supprimer une policy si nécessaire** 🔄
7️⃣ **Assigner les utilisateurs aux bons rôles (`ALTER USER`)** 👥

---

## 🎯 **Utilisation future**

Ce fichier peut être utilisé comme référence rapide pour ajouter un nouveau schéma, configurer `RLS`, et définir les permissions adaptées à votre projet Supabase. 🚀

