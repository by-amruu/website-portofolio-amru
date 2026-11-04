import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const targetUrl = query.url as string

  if (!targetUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL target wajib diisi.'
    })
  }

  const cleanUrl = (targetUrl.split('?')[0] ?? '').trim()

  // 1. Deteksi Platform
  let platform = 'website'
  if (cleanUrl.includes('tiktok.com')) platform = 'tiktok'
  else if (cleanUrl.includes('instagram.com')) platform = 'instagram'
  else if (cleanUrl.includes('pinterest.com') || cleanUrl.includes('pin.it')) platform = 'pinterest'

  try {
    // 2. Fetch HTML dengan User-Agent agar tidak diblokir bot detector
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const res = await fetch(cleanUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    })
    clearTimeout(timeoutId)

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.statusText}`)
    }

    const html = await res.text()

    // 3. Ekstrak OpenGraph Meta Tags (og:title, og:image, og:description)
    const titleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) 
      || html.match(/<title[^>]*>([^<]+)<\/title>/i)
    
    const imageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)

    const descMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)

    const title = titleMatch && titleMatch[1] ? titleMatch[1].replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec)) : ''
    const imageUrl = imageMatch && imageMatch[1] ? imageMatch[1] : ''
    const description = descMatch && descMatch[1] ? descMatch[1] : ''

    // 4. Deteksi Default Aspect Ratio
    let aspectRatio = '16:9'
    if (platform === 'tiktok') aspectRatio = '9:16'
    else if (platform === 'instagram' || platform === 'pinterest') aspectRatio = '3:4'

    return {
      status: 'success',
      platform,
      title: title || `${platform.toUpperCase()} Project Showcase`,
      description: description || 'Portofolio karya dari ' + platform,
      image_url: imageUrl || '',
      permalink: cleanUrl,
      aspect_ratio: aspectRatio
    }

  } catch (err: any) {
    // Fallback jika situs memproteksi scraping (e.g. login wall)
    let fallbackAspect = '16:9'
    if (platform === 'tiktok') fallbackAspect = '9:16'
    else if (platform === 'instagram' || platform === 'pinterest') fallbackAspect = '3:4'

    return {
      status: 'partial',
      platform,
      title: `${platform.toUpperCase()} Showcase`,
      description: 'Karya visual di ' + platform,
      image_url: '',
      permalink: cleanUrl,
      aspect_ratio: fallbackAspect
    }
  }
})
