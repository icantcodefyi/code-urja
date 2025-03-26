/**
 * Utility functions for avatar generation using DiceBear API
 */

/**
 * Generate an avatar URL from a candidate's ID and name
 * @param id Unique identifier to use as a seed
 * @param name Name for the avatar (can be first name, full name, etc.)
 * @returns URL to the DiceBear avatar
 */
export const getAvatarUrl = (id: string, name: string): string => {
  // Make sure we have a valid string to work with
  const safeName = name ?? 'user';
  // Extract first name for more friendly avatars
  const firstName = safeName.split(' ')[0] ?? safeName;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}-${firstName.toLowerCase()}`;
};

/**
 * Generate an avatar URL from an email address
 * @param email Email address to use as a seed
 * @returns URL to the DiceBear avatar
 */
export const getAvatarUrlFromEmail = (email: string): string => {
  // Create a hash from email for consistent avatar generation
  const emailHash = btoa(email).substring(0, 10);
  
  // Using DiceBear Avatars API with consistent background colors
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${emailHash}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
};

/**
 * Generate an avatar URL from a first and last name plus an ID
 * @param id Unique identifier
 * @param firstName First name
 * @param lastName Last name
 * @returns URL to the DiceBear avatar
 */
export const getAvatarUrlFromName = (idOrFullName: string, firstName?: string, lastName?: string): string => {
  // If only one parameter is provided, assume it's the full name
  if (firstName === undefined && lastName === undefined) {
    const fullName = idOrFullName;
    const nameParts = fullName.split(' ');
    const first = nameParts[0] ?? '';
    const last = nameParts.slice(1).join(' ') ?? '';
    
    // Use the full name as seed
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName.toLowerCase()}`;
  }
  
  // Original functionality: use the candidate's id and name as seed for consistency
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${idOrFullName}-${firstName!.toLowerCase()}-${lastName!.toLowerCase()}`;
}; 