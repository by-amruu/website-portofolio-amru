import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey

  if (!supabaseUrl || !supabaseKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase configuration missing.'
    })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const files = await readMultipartFormData(event)
    if (!files || files.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tidak ada file yang diunggah.'
      })
    }

    const file = files[0]
    const ext = file.filename ? file.filename.split('.').pop() : 'jpg'
    const fileName = `portfolio_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`

    // Upload ke bucket 'portfolio-media' di Supabase Storage
    const { data, error } = await supabase.storage
      .from('portfolio-media')
      .upload(fileName, file.data, {
        contentType: file.type || 'image/jpeg',
        upsert: true
      })

    if (error) {
      throw new Error(`Supabase Storage Error: ${error.message}`)
    }

    // Dapatkan Public URL
    const { data: publicUrlData } = supabase.storage
      .from('portfolio-media')
      .getPublicUrl(fileName)

    return {
      status: 'success',
      url: publicUrlData.publicUrl
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Gagal mengunggah gambar.'
    })
  }
})

