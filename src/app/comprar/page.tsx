import Link from 'next/link';import PurchaseWizard from '@/components/PurchaseWizard';
export default function Comprar(){return <main className="page"><div className="pageHead"><Link href="/">← Volver</Link><h1>🎟️ Comprar entradas</h1><p>Proceso seguro, sin elección de asientos y con revisión manual del pago.</p></div><PurchaseWizard/></main>}
