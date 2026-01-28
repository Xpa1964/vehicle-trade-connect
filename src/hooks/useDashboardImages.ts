// Simple hook for dashboard image URLs (static images)
export const useDashboardImages = () => {
  // Helper function to get image URL (returns null for now, ready for manual image uploads)
  const getImageUrl = (imageKey: string): string | null => {
    // This will return null for now. You can manually add image URLs here
    // or implement a different system for managing static images
    return null;
  };

  const isGenerating = false; // No generation anymore

  return {
    getImageUrl,
    isGenerating
  };
};