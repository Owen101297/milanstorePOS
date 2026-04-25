/**
 * Utility functions replicated from Vendty POS
 */

// tConvert(time): Convierte formato de tiempo 24h a 12h
export function tConvert(time: string): string {
  if (!time) return "";
  // Check correct time format and split into components
  let timeMatch = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (timeMatch.length > 1) { // If time format correct
    let t = timeMatch.slice(1); // Remove full string match value
    t[5] = +t[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    t[0] = (+t[0] % 12 || 12).toString(); // Adjust hours
    return t.join(''); // return adjusted time or original string
  }
  return time;
}

// ImgError(source): Maneja errores de carga de imágenes con imagen por defecto
export function handleImgError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.target as HTMLImageElement;
  target.src = "/img/default_image.png"; // Replicating the default image behavior
}

// Storage utilities
export const posStorage = {
  getApiAuth: () => {
    if (typeof window === 'undefined') return null;
    const auth = localStorage.getItem('api_auth');
    return auth ? JSON.parse(auth) : null;
  },
  setApiAuth: (data: any) => {
    localStorage.setItem('api_auth', JSON.stringify(data));
  },
  limpiarApi: () => {
    localStorage.removeItem('api_auth');
    localStorage.removeItem('newToken');
  }
};

// Cross-domain login logic for Tienda Virtual
export function openTiendaVirtual(token: string) {
  const url = `https://admintienda.vendty.com/tienda/crossDomain?token=${token}`;
  window.open(url, "Tienda Virtual", "width=1000,height=600");
}
