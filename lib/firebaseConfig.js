// Firebase configuration helper
// This file helps ensure proper domain authorization

// Function to configure Firebase Auth for the current domain
export function configureDomainAuth() {
  if (typeof window === 'undefined') return; // Only run on client side
  
  try {
    // Get the current domain
    const currentDomain = window.location.hostname;
    
    // Log the current domain for debugging
    console.log(`Configuring Firebase for domain: ${currentDomain}`);
    
    // This is a workaround for domain authorization issues
    // In production, these domains should be added to Firebase Console
    const authorizedDomains = [
      'localhost',
      '127.0.0.1',
      'mtt-s.ieeecusatsb.in',
      'ieeecusatsb.in'
    ];
    
    // Check if current domain is in the list
    if (!authorizedDomains.includes(currentDomain)) {
      console.warn(`Current domain (${currentDomain}) is not in the authorized domains list.`);
      console.warn('This may cause OAuth operations to fail.');
      console.warn('Add this domain to the authorized domains in Firebase Console.');
    } else {
      console.log(`Domain ${currentDomain} is authorized for Firebase Auth operations.`);
    }
    
    // Note: This doesn't actually authorize domains - that must be done in Firebase Console
    // This just provides helpful debugging information
  } catch (error) {
    console.error('Error in domain configuration:', error);
  }
} 