export const normalizeTitle = (title: string): string => {
  const suffixPattern =
    /(remaster|remastered|ft\..*|feat\..*|official|video|live|acoustic|instrumental|cover|deluxe|expanded|special|extra|remix)/gi;

  return title
    .replace(/[\(\[].*?[\)\]]/g, "") // Remove everything inside parentheses or brackets and the brackets themselves
    .replace(/-.*/, "") // Remove everything after "-"
    .replace(suffixPattern, "") // Remove specific suffixes
    .replace(/[^\w\s]/gi, "") // Remove special characters
    .trim() // Remove leading/trailing whitespace
    .toLowerCase(); // Convert to lowercase
};