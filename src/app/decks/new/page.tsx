import { listCards } from "@/lib/cards";
import { getCurrentUser } from "@/lib/auth";
import DeckCreateClient from "./DeckCreateClient";

export default async function DeckCreatePage() {
  const cards = await listCards();
  const user = await getCurrentUser();

  return <DeckCreateClient cards={cards} requiresAuth={!user} />;
}
