import { supabase } from '@/lib/supabase'

export async function getArticles() {
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function createArticle(article) {
    const { error } = await supabase
        .from('articles')
        .insert(article)

    if (error) throw error
}

export async function uploadArticleImage(file, articleRef = 'article') {
    if (!file) return null
    const ext = (file.name?.split('.').pop() || 'png').toLowerCase()
    const safeRef = String(articleRef || 'article').toLowerCase().replace(/[^a-z0-9_-]/g, '-')
    const filePath = `articles/${Date.now()}-${safeRef}.${ext}`

    const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type || undefined,
        })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('article-images').getPublicUrl(filePath)
    return data?.publicUrl || null
}

export async function updateArticle(id, updates) {
    const { error } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', id)

    if (error) throw error
}

export async function deleteArticle(id) {
    const { data: linkedLines, error: linkedError } = await supabase
        .from('ligne_commandes')
        .select('id')
        .eq('article_id', id)
        .limit(1)

    if (linkedError) throw linkedError
    if (Array.isArray(linkedLines) && linkedLines.length > 0) {
        throw new Error('Suppression impossible: cet article est deja lie a une ou plusieurs commandes.')
    }

    const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

    if (error) {
        if (error.code === '23503') {
            throw new Error('Impossible de supprimer cet article car il est deja utilise dans une ou plusieurs commandes.')
        }
        if (error.status === 409) {
            throw new Error('Suppression impossible: conflit de donnees (article reference par une commande).')
        }
        throw error
    }
}
