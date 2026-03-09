import {
  getAllSkills,
  getSkillCategories,
  getSkillsByCategory,
} from "@/lib/skills";
import { Desktop } from "@/components/desktop/Desktop";

export default function Home() {
  const skills = getAllSkills();
  const categories = getSkillCategories();
  const skillsByCategory = getSkillsByCategory();

  return (
    <Desktop
      skills={skills}
      categories={categories}
      skillsByCategory={skillsByCategory}
    />
  );
}
