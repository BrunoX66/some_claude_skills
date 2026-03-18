import { getAllSkills } from "@/lib/skills";
import { Desktop } from "@/components/desktop/Desktop";

/**
 * Home page — renders the Desktop shell.
 *
 * The getAllSkills() call ensures the static skills.json is generated
 * during the build (it writes to public/data/skills.json as a side effect).
 * The result is NOT passed as props — Desktop loads it client-side
 * from /data/skills.json, avoiding the RSC payload bloat that was
 * causing a 6.8GB build output.
 */
export default async function Home() {
  // Trigger build-time JSON generation (result not passed to client)
  await getAllSkills();

  return <Desktop />;
}
