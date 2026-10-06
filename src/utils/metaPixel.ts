// Meta Pixel (Facebook Pixel) Event Tracker
// Fires standard 'Lead' and 'Contact' events for Meta Ads tracking

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a Meta Pixel 'Lead' event upon form submission
 * @param eventData Extra context e.g. { content_name: 'The Malabar Royal Bed', value: 84500, currency: 'INR' }
 */
export function trackLeadEvent(eventData?: Record<string, unknown>) {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead', {
        content_category: 'Teakwood Furniture',
        currency: 'INR',
        ...eventData,
      });
      console.log('📊 [Meta Pixel]: Fired "Lead" event', eventData);
    }
  } catch (e) {
    console.warn('Meta Pixel trackLead error:', e);
  }
}

/**
 * Fires a Meta Pixel 'Contact' event when user clicks WhatsApp button or Phone link
 * @param channel 'WhatsApp' | 'Phone' | 'Email'
 * @param label Details e.g. product name or page location
 */
export function trackContactEvent(channel: 'WhatsApp' | 'Phone' | 'Email', label?: string) {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'Contact', {
        contact_channel: channel,
        context: label || 'General Enquiry',
      });
      console.log(`📊 [Meta Pixel]: Fired "Contact" event via ${channel} (${label || 'General'})`);
    }
  } catch (e) {
    console.warn('Meta Pixel trackContact error:', e);
  }
}
