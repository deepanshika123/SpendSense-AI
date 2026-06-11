exports.cleanOCRText = (text) => {

  return text
    .replace(/\n+/g, " ")
    .replace(/[^\w\s.:/-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

};