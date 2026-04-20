export const metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <section className="max-w-3xl space-y-4 rounded-2xl border border-[#dbe8bf] bg-white p-6">
      <h1 className="font-display text-3xl text-[#36532f]">Shipping Policy</h1>
      <p className="text-[#61755a]">
        Orders are dispatched within 24-48 hours and typically delivered in 3-7 business days across India.
      </p>
      <p className="text-[#61755a]">
        Delivery timelines may vary for remote locations, festivals, and unforeseen logistics delays.
      </p>
    </section>
  );
}
