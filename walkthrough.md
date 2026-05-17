# Correction de la Production (Uploads & Messages)

J'ai migré le système d'upload des produits et des projets vers **Supabase Storage**. Cela résout le problème principal en ligne où le système de fichiers est bloqué (lecture seule).

## Changements effectués

### 1. Migration vers Supabase Storage
- **`app/api/products/route.js`** : Les images ne sont plus enregistrées dans `/public/uploads/products` mais envoyées directement dans le bucket Supabase `products`. L'URL stockée en base de données commence maintenant par `https://...` (URL publique Supabase).
- **`app/api/projects/route.js`** : Même changement pour les médias des projets, envoyés dans le bucket `projects`.

### 2. Amélioration du Debugging
- **`app/api/messages/route.js`** : J'ai ajouté des logs d'erreurs plus détaillés. Si un message ne s'enregistre pas en ligne, vous verrez maintenant précisément pourquoi (erreur RLS, erreur de clé, etc.) dans les logs de votre hébergeur (ex: Vercel logs).

### 3. Mise à jour du Schéma SQL
- **`supabase_schema.sql`** : Ajout d'instructions claires pour créer les Buckets Storage nécessaires.

## Étapes finales pour vous

### ⚠️ IMPORTANT: Actions sur Supabase
Pour que tout fonctionne parfaitement, vous devez effectuer ces deux actions dans votre tableau de bord Supabase :

1.  **Créer les Buckets** : Allez dans **Storage** -> **New Bucket**. Créez un bucket `products` et un bucket `projects`. Assurez-vous qu'ils sont configurés en **Public**.
2.  **Vérifier les variables d'environnement** : Dans Vercel (ou votre hébergeur), vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` sont bien renseignées.

### Test
Une fois ces étapes faites, essayez d'ajouter un produit ou d'envoyer un message en ligne. Cela devrait maintenant fonctionner sans erreur.
