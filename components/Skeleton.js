// Composants skeleton pour les états de chargement

// Pulse de base
function Pulse({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-stone-200 rounded ${className}`}
      aria-hidden="true"
    />
  )
}

// Skeleton d'une carte produit
export function ProductCardSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-stone-100 flex flex-col"
      aria-hidden="true"
    >
      <Pulse className="h-44 rounded-none" />
      <div className="p-4 flex flex-col gap-2.5">
        <Pulse className="h-3 w-16 rounded-full" />
        <Pulse className="h-4 w-3/4" />
        <Pulse className="h-3 w-full" />
        <Pulse className="h-3 w-2/3" />
        <div className="flex justify-between items-center mt-1">
          <Pulse className="h-6 w-20" />
          <Pulse className="h-4 w-14 rounded-full" />
        </div>
        <Pulse className="h-10 w-full rounded-xl mt-1" />
      </div>
    </div>
  )
}

// Grille de skeletons produits
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      role="status"
      aria-label="Chargement des produits..."
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Skeleton d'une ligne de commande admin
export function ReservationRowSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl border border-stone-100 p-5"
      aria-hidden="true"
    >
      <div className="flex justify-between mb-3">
        <div className="flex flex-col gap-2">
          <Pulse className="h-4 w-40" />
          <Pulse className="h-3 w-56" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Pulse className="h-4 w-24" />
          <Pulse className="h-3 w-16" />
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        <Pulse className="h-5 w-20 rounded-full" />
        <Pulse className="h-5 w-24 rounded-full" />
        <Pulse className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex justify-between">
        <Pulse className="h-4 w-28" />
        <div className="flex gap-2">
          <Pulse className="h-8 w-28 rounded-xl" />
          <Pulse className="h-8 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

// Skeleton tableau admin produits
export function ProductTableSkeleton({ rows = 6 }) {
  return (
    <div
      className="bg-white rounded-2xl border border-stone-100 overflow-hidden"
      role="status"
      aria-label="Chargement..."
    >
      <div className="bg-primary-50 px-4 py-3 border-b border-primary-100 flex gap-8">
        {['w-24','w-20','w-16','w-12'].map((w, i) => (
          <Pulse key={i} className={`h-3 ${w}`} />
        ))}
      </div>
      <div className="divide-y divide-stone-50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-3 flex items-center gap-4">
            <Pulse className="h-10 w-10 rounded-lg shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <Pulse className="h-3.5 w-32" />
              <Pulse className="h-2.5 w-16" />
            </div>
            <Pulse className="h-3 w-16 hidden sm:block" />
            <Pulse className="h-3 w-12" />
            <Pulse className="h-3 w-16" />
            <div className="flex gap-1 ml-auto">
              <Pulse className="h-7 w-7 rounded-lg" />
              <Pulse className="h-7 w-7 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
