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
