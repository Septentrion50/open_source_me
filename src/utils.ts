import { Language  } from "./type";

export const calcPercent = (size: number, totalSize: number): number => {
    return parseFloat((size / totalSize).toFixed(2));
};
  

export const extractLanguagesInfo = (
    languages: any[],
    totalSize: number
  ): Language[] => {
    let languagesInfo: Language[] = [];
    languages.forEach((language) => {
      languagesInfo.push({
        name: language.node.name,
        percentage: calcPercent(language.size, totalSize),
        color: language.node.color,
      });
    });
    return languagesInfo;
  };