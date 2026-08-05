# Decisiones de negocio confirmadas

Registro de decisiones tomadas con el cliente para evitar ambigüedad al implementar.

## Pagos
- Se integran **Stripe y MercadoPago** desde el inicio para la membresía mensual ($99 MXN).
- Riesgo aceptado: duplica el trabajo de integración/webhooks respecto a usar un solo proveedor;
  puede presionar el cronograma del MVP (1-sept). Si se atrasa, la opción de recorte es lanzar
  primero con uno solo y sumar el segundo después del MVP.
- **Stripe**: se usa **Checkout** (página hospedada por Stripe), no Elements — más rápido de
  implementar para el plazo del MVP.
- **Métodos de pago en Stripe**: tarjeta + OXXO ya implementados. SPEI (transferencia) se pidió
  también, pero en Stripe eso requiere el método `customer_balance` con `bank_transfer` tipo
  `mx_bank_transfer`, que típicamente necesita habilitación explícita en la cuenta de Stripe —
  **queda pendiente de confirmar** una vez tengamos acceso al dashboard real; no está en el
  código todavía para no bloquear el resto de la integración.
- Necesario de tu lado para poder probar de verdad: `STRIPE_SECRET_KEY` de modo test como mínimo
  (modo live cuando la cuenta esté verificada para cobrar en MXN/México).

## Skool
- No hay acceso confirmado a una API de Skool para roles/insignias.
- Para el MVP: **exportación CSV manual semanal** (proceso de ~10 min) en vez de automatización.
- Si más adelante se consigue acceso a una API de Skool, se puede reemplazar el CSV por
  sincronización automática sin cambiar el resto del sistema (el campo `skool_sync_status`
  en `users` ya está pensado para ese caso).

## Comisión escalada del Curso (25% → 30%)
- La regla de "30% con 3+ ventas" se interpreta como: **desde la venta #3 del mes en adelante**
  paga 30%; las primeras 2 ventas del mes siguen pagando 25%. **No es retroactivo.**
- Implementado en `server/src/services/commissionEngine.ts` — cuenta ventas confirmadas del
  mismo producto por el mismo promotor en el mes calendario de la venta.

## Comisión de 2do nivel y validación fiscal
- Se construye la lógica y el reporte semanal de comisiones ahora, en paralelo a que el cliente
  confirme con su contador que el modelo (nivel 2 no transitivo, liberación a 10 días) funciona
  fiscalmente en México.
- **No se deben procesar retiros con dinero real hasta tener esa confirmación.** El sistema no
  bloquea esto automáticamente todavía; es un proceso operativo a seguir por el admin.

## Otras reglas de negocio ya implementadas
- Nivel 2 se paga **solo** al referidor directo del promotor (no a niveles superiores de la cadena).
- Comisiones se liberan (`commissionStatus: bloqueada → liberada`) a los 10 días de la venta,
  vía cron diario a las 6:00 AM hora Ciudad de México.
- Producto "Curso con descuento" ($1,999) representa el caso de quien ya compró el libro;
  en el MVP el admin valida esto manualmente al cargar la venta (no hay verificación automática
  de compra previa todavía).

## Pendiente de definir con el cliente
- Umbrales exactos de XP por rango (Aprendiz/Hierro/Plata/Oro/Legendario) — los valores actuales
  en `prisma/seed.ts` (0/500/1500/4000/10000) son un placeholder razonable, no confirmados.
- Qué eventos otorgan XP y cuánto (¿solo ventas? ¿referidos nuevos? ¿renovación de membresía?).
- Cifrado en reposo de CURP/CLABE antes de ir a producción con datos reales.
