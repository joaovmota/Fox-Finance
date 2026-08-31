import { useEffect, useRef, useState } from "react";
import { Camera, Smile, X } from "lucide-react";

const EMOJI_OPTIONS = ["👩", "👨", "👧", "👦", "🧑", "👵", "👴", "🐶", "🐱", "🦊", "🌸", "⭐", "💚", "🔥", "🎯", "🎨"];

/**
 * Marca do dependente. Exibe emoji, foto (base64) ou fallback com iniciais.
 * Não é interativo por padrão — combine com AvatarPicker para editar.
 */
export function DependentAvatar({ avatar, fallback = "?", size = 40 }) {
  const style = { width: size, height: size };
  if (avatar?.type === "photo" && avatar.value) {
    return (
      <span className="dependent-avatar" style={style}>
        <img src={avatar.value} alt="" />
      </span>
    );
  }
  if (avatar?.type === "emoji" && avatar.value) {
    return (
      <span
        className="dependent-avatar dependent-avatar-emoji"
        style={{ ...style, fontSize: Math.round(size * 0.55) }}
      >
        {avatar.value}
      </span>
    );
  }
  return (
    <span
      className="dependent-avatar dependent-avatar-fallback"
      style={{ ...style, fontSize: Math.round(size * 0.4) }}
    >
      {fallback}
    </span>
  );
}

/**
 * Popover clicando no avatar de um dependente. Permite escolher entre
 * emoji da paleta padrão ou fazer upload de foto (armazenada como data URL
 * para o MVP; ao conectar o banco, trocar por upload para storage real).
 */
export function AvatarPicker({ avatar, onChange, onClose, dependentName }) {
  const [mode, setMode] = useState(avatar?.type === "photo" ? "photo" : "emoji");
  const fileRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const onDocClick = (event) => {
      if (!containerRef.current?.contains(event.target)) onClose?.();
    };
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const pickEmoji = (emoji) => {
    onChange?.({ type: "emoji", value: emoji });
    onClose?.();
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange?.({ type: "photo", value: String(reader.result) });
      onClose?.();
    };
    reader.readAsDataURL(file);
  };

  const clear = () => {
    onChange?.(null);
    onClose?.();
  };

  return (
    <div className="avatar-picker" ref={containerRef} role="dialog" aria-label={`Editar avatar de ${dependentName || ""}`}>
      <header className="avatar-picker-head">
        <strong>Avatar</strong>
        <button
          type="button"
          className="avatar-picker-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={14} />
        </button>
      </header>
      <div className="avatar-picker-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "emoji"}
          className={mode === "emoji" ? "is-active" : ""}
          onClick={() => setMode("emoji")}
          data-testid="avatar-picker-emoji-tab"
        >
          <Smile size={13} /> Emoji
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "photo"}
          className={mode === "photo" ? "is-active" : ""}
          onClick={() => setMode("photo")}
          data-testid="avatar-picker-photo-tab"
        >
          <Camera size={13} /> Foto
        </button>
      </div>
      {mode === "emoji" ? (
        <div className="avatar-picker-grid" data-testid="avatar-picker-emoji-grid">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              type="button"
              key={emoji}
              className={`avatar-emoji-cell ${avatar?.value === emoji ? "is-selected" : ""}`}
              onClick={() => pickEmoji(emoji)}
              aria-label={`Escolher ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      ) : (
        <div className="avatar-picker-photo" data-testid="avatar-picker-photo">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            hidden
            data-testid="avatar-picker-file-input"
          />
          <button
            type="button"
            className="fox-dialog-button fox-dialog-button-primary"
            onClick={() => fileRef.current?.click()}
            data-testid="avatar-picker-upload"
          >
            <Camera size={14} />
            Enviar foto
          </button>
          <span className="fox-muted avatar-picker-hint">
            Formatos JPG ou PNG. A imagem é armazenada apenas neste dispositivo enquanto o app está mockado.
          </span>
        </div>
      )}
      <button
        type="button"
        className="avatar-picker-clear"
        onClick={clear}
        data-testid="avatar-picker-clear"
      >
        Usar iniciais
      </button>
    </div>
  );
}
