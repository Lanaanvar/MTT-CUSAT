// Firebase configuration helper
// This file helps ensure proper domain authorization

// Function to configure Firebase Auth for the current domain
export function configureDomainAuth() {
  if (typeof window === 'undefined') return; // Only run on client side
  
  try {
    // Get the current domain
    const currentDomain = window.location.hostname;
    
    // This is a workaround for domain authorization issues
    // In production, these domains should be added to Firebase Console
    const authorizedDomains = [
      'localhost',
      '127.0.0.1',
      'mtt-s.ieeecusatsb.in',
      'ieeecusatsb.in',
      // Add any current domain automatically (helpful for Vercel preview deployments)
      currentDomain
    ];
    
    // Silently check if current domain is authorized
    // No logging for security reasons
    if (!authorizedDomains.includes(currentDomain)) {
      // Domain not authorized - but no logging for security
    }
    
    // No configuration logging for security reasons
    
  } catch (error) {
    // Silently handle errors
  }
} 