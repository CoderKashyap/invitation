import { InvitationExperience } from "@/components/invitation/InvitationExperience";
import { invitation } from "@/lib/invitation";

export default function Home() {
  return <InvitationExperience data={invitation} />;
}
