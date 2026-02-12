import { supabase } from '@/lib/supabase'

async function throwFunctionError(error, fallbackMessage) {
    let message = error?.message || fallbackMessage
    const response = error?.context

    if (response) {
        const statusPrefix = response?.status ? `[${response.status}] ` : ''
        try {
            const raw = await response.text()
            if (raw) {
                try {
                    const parsed = JSON.parse(raw)
                    message = parsed?.error || parsed?.message || raw
                } catch {
                    message = raw
                }
            }
        } catch {
            // keep previous message
        }
        message = `${statusPrefix}${message}`
    }

    throw new Error(message || fallbackMessage)
}

async function getAccessTokenOrThrow() {
    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData?.session?.access_token
    if (!accessToken) {
        throw new Error('Session expiree. Reconnectez-vous puis reessayez.')
    }
    return accessToken
}

export async function getUsers() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function updateUser(id, updates) {
    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)

    if (error) throw error
}

export async function createUser(payload) {
    const accessToken = await getAccessTokenOrThrow()

    const { data, error } = await supabase.functions.invoke('manage-users', {
        body: { action: 'create', ...payload },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    })

    if (error) await throwFunctionError(error, "Erreur lors de la creation de l'utilisateur.")
    return data
}

export async function deleteUser(id) {
    const accessToken = await getAccessTokenOrThrow()

    const { error } = await supabase.functions.invoke('manage-users', {
        body: { action: 'delete', user_id: id },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    })

    if (error) await throwFunctionError(error, "Erreur lors de la suppression de l'utilisateur.")
}
