import { defineEventHandler, readBody, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey

  if (!supabaseUrl || !supabaseKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase configuration is missing.'
    })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // 1. GET Request: Ambil daftar feeds dari Supabase
  if (event.method === 'GET') {
    const query = getQuery(event)
    const featuredOnly = query.featured !== 'false'

    let dbQuery = supabase
      .from('social_feeds')
      .select('*')
      .order('posted_at', { ascending: false })

    if (featuredOnly) {
      dbQuery = dbQuery.eq('is_featured', true)
    }

    const { data, error } = await dbQuery

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }

    return {
      status: 'success',
      total: data?.length || 0,
      data
    }
  }

  // 2. POST Request: Insert feed baru atau simpan hasil sync (TikTok/IG)
  if (event.method === 'POST') {
    const body = await readBody(event)

    // Validasi payload
    if (!body.platform || !body.external_id || !body.permalink) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Platform, external_id, and permalink are required fields.'
      })
    }

    const payload = {
      platform: body.platform, // 'tiktok' atau 'instagram'
      external_id: String(body.external_id),
      caption: body.caption || '',
      media_type: body.media_type || 'video',
      media_url: body.media_url || body.permalink,
      permalink: body.permalink,
      thumbnail_url: body.thumbnail_url || null,
      posted_at: body.posted_at || new Date().toISOString(),
      is_featured: body.is_featured ?? true,
      tags: body.tags || []
    }

    // Upsert berdasarkan external_id jika ada constraint, atau insert
    const { data, error } = await supabase
      .from('social_feeds')
      .upsert(payload, { onConflict: 'external_id' })
      .select()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }

    return {
      status: 'success',
      message: 'Social feed synchronized successfully.',
      data
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method Not Allowed'
  })
})

