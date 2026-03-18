import {
  getAllSkills,
  getSkillById,
} from "@/lib/skills";
import { Desktop } from "@/components/desktop/Desktop";
import type { Metadata } from "next";

interface SkillPageProps {
  params: Promise<{ id: string }>;
}

/** Generate static paths for all skills at build time. */
export async function generateStaticParams() {
  const skills = await getAllSkills();
  return skills.map((s) => ({ id: s.id }));
}

/** Dynamic OG metadata per skill. */
export async function generateMetadata({
  params,
}: SkillPageProps): Promise<Metadata> {
  const { id } = await params;
  const skill = await getSkillById(id);

  if (!skill) {
    return { title: "Skill Not Found | Some Claude Skills" };
  }

  return {
    title: `${skill.title} | Some Claude Skills`,
    description: skill.description,
    openGraph: {
      title: `${skill.title} — Claude Code Skill`,
      description: skill.description,
      images: [skill.heroImage],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${skill.title} — Claude Code Skill`,
      description: skill.description,
      images: [skill.heroImage],
    },
  };
}

/**
 * Skill deep link page — opens the Desktop with a specific skill window.
 *
 * Skills data is loaded client-side from /data/skills.json.
 * Only `initialOpenSkill` is passed as a prop (a simple string, not the
 * full corpus), keeping the RSC payload tiny.
 */
export default async function SkillPage({ params }: SkillPageProps) {
  const { id } = await params;

  return <Desktop initialOpenSkill={id} />;
}
