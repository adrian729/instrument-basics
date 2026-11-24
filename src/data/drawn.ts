// The credit for the drawings above an instrument's chart (notations/art/): each traced from a maker's photo on
// Wikimedia Commons, under CC BY-SA 4.0, and so shared under it too. A photo: whose, of what, its file there.
type Photo = [owner: string, model: string, file: string];
const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(" ", "_"))}`;
const LICENCE = `<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>`;

export function DRAWINGS(...photos: Photo[]): string {
  const each = photos.map(([owner, model, file]) => `<a href="${commons(file)}">${owner}'s photo of the ${model}</a>`);
  const list = each.length > 1 ? `${each.slice(0, -1).join(", ")} and ${each.at(-1)}` : each[0];
  return ` The drawing${photos.length > 1 ? "s are" : " is"} traced from ${list} (Wikimedia Commons, ${LICENCE}), and shared under the same licence.`;
}
export const DRAWN = (model: string, file: string) => DRAWINGS(["Yamaha Corporation", model, file]);
