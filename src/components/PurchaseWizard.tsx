"use client";

import { useMemo, useState } from "react";
import { EVENT, FILMS, SNACKS } from "@/lib/config";
import { calculateTotal, type SnackQty } from "@/lib/pricing";

type Buyer = { name: string; phone: string; email: string; studentCode: string; privacy: boolean };

export default function PurchaseWizard() {
  const [step, setStep] = useState(1);
  const [film, setFilm] = useState("demon-slayer");
  const [qty, setQty] = useState(1);
  const [snacks, setSnacks] = useState<SnackQty>({ popcorn: 0, gaseosa: 0, combo: 0 });
  const [buyer, setBuyer] = useState<Buyer>({ name: "", phone: "", email: "", studentCode: "", privacy: false });
  const [proof, setProof] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const total = useMemo(() => calculateTotal(qty, snacks), [qty, snacks]);

  function snack(id: keyof SnackQty, delta: number) {
    setSnacks(current => ({ ...current, [id]: Math.max(0, current[id] + delta) }));
  }

  function updateBuyer(field: keyof Buyer, value: string | boolean) {
    setBuyer(current => ({ ...current, [field]: value }));
    setError("");
  }

  function continueStep() {
    if (step === 4) {
      if (buyer.name.trim().length < 5) return setError("Ingresa tu nombre completo."), undefined;
      if (!/^\d{9}$/.test(buyer.phone.replace(/\s/g, ""))) return setError("Ingresa un teléfono válido de 9 dígitos."), undefined;
      if (!/^\S+@\S+\.\S+$/.test(buyer.email)) return setError("Ingresa un correo válido."), undefined;
      if (!buyer.privacy) return setError("Debes aceptar el tratamiento de datos."), undefined;
    }
    setError("");
    setStep(current => current + 1);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!proof) return setError("La foto del comprobante es obligatoria."), undefined;
    if (proof.size > 5 * 1024 * 1024) return setError("La foto supera el máximo permitido de 5 MB."), undefined;
    if (!["image/jpeg", "image/png", "image/webp"].includes(proof.type)) return setError("Sube una foto JPG, PNG o WEBP."), undefined;

    const data = new FormData();
    data.set("filmId", film); data.set("ticketQty", String(qty)); data.set("name", buyer.name);
    data.set("phone", buyer.phone); data.set("email", buyer.email); data.set("studentCode", buyer.studentCode);
    Object.entries(snacks).forEach(([key, value]) => data.set(key, String(value)));
    data.set("privacy", "true"); data.set("proof", proof);
    setError("");
    try {
      const response = await fetch("/api/reservations", { method: "POST", body: data });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "No se pudo registrar la solicitud.");
      setResult(payload.code);
      setStep(6);
    } catch {
      setError("No se pudo guardar la reserva. El administrador debe conectar la base de datos antes de recibir pagos reales.");
    }
  }

  return <form onSubmit={submit} className="panel">
    <div className="steps">{[1, 2, 3, 4, 5].map(number => <span key={number} className={number <= step ? "on" : ""}/>)}</div>
    {step === 1 && <><h2>1. Elige tu película</h2><div className="formGrid">{FILMS.map(item => <label className="panel" key={item.id}><input type="radio" checked={film === item.id} onChange={() => setFilm(item.id)}/><b>{item.title}</b><p>Horario: {item.schedule}</p><small>{item.capacity} disponibles</small></label>)}</div></>}
    {step === 2 && <><h2>2. Cantidad de entradas</h2><div className="counter"><button type="button" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><b>{qty}</b><button type="button" onClick={() => setQty(Math.min(6, qty + 1))}>+</button></div></>}
    {step === 3 && <><h2>3. Agrega snacks</h2><p>El combo incluye <b>1 popcorn individual + 1 gaseosa personal</b>.</p><div className="snackPicker">{SNACKS.map(item => <div className="snackPick" key={item.id}><b>{item.emoji} {item.name}</b><p>S/ {item.price.toFixed(2)}</p><div className="counter"><button type="button" onClick={() => snack(item.id as keyof SnackQty, -1)}>−</button><span>{snacks[item.id as keyof SnackQty]}</span><button type="button" onClick={() => snack(item.id as keyof SnackQty, 1)}>+</button></div></div>)}</div></>}
    {step === 4 && <><h2>4. Tus datos obligatorios</h2><p>Los campos marcados con * son necesarios para identificar tu pago.</p><div className="formGrid"><label className="field full">Nombre completo *<input value={buyer.name} onChange={event => updateBuyer("name", event.target.value)} required minLength={5}/></label><label className="field">Teléfono *<input value={buyer.phone} onChange={event => updateBuyer("phone", event.target.value)} inputMode="numeric" required/></label><label className="field">Correo *<input type="email" value={buyer.email} onChange={event => updateBuyer("email", event.target.value)} required/></label><label className="field full">Código de estudiante (opcional)<input value={buyer.studentCode} onChange={event => updateBuyer("studentCode", event.target.value)}/></label><label className="field full"><span><input type="checkbox" checked={buyer.privacy} onChange={event => updateBuyer("privacy", event.target.checked)} required/> Acepto el tratamiento de datos para gestionar esta reserva. *</span></label></div></>}
    {step === 5 && <><h2>5. Paga con Yape y sube tu foto</h2><div className="payBox">Número oficial<br/><b>{EVENT.yape}</b><button className="ghost" type="button" onClick={() => navigator.clipboard.writeText("987712599")}>Copiar número</button><ol><li>Paga el importe exacto.</li><li>Comprueba el destinatario en Yape.</li><li>Sube obligatoriamente una foto clara del comprobante.</li></ol></div><label className="field">Foto del comprobante * (JPG, PNG o WEBP; máximo 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp" required onChange={event => { setProof(event.target.files?.[0] || null); setError(""); }}/></label><p className="notice">La solicitud no se enviará sin la foto. El comprobante será revisado manualmente por administración.</p></>}
    {step === 6 && <div style={{ textAlign: "center" }}><h2>¡Recibimos tu solicitud!</h2><p>Tu pago está pendiente de verificación.</p><strong>{result}</strong></div>}
    {error && <p className="formError" role="alert">⚠ {error}</p>}
    {step < 6 && <><div className="summary"><div><span>Entradas</span><span>{qty} × S/ 3</span></div><div><span>Snacks</span><span>Popcorn {snacks.popcorn} · Gaseosa {snacks.gaseosa} · Combo {snacks.combo}</span></div><div><span>Total</span><strong>S/ {total.toFixed(2)}</strong></div></div><div className="actions">{step > 1 && <button className="ghost" type="button" onClick={() => { setError(""); setStep(current => current - 1); }}>← Atrás</button>}{step < 5 ? <button className="cta" type="button" onClick={continueStep}>Continuar →</button> : <button className="cta" type="submit" disabled={!proof}>Enviar solicitud →</button>}</div></>}
  </form>;
}
