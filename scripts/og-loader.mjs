// Loader hook que corrige o bug conhecido do next/og 14.2 no Windows:
// o binário compilado (@vercel/og/index.node.js) resolve os assets .ttf/.wasm
// com fileURLToPath(join(import.meta.url, "../x")), que mangles o file://
// em path do Windows. Substitui por fileURLToPath(new URL("../x", import.meta.url)),
// a forma correta cross-platform. Zero dependências.
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (url.endsWith('@vercel/og/index.node.js')) {
    result.source = String(result.source).replace(
      /join\(import\.meta\.url, "\.\.\/([^"]+)"\)/g,
      'new URL("$1", import.meta.url)'
    );
  }
  return result;
}
