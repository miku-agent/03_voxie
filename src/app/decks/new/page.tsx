import { listCards } from "@/lib/cards";
import DeckCreateClient from "./DeckCreateClient";

export default async function DeckCreatePage() {
  const cards = await listCards();

  return <DeckCreateClient cards={cards} />;
}
