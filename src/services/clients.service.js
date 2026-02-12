import { supabase } from '@/lib/supabase'

export async function getClients() {
    const { data, error } = await supabase
        .from('clients')
        .select('*')

    if (error) throw error
    return data
}
