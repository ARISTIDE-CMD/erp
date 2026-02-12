import { supabase } from '@/lib/supabase'

export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) throw error
    return data
}

export async function logout() {
    await supabase.auth.signOut()
}

export function getSession() {
    return supabase.auth.getSession()
}
