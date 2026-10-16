"use client";

import Link from "next/link";
import { useState } from "react";

type Lookup = { code?: string; status?: string; film?: string; ticketQty?: number; total?: number; error?: string };

export default function MiReserva() {
  const [result, setResult] = useState<Lookup | null>(null);
  const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setResult(null);
    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch("https://cine-electro-admin-2026.alyson-diaz.chatgpt.site/api/my-reservation", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
      setResult(await response.json());
    } catch { setResult({ error: "No se pudo consultar la reserva." }); }
    finally { setLoading(false); }
  }
  return <main className="page"><Link href="/">← Volver</Link><h1>Consultar mi reserva</h1><form className="panel" onSubmit={submit}><label className="field">Código de reserva<input name="code" placeholder="CE-2026-0001" required/></label><label className="field">Correo usado en la compra<input type="email" name="email" required/></label><button className="cta" disabled={loading}>{loading ? "Consultando…" : "Consultar"}</button>{result && <div className={result.error ? "formError" : "notice"}>{result.error || <><b>{result.code}</b><p>Estado: {result.status}</p><p>{result.film} · {result.ticketQty} entrada(s) · S/ {result.total?.toFixed(2)}</p></>}</div>}</form></main>;
}
