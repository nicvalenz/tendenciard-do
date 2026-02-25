
export const handleShare = async (title: string, text: string) => {
  const url = window.location.href;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  } else {
    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
      alert('Enlace copiado al portapapeles');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
};
