import { supabase } from '@/lib/supabase'

export async function getDocuments() {
    const { data, error } = await supabase
        .from('documents')
        .select('*, commande:commandes(id, numero_commande, montant_total, client:clients(nom))')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function createDocument(document) {
    const { data, error } = await supabase
        .from('documents')
        .insert(document)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function uploadDocumentFile(path, fileContent) {
    const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(path, fileContent, { contentType: 'application/pdf', upsert: true })

    if (uploadError) throw uploadError
    const { data } = supabase.storage.from('documents').getPublicUrl(path)
    return data?.publicUrl
}

export async function generateDocument(payload) {
    // fallback kept for compatibility, now handled client-side in document.jsx
    return payload
}

export async function updateDocument(id, updates) {
    const { error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)

    if (error) throw error
}

export async function deleteDocument(id) {
    const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)

    if (error) throw error
}
