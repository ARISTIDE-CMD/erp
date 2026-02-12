import { supabase } from '@/lib/supabase'

export async function createCommande(commande, lignes) {
    const { data, error } = await supabase
        .from('commandes')
        .insert(commande)
        .select()
        .single()

    if (error) throw error

    const lignesToInsert = lignes.map(l => ({
        commande_id: data.id,
        article_id: l.article_id,
        quantite: l.quantite,
        prix_unitaire: l.prix
    }))

    const { error: ligneError } = await supabase
        .from('ligne_commandes')
        .insert(lignesToInsert)

    if (ligneError) throw ligneError

    return data
}
