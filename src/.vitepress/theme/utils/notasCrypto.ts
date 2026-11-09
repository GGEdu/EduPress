// Notas del orador cifradas: solo descifrado en el navegador, con WebCrypto.
// El formato es el de EduPress Studio (frontend/src/features/slides/notesCrypto.ts):
//
//  - Nota (dentro de `::: notas`): "v1:<iv b64url, 12 bytes>:<texto cifrado + etiqueta b64url>".
//    AES-GCM-256 con la llave del curso y dato asociado (AAD) = ID del curso en UTF-8.
//  - src/.vitepress/config/notas.json (lo escribe Studio; el build lo copia a la raíz
//    del sitio como notas.json):
//      { "version": "v1", "curso": "<uuid>", "iterations": 600000,
//        "salt": "<b64url, 16 bytes>", "wrapped": "<iv b64url>:<llave envuelta b64url>" }
//    La llave del curso son 32 bytes, envueltos con AES-GCM-256 (AAD = curso) bajo una
//    llave derivada de la frase con PBKDF2-SHA-256 (iterations vueltas, salt).
//  - Frase: antes de derivar se normaliza con normalize('NFKD'), trim(), toLocaleLowerCase('es')
//    y espacios simples (como BIP-39). base64url sin relleno.
//
// Nada se guarda: la frase se usa una vez, y la llave desenvuelta vive solo en memoria
// mientras la página está abierta.

export const ITERATIONS_MIN = 100_000
export const ITERATIONS_MAX = 2_000_000

export interface NotasCurso {
  version: 'v1'
  curso: string
  iterations: number
  salt: string
  wrapped: string
}

/** La frase no es la del curso. */
export class FraseIncorrecta extends Error {}

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const NOTA = /^v1:([A-Za-z0-9_-]+):([A-Za-z0-9_-]+)$/
const BASE64URL = /^[A-Za-z0-9_-]*$/

/** La frase escrita de otra forma (acentos en NFC o NFD, espacios, mayúsculas) deriva la misma llave. */
export function normalizarFrase(frase: string): string {
  return frase.normalize('NFKD').trim().toLocaleLowerCase('es').split(/\s+/).join(' ')
}

export function desdeBase64Url(texto: string): Uint8Array {
  if (!BASE64URL.test(texto)) throw new Error('base64url no válido')
  const base64 = texto.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
}

/** Valida la forma de notas.json antes de usarlo. */
export function leerNotasCurso(json: unknown): NotasCurso {
  const o = json as Partial<NotasCurso> | null
  if (
    !o || o.version !== 'v1' || typeof o.curso !== 'string' || o.curso === '' ||
    typeof o.iterations !== 'number' || !Number.isInteger(o.iterations) ||
    o.iterations < ITERATIONS_MIN || o.iterations > ITERATIONS_MAX ||
    typeof o.salt !== 'string' || typeof o.wrapped !== 'string'
  ) {
    throw new Error('notas.json no válido')
  }
  return o as NotasCurso
}

/** Deriva la llave con la frase y desenvuelve la llave del curso. */
export async function desenvolverLlave(frase: string, datos: NotasCurso): Promise<CryptoKey> {
  const salt = desdeBase64Url(datos.salt)
  if (salt.length !== 16) throw new Error('sal no válida')
  const partes = datos.wrapped.split(':')
  if (partes.length !== 2) throw new Error('llave envuelta no válida')
  const iv = desdeBase64Url(partes[0])
  const envuelta = desdeBase64Url(partes[1])
  if (iv.length !== 12) throw new Error('llave envuelta no válida')

  const material = await crypto.subtle.importKey('raw', encoder.encode(normalizarFrase(frase)), 'PBKDF2', false, ['deriveKey'])
  const envoltorio = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: datos.iterations, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  )
  let bruta: ArrayBuffer
  try {
    bruta = await crypto.subtle.decrypt({ name: 'AES-GCM', iv, additionalData: encoder.encode(datos.curso) }, envoltorio, envuelta)
  } catch {
    throw new FraseIncorrecta()
  }
  if (bruta.byteLength !== 32) throw new Error('llave no válida')
  return crypto.subtle.importKey('raw', bruta, 'AES-GCM', false, ['decrypt'])
}

/** Descifra el texto de un `::: notas` con la llave del curso. */
export async function descifrarNota(texto: string, llave: CryptoKey, curso: string): Promise<string> {
  const partes = NOTA.exec(texto)
  if (!partes) throw new Error('formato de nota no válido')
  const iv = desdeBase64Url(partes[1])
  const cifrado = desdeBase64Url(partes[2])
  if (iv.length !== 12 || cifrado.length < 16) throw new Error('formato de nota no válido')
  const bytes = await crypto.subtle.decrypt({ name: 'AES-GCM', iv, additionalData: encoder.encode(curso) }, llave, cifrado)
  return decoder.decode(bytes)
}
