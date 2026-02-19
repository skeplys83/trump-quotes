import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createSupabaseServer } from './lib/supabase/server'
import { redirect } from 'next/navigation'
 
export async function proxy(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (request.nextUrl.pathname.startsWith('/plans') && !user) {
    return NextResponse.redirect(new URL('/?login=true', request.url))
  }
}

export const config = {
  matcher: ['/', '/plans'],
}