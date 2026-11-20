'use client'

import { useEffect } from 'react'

export function AdTags({
  metaPixelId,
  linkedinPartnerId,
  googleAdsId,
  googleConversionLabel,
}: {
  metaPixelId?: string
  linkedinPartnerId?: string
  googleAdsId?: string
  googleConversionLabel?: string
}) {
  useEffect(() => {
    if (!document.cookie.includes('cr_consent=granted')) return
    if (metaPixelId && !document.querySelector('script[data-meta-pixel]')) {
      const script = document.createElement('script')
      script.dataset.metaPixel = 'true'
      script.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`
      document.head.appendChild(script)
    }
    if (linkedinPartnerId && !document.querySelector('script[data-linkedin-insight]')) {
      const script = document.createElement('script')
      script.dataset.linkedinInsight = 'true'
      script.text = `_linkedin_partner_id="${linkedinPartnerId}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);`
      document.head.appendChild(script)
      const loader = document.createElement('script')
      loader.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js'
      loader.async = true
      document.head.appendChild(loader)
    }
    if (googleAdsId && !document.querySelector('script[data-google-ads]')) {
      const loader = document.createElement('script')
      loader.async = true
      loader.src = `https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`
      loader.dataset.googleAds = 'true'
      document.head.appendChild(loader)
      const script = document.createElement('script')
      script.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${googleAdsId}');`
      document.head.appendChild(script)
      if (googleConversionLabel) {
        window.sessionStorage.setItem('cr_google_conversion', `${googleAdsId}/${googleConversionLabel}`)
      }
    }
  }, [metaPixelId, linkedinPartnerId, googleAdsId, googleConversionLabel])
  return null
}
