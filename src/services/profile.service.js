import { supabase } from '@/lib/supabase'

export async function getMyProfile() {
    const { data: user } = await supabase.auth.getUser()
    if (!user?.user) return null

    const { data: profileUpper, error: profileUpperError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.user.id)
        .maybeSingle()

    if (profileUpperError) throw profileUpperError
    if (profileUpper) return profileUpper

    const { data: profileLower, error: profileLowerError } = await supabase
        .from('profils')
        .select('*')
        .eq('id', user.user.id)
        .maybeSingle()

    if (profileLowerError) throw profileLowerError
    return profileLower ?? null
}
