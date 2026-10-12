// Pré-carga do hook de loader (ver og-loader.mjs). Rodar com:
// node --import ./scripts/og-load-register.mjs <script>
import { register } from 'node:module';

register('./og-loader.mjs', import.meta.url);
