// 文本解析器干的三件事
// 1.判断传入的文本是否包含变量
// 2.构造expression
// 3.构造tokens

const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
const bulidRegex = cached((delimiters) => {
  const open = delimiters[0].replace(regexEscapeRE, "\\$&");
  const close = delimiters[1].replace(regexEscapeRE, "\\$&");
  return new RegExp(open + "((?:.|\\n)" + close, "g");
});

export function parseText(text, delimiters) {
  const tagRE = delimiters ? bulidRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return;
  }
  const tokens = [];
  const rawTokens = [];
  let lastIndex = (tagRE.lastIndex = 0);
  let match, index, tokenValue;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    if (index > lastIndex) {
      rawTokens.push((tokenValue = text.slice(lastIndex, index)));
      tokens.push(JSON.stringify(tokenValue));
    }
    const exp = parseFilters(match[1].trim());
    tokens.push(`_S(${exp})`);
    rawTokens.push({ "@binding": exp });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    rawTokens.push((tokenValue = text.slice(lastIndex)));
    tokens.push(JSON.stringify(tokenValue));
  }
  // 最后数组tokens所有元素用‘+’拼接起来
  return {
    expression: tokens.join("+"),
    tokens: rawTokens,
  };
}
