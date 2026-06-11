const Tesseract = require("tesseract.js");

exports.extractTextFromImage = async (imageUrl) => {

  try {

    const result = await Tesseract.recognize(
      imageUrl,
      "eng",
      {
        logger: (m) => console.log(m),
         tessedit_pageseg_mode: 6,
      }
    );

    return result.data.text;

  } catch (error) {

    console.log(error);

    return "";
  }
};