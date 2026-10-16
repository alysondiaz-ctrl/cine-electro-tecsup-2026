# CINE ELECTRO — TECSUP 2026

Sistema web full-stack para venta y control de entradas. Incluye página pública, compra con entradas y snacks, Yape, comprobante privado, consulta de reserva, administración y control de ingreso mediante QR.

## Estado real

- Operativo sin servicios externos: interfaz responsive, validación, cálculo de totales y pruebas unitarias.
- Preparado pero requiere Supabase: persistencia, comprobantes privados, autenticación, reservas atómicas, aprobación, numeración, QR y check-in.
- No configurado: correo transaccional, QR oficial de Yape y despliegue de producción.

No se debe aceptar ventas reales hasta completar y probar la lista de producción.

## Configuración

1. Crea un proyecto en Supabase.
2. Ejecuta `supabase/migrations/001_cine_electro.sql` en el SQL Editor.
3. Copia `.env.example` a `.env.local` y completa las claves.
4. En Supabase Auth crea manualmente la primera cuenta administradora. No existe contraseña predeterminada.
5. Ejecuta `npm run dev` y abre `http://localhost:3000`.

## Comandos

`npm run dev` · `npm run typecheck` · `npm run lint` · `npm test` · `npm run build`

## Rutas

`/`, `/comprar`, `/mi-reserva`, `/admin`, `/admin/reservas`, `/admin/ingreso`, `/admin/configuracion`.

## Seguridad y producción

Mantén `SUPABASE_SERVICE_ROLE_KEY` únicamente en el servidor. El bucket `payment-proofs` es privado y limitado a 5 MB. Protege `/admin` con Supabase Auth y autorización por rol antes de producción. Configura expiración de reservas, respaldos y retención de datos.

Consulta `docs/PRODUCTION_CHECKLIST.md` antes del lanzamiento.
