/**
 * Downloads a pre-generated skill folder ZIP file.
 * Falls back to opening the GitHub folder on failure.
 */
export async function downloadSkillZip(
  skillId: string
): Promise<void> {
  try {
    const zipUrl = `/downloads/skills/${skillId}.zip`;
    const response = await fetch(zipUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch skill zip: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${skillId}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading skill zip:", error);

    const githubFolderUrl = `https://github.com/erichowens/some_claude_skills/tree/main/.claude/skills/${skillId}`;
    const message = `Unable to download skill zip.\n\nPlease visit the GitHub folder to download manually:\n${githubFolderUrl}`;
    alert(message);
    window.open(githubFolderUrl, "_blank");

    throw error;
  }
}
