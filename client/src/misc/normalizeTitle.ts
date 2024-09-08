// normalizeTitle.ts
export const normalizeTitle = (title: string): string => {
  const suffixPattern =
    /(remaster|remastered|ft\..*|feat\..*|official|video|live|acoustic|instrumental|cover|deluxe|expanded|-)/gi;

  return title
    .replace(suffixPattern, "") // Remove suffixes and everything after them
    .replace(/[^\w\s]/gi, "") // Remove special characters
    .trim() // Remove whitespace from the beginning and end
    .toLowerCase(); // Convert to lowercase
};
