import { guData } from "@/data/gudata";
import { notFound } from "next/navigation";
import GuDetail from "@/components/gu/GuDetail";

export default async function GuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gu = guData.find((g) => g.id === id);

  if (!gu) {
    notFound();
  }

  return <GuDetail id={id} guName={gu.name} />;
}
