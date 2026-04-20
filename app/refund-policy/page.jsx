export const metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <section className="max-w-3xl space-y-4 rounded-2xl border border-[#dbe8bf] bg-white p-6">
      <h1 className="font-display text-3xl text-[#36532f]">Refund Policy</h1>
      <p className="text-[#61755a]">
        Refunds are eligible only for damaged, defective, or incorrect products reported within 48 hours of delivery.
      </p>
      <p className="text-[#61755a]">
        Approved refunds are processed to the original payment method within 5-7 working days.
      </p>
    </section>
  );
}
