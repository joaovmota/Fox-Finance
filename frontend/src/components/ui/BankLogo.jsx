import { GENERIC_BANK, banks } from "@/lib/banks";

// Glyphs estilizados (não são logos oficiais 1:1). Cada função recebe a cor de
// texto do banco via `currentColor` e retorna elementos SVG dentro do viewBox
// 64×64. Bancos sem entrada aqui caem em fallback com iniciais.
const GLYPHS = {
  nubank: () => (
    <>
      <path
        d="M22 36c-4-6-4-14 0-20 3-4 8-4 11-1 3 3 3 8 0 12l-4 6c-2 3-5 4-7 3z"
        fill="currentColor"
      />
      <circle cx="43" cy="22" r="4" fill="currentColor" />
    </>
  ),
  inter: () => (
    <>
      <circle cx="32" cy="15" r="4" fill="currentColor" />
      <rect x="26" y="24" width="12" height="24" rx="3" fill="currentColor" />
    </>
  ),
  c6bank: () => (
    <text
      x="32"
      y="43"
      textAnchor="middle"
      fontSize="26"
      fontWeight="900"
      fontFamily="Inter, system-ui, sans-serif"
      letterSpacing="-0.06em"
      fill="currentColor"
    >
      C6
    </text>
  ),
  picpay: () => (
    <>
      <circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" strokeWidth="4" />
      <path
        d="M28 24v16M34 26l4 4-4 4M34 40l-4-4 4-4"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  mercadopago: () => (
    <>
      <path
        d="M14 38c6 6 14 6 22 0 4-3 8-3 12 0"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="20" cy="30" r="4" fill="currentColor" />
      <circle cx="44" cy="30" r="4" fill="currentColor" />
    </>
  ),
  itau: () => (
    <>
      <rect x="20" y="16" width="24" height="32" rx="4" fill="currentColor" />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontSize="22"
        fontWeight="900"
        fontFamily="Inter, system-ui, sans-serif"
        fill="#EC7000"
      >
        i
      </text>
    </>
  ),
  bradesco: () => (
    <>
      <path d="M32 14l8 10-8 10-8-10z" fill="currentColor" />
      <path d="M32 30l8 10-8 10-8-10z" fill="currentColor" opacity="0.7" />
    </>
  ),
  santander: () => (
    <path
      d="M32 12c6 6 10 12 10 18a10 10 0 11-20 0c0-4 3-7 6-8-4 2-5 6-5 9 0-8 4-14 9-19z"
      fill="currentColor"
    />
  ),
  bb: () => (
    <>
      <path d="M32 10l18 22-18 22-18-22z" fill="currentColor" />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontSize="18"
        fontWeight="900"
        fontFamily="Inter, system-ui, sans-serif"
        fill="#0038A8"
      >
        BB
      </text>
    </>
  ),
  next: () => (
    <>
      <circle cx="32" cy="32" r="17" fill="none" stroke="currentColor" strokeWidth="4" />
      <path
        d="M24 40V22l16 20V22"
        stroke="currentColor"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  xp: () => (
    <text
      x="32"
      y="43"
      textAnchor="middle"
      fontSize="24"
      fontWeight="900"
      fontFamily="Inter, system-ui, sans-serif"
      letterSpacing="-0.06em"
      fill="currentColor"
    >
      XP
    </text>
  ),
  btg: () => (
    <>
      <rect x="12" y="20" width="40" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="3" />
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fontSize="12"
        fontWeight="900"
        fontFamily="Inter, system-ui, sans-serif"
        letterSpacing="-0.02em"
        fill="currentColor"
      >
        BTG
      </text>
    </>
  ),
  caixa: () => (
    <>
      <rect x="12" y="18" width="40" height="28" rx="4" fill="currentColor" />
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fontSize="13"
        fontWeight="900"
        fontFamily="Inter, system-ui, sans-serif"
        fill="#FFDF00"
      >
        CAIXA
      </text>
    </>
  ),
  willbank: () => (
    <path
      d="M14 22l7 20 6-14 6 14 6-14 6 14 7-20"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  neon: () => (
    <path
      d="M20 42V22l20 20V22"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  pan: () => (
    <>
      <path d="M14 42V22l18 20V22M32 42h18" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  pagbank: () => (
    <>
      <circle cx="32" cy="32" r="15" fill="none" stroke="currentColor" strokeWidth="4" />
      <text
        x="32"
        y="37"
        textAnchor="middle"
        fontSize="12"
        fontWeight="900"
        fontFamily="Inter, system-ui, sans-serif"
        fill="currentColor"
      >
        Pag
      </text>
    </>
  ),
  sicoob: () => (
    <path
      d="M32 12c10 4 16 12 16 22a16 16 0 11-32 0c0-6 4-11 10-14-4 4-6 8-6 12 10-6 12-14 12-20z"
      fill="currentColor"
    />
  ),
  sicredi: () => (
    <path
      d="M32 12c10 4 16 12 16 22a16 16 0 11-32 0c0-6 4-11 10-14-4 4-6 8-6 12 10-6 12-14 12-20z"
      fill="currentColor"
    />
  ),
  bnb: () => (
    <path
      d="M32 12c10 4 16 12 16 22a16 16 0 11-32 0c0-6 4-11 10-14-4 4-6 8-6 12 10-6 12-14 12-20z"
      fill="currentColor"
    />
  ),
};

function fallbackInitials(name) {
  const words = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  return String(name || "•").slice(0, 2).toUpperCase();
}

/**
 * Marca visual de um banco. Aceita `bankId` ou objeto `bank` completo.
 * Renderiza um SVG com fundo em `cor` e um glyph estilizado usando `corTexto`.
 * Bancos sem glyph caem em fallback com iniciais no tipo Inter.
 */
export function BankLogo({ bankId, bank, size = 32, showBackground = true, radius = 8 }) {
  const resolved = bank || banks.find((item) => item.id === bankId) || GENERIC_BANK;
  const Glyph = GLYPHS[resolved.id];
  const backgroundRadius = radius * (64 / size);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={resolved.nome}
      style={{ color: resolved.corTexto, display: "block" }}
    >
      {showBackground && (
        <rect x="0" y="0" width="64" height="64" rx={backgroundRadius} fill={resolved.cor} />
      )}
      {Glyph ? (
        <Glyph />
      ) : (
        <text
          x="32"
          y="42"
          textAnchor="middle"
          fontSize="24"
          fontWeight="900"
          fontFamily="Inter, system-ui, sans-serif"
          letterSpacing="-0.04em"
          fill="currentColor"
        >
          {fallbackInitials(resolved.nome)}
        </text>
      )}
    </svg>
  );
}
